import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { adminRouter } from './server/adminRoutes';
import { publicRouter } from './server/publicRoutes';
import { adminDataService } from './server/adminDataService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1); // Trust first proxy for X-Forwarded-For

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Simple In-Memory Rate Limiter for AI endpoints
  const aiRateLimitMap = new Map<string, { count: number; firstAttemptAt: number }>();
  const aiRateLimitMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = aiRateLimitMap.get(ip);
    
    // 20 requests per minute per IP for AI endpoints
    const limit = 20;
    const windowMs = 60000;

    if (!entry) {
      aiRateLimitMap.set(ip, { count: 1, firstAttemptAt: now });
      return next();
    }

    if (now - entry.firstAttemptAt > windowMs) {
      aiRateLimitMap.set(ip, { count: 1, firstAttemptAt: now });
      return next();
    }

    if (entry.count >= limit) {
      const retryAfter = Math.ceil((windowMs - (now - entry.firstAttemptAt)) / 1000);
      return res.status(429).json({ error: `Quá nhiều yêu cầu AI. Vui lòng thử lại sau ${retryAfter} giây.` });
    }

    entry.count += 1;
    next();
  };

  // Mount Admin API Router (Protected with requireAdmin, except /login)
  app.use('/api/admin', adminRouter);

  // Mount Public API Router (Transparent data info, no authentication needed)
  app.use('/api/public', publicRouter);

  // Initialize Gemini client lazily
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return aiClient;
  }

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      service: 'Shape Your Future! Career Guidance Engine',
      version: '26.1.0'
    });
  });

  // Endpoint connection test API for local LLM (Ollama, LM Studio, etc.)
  app.post('/api/ai/test-endpoint', aiRateLimitMiddleware, async (req, res) => {
    const { endpoint, modelName, apiKey } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint URL is required' });
    }

    const cleanEndpoint = endpoint.replace(/\/+$/, '');

    // SSRF Protection
    try {
      const parsedUrl = new URL(cleanEndpoint);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return res.status(400).json({ error: 'Only HTTP and HTTPS protocols are allowed' });
      }
      if (parsedUrl.hostname === '169.254.169.254' || parsedUrl.hostname.endsWith('metadata.google.internal')) {
        return res.status(403).json({ error: 'Access to metadata endpoints is forbidden' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid endpoint URL format' });
    }

    const startTime = Date.now();

    try {
      // 1. Try Ollama tags endpoint
      try {
        const ollamaRes = await fetch(`${cleanEndpoint}/api/tags`, {
          method: 'GET',
          signal: AbortSignal.timeout(3500)
        });
        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          const models = (data.models || []).map((m: any) => m.name || m.model);
          const latency = Date.now() - startTime;
          return res.json({
            status: 'ok',
            latency,
            message: `Kết nối thành công tới máy chủ Ollama (${latency}ms). Các model sẵn có: ${models.slice(0, 4).join(', ') || 'Chưa tải model'}`
          });
        }
      } catch (_) {}

      // 2. Try OpenAI-compatible /models endpoint (LM Studio, vLLM, LocalAI)
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        const modelsRes = await fetch(`${cleanEndpoint}/models`, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(3500)
        });
        if (modelsRes.ok) {
          const latency = Date.now() - startTime;
          return res.json({
            status: 'ok',
            latency,
            message: `Kết nối thành công tới OpenAI-compatible local server tại ${cleanEndpoint} (${latency}ms).`
          });
        }
      } catch (_) {}

      // 3. Fallback direct ping
      const pingRes = await fetch(cleanEndpoint, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      const latency = Date.now() - startTime;
      return res.json({
        status: 'ok',
        latency,
        message: `Máy chủ cục bộ phản hồi thành công mã trạng thái ${pingRes.status} (${latency}ms).`
      });
    } catch (err: any) {
      return res.status(502).json({
        error: `Không thể kết nối tới máy chủ cục bộ tại ${cleanEndpoint}. Hãy chắc chắn bạn đã khởi động Ollama/LM Studio và cho phép CORS (OLLAMA_ORIGINS="*").`,
        details: err?.message
      });
    }
  });

  // Helper to format full comprehensive survey results for Gemini AI
  function buildSurveyContextSummary(context: any): string {
    const profile = context?.profileContext || {};
    const recs = context?.surveyRecommendations || context?.recommendations || [];
    const riasec = profile?.riaSecProfile || {};
    const scores = profile?.riaSecScores || riasec?.scores || {};
    const mbti = profile?.mbtiResult || {};
    const exams = profile?.examScores || {};
    const workPrefs = profile?.workPreferences || {};

    return `=== DỮ LIỆU KẾT QUẢ KHẢO SÁT HƯỚNG NGHIỆP TOÀN DIỆN CỦA HỌC VIÊN ===

1. THÔNG TIN HỌC VẤN & CÁ NHÂN:
- Họ tên: ${profile.name || 'Học viên'}
- Độ tuổi: ${profile.age || 17} tuổi (Nhóm tuổi: ${profile.ageGroup || '15-18'})
- Tỉnh / Thành phố: ${profile.province || 'Toàn quốc'}
- Trình độ / Cấp học: ${profile.grade || profile.educationLevel || 'Học sinh THPT'}
- Học lực / Điểm trung bình GPA: ${profile.academicGPA || 'Khá - Giỏi'}
- Môn học yêu thích: ${(profile.favoriteSubjects || []).join(', ') || 'Chưa cập nhật'}
- Môn học tự tin điểm cao nhất: ${(profile.confidentSubjects || []).join(', ') || 'Chưa cập nhật'}
- Sở trường & Năng khiếu: ${(profile.strengths || []).join(', ') || 'Tư duy logic, giải quyết vấn đề'}

2. KẾT QUẢ THI ĐÁNH GIÁ NĂNG LỰC (ĐGNL) & TỐT NGHIỆP THPT:
- Điểm HSA (ĐHQG Hà Nội - Thang 150): ${exams.hsaScore ? `${exams.hsaScore}/150 điểm` : 'Chưa thi / Đang ôn tập'}
- Điểm TSA (Bách Khoa Hà Nội - Thang 100): ${exams.tsaScore ? `${exams.tsaScore}/100 điểm` : 'Chưa thi / Đang ôn tập'}
- Điểm V-ACT (ĐHQG TP.HCM - Thang 1200): ${exams.vactScore ? `${exams.vactScore}/1200 điểm` : 'Chưa thi / Đang ôn tập'}
- Khối thi xét tuyển THPT: ${exams.thptCombo || 'A00 / A01 / D01'} - Điểm thi ước tính / thực tế: ${exams.thptScore ? `${exams.thptScore} điểm` : 'Chưa cập nhật'}
- Chứng chỉ / Giải thưởng học sinh giỏi: ${(exams.awards || []).join(', ') || 'Chưa có chứng chỉ riêng'}

3. KẾT QUẢ TRẮC NGHIỆM SỞ THÍCH NGHỀ NGHIỆP HOLLAND (RIASEC):
- Mã Holland đại diện: ${profile.riasecCode || riasec.code || 'IRC'}
- Điểm số chi tiết 6 nhóm sở thích nghề nghiệp:
  * R (Realistic - Kỹ thuật, Vận hành, Thực tế): ${scores.R !== undefined ? Math.round(scores.R * 100) : 'N/A'}%
  * I (Investigative - Nghiên cứu, Tư duy logic, Khoa học): ${scores.I !== undefined ? Math.round(scores.I * 100) : 'N/A'}%
  * A (Artistic - Nghệ thuật, Sáng tạo, Trực giác): ${scores.A !== undefined ? Math.round(scores.A * 100) : 'N/A'}%
  * S (Social - Xã hội, Giáo dục, Giúp đỡ con người): ${scores.S !== undefined ? Math.round(scores.S * 100) : 'N/A'}%
  * E (Enterprising - Quản trị, Lãnh đạo, Kinh doanh): ${scores.E !== undefined ? Math.round(scores.E * 100) : 'N/A'}%
  * C (Conventional - Nghiệp vụ, Quy chuẩn, Tổ chức): ${scores.C !== undefined ? Math.round(scores.C * 100) : 'N/A'}%
- Đặc trưng tính cách nghề nghiệp: ${riasec.description || 'Có thiên hướng nghiên cứu sâu, phân tích logic và giải quyết các bài toán kỹ thuật phức tạp.'}

4. KẾT QUẢ TRẮC NGHIỆM TÍNH CÁCH MBTI:
- Nhóm tính cách đại diện: ${profile.mbtiType || 'INTJ'}
- Phân bố 4 cặp chiều kích tâm lý:
  * Xu hướng năng lượng: ${mbti.traits?.IE === 'E' ? 'Hướng ngoại (E)' : 'Hướng nội (I)'}
  * Thu nhận thông tin: ${mbti.traits?.SN === 'S' ? 'Giác quan thực tế (S)' : 'Trực giác khái quát (N)'}
  * Đưa ra quyết định: ${mbti.traits?.TF === 'F' ? 'Cảm xúc & Giá trị (F)' : 'Tư duy logic khách quan (T)'}
  * Định hướng lối sống: ${mbti.traits?.JP === 'P' ? 'Linh hoạt ứng biến (P)' : 'Nguyên tắc & Kế hoạch (J)'}
- Ghi chú phong cách: ${mbti.notes || 'Tư duy chiến lược, độc lập, có mục tiêu rõ ràng và hướng tới hiệu quả cao.'}

5. PHONG CÁCH LÀM VIỆC, SỞ THÍCH & MỤC TIÊU SỰ NGHIỆP:
- Sở thích cá nhân: ${(profile.interests || []).join(', ') || 'Khám phá công nghệ, giải quyết vấn đề'}
- Kỹ năng thế mạnh hiện có: ${(profile.skills || []).join(', ') || 'Tư duy logic, giải toán, tự học'}
- Ưu tiên nghề nghiệp hàng đầu: ${(profile.careerPriorities || []).join(', ') || 'Cơ hội phát triển, Mức lương tốt, Môi trường năng động'}
- Phong cách làm việc: Nhóm vs Độc lập (${workPrefs.teamworkVsSolo || 'Cân bằng'}), Thực hành vs Lý thuyết (${workPrefs.handsOnVsAbstract || 'Cân bằng'}), Hình thức (${workPrefs.remotePreference || 'Linh hoạt'})
- Ngành nghề người học tự định hướng / quan tâm: ${profile.interestedMajorInput || 'Đang khám phá đa ngành'}

6. KẾT QUẢ TÍNH TOÁN CỦA THUẬT TOÁN ĐỀ XUẤT NGHỀ NGHIỆP (TOP MATCHES):
${recs.length > 0 ? recs.slice(0, 5).map((r: any, idx: number) => {
  const career = r.career || r;
  const score = r.overallScore ? `${Math.round(r.overallScore)}%` : '';
  const cluster = career.careerCluster || 'Khoa học Kỹ thuật';
  const salary = career.salaryInfo?.rangeDescription || '15 - 30 triệu VNĐ/tháng';
  const skills = (career.requiredSkills || []).slice(0, 4).join(', ');
  return `  ${idx + 1}. ${career.title || career.careerTitle} (${cluster}) - Độ phù hợp: ${score || 'Rất cao'}
     + Mức lương tham khảo: ${salary}
     + Kỹ năng cốt lõi: ${skills}`;
}).join('\n') : `  1. ${context?.careerTitle || 'Chuyên viên Công nghệ & Phân tích'} (${context?.cluster || 'Khoa học Kỹ thuật'})
     + Mức lương: ${context?.salaryLevel || '15 - 25 triệu VNĐ/tháng'}
     + Kỹ năng yêu cầu: ${(context?.requiredSkills || []).slice(0, 4).join(', ')}`}

7. PHÂN TÍCH KHOẢNG CÁCH KỸ NĂNG (SKILL GAP ANALYSIS):
- Nghề mục tiêu: ${context?.careerTitle || 'Chuyên viên Công nghệ & Phân tích'}
- Kỹ năng đã thành thạo: ${(context?.skillGapAnalysis?.matchedSkills || context?.userMatchedSkills || []).join(', ') || 'Chưa cập nhật'}
- Kỹ năng đang tích lũy / phát triển: ${(context?.skillGapAnalysis?.developingSkills || []).join(', ') || 'Đang tích lũy qua môn học'}
- Kỹ năng then chốt còn thiếu cần ưu tiên học: ${(context?.skillGapAnalysis?.criticalGaps || context?.skillGapAnalysis?.missingSkills || context?.userMissingSkills || []).join(', ') || 'Cần bổ sung đồ án thực hành'}
- Mức độ sẵn sàng / tương thích kỹ năng: ${context?.skillGapAnalysis?.overallReadiness !== undefined ? `${context.skillGapAnalysis.overallReadiness}%` : 'Đang phát triển tốt'}

8. LỘ TRÌNH RÈN LUYỆN NGHỀ NGHIỆP HÀNH ĐỘNG (LEARNING ROADMAP):
${(context?.roadmapSummary?.phases && context.roadmapSummary.phases.length > 0) ? context.roadmapSummary.phases.map((p: any, idx: number) => {
  return `  * Giai đoạn ${idx + 1}: ${p.name} (Thời gian: ${p.duration || '2-3 tháng'})
    - Trọng tâm: ${p.focus || 'Nền tảng'}
    - Hành động then chốt: ${(p.keyActions || []).join(', ')}
    - Cột mốc đầu ra: ${p.milestone || 'Hoàn thành mini-project'}`;
}).join('\n') : '  * Lộ trình tổng thể: Giai đoạn 1 (Nền tảng lý thuyết & ngoại ngữ) → Giai đoạn 2 (Dự án thực tế & kỹ năng chuyên môn) → Giai đoạn 3 (Thực tập & đồ án tốt nghiệp).'}

9. PHÂN TÍCH TÁC ĐỘNG CỦA AI & XU HƯỚNG TƯƠNG LAI 3–5 NĂM (AI IMPACT & 3-5 YEARS OUTLOOK):
- Khung thời gian dự báo: 3–5 năm (định hướng năng lực, không cam kết việc làm cố định).
- 1. Tự động hóa & Tác vụ AI hỗ trợ (AI Automation):
  • Định hướng tác động AI trong hồ sơ nghề: ${context?.aiImpactAnalysis?.directAiImpact || (typeof context?.aiImpact === 'string' ? context.aiImpact : 'AI đóng vai trò công cụ hỗ trợ tăng năng suất; con người chịu trách nhiệm kiểm định và ra quyết định.')}
  • Các tác vụ AI có thể hỗ trợ / đẩy nhanh: ${(context?.aiImpactAnalysis?.assistableTasks && context.aiImpactAnalysis.assistableTasks.length > 0) ? context.aiImpactAnalysis.assistableTasks.join('; ') : 'Các tác vụ tra cứu, xử lý dữ liệu và soạn thảo quy chuẩn ban đầu.'}
  • Tóm tắt phạm vi: ${context?.aiImpactAnalysis?.automatedAspectsSummary || 'Hỗ trợ thao tác lặp lại, giải phóng thời gian cho công việc phân tích sâu.'}
- 2. Thế mạnh con người (Human Advantage):
  • Năng lực con người vẫn quan trọng: ${(context?.aiImpactAnalysis?.humanAbilities && context.aiImpactAnalysis.humanAbilities.length > 0) ? context.aiImpactAnalysis.humanAbilities.join('; ') : 'Tư duy phản biện, thấu cảm, đạo đức nghề nghiệp và giải quyết vấn đề phức tạp.'}
  • Điểm then chốt không thể thay thế: ${context?.aiImpactAnalysis?.humanAdvantageSummary || 'Khả năng chịu trách nhiệm pháp lý và đưa ra phán đoán trong tình huống mơ hồ.'}
- 3. Nhu cầu kỹ năng mới (Skill Demand):
  • Kỹ năng gia tăng tầm quan trọng: ${(context?.aiImpactAnalysis?.emergingSkills && context.aiImpactAnalysis.emergingSkills.length > 0) ? context.aiImpactAnalysis.emergingSkills.join(', ') : 'Kỹ năng cộng tác với AI, phân tích định lượng và tư duy liên ngành.'}
  • Xu hướng thị trường ghi nhận: ${context?.aiImpactAnalysis?.marketTrendSummary || (typeof context?.futureTrends === 'string' ? context.futureTrends : 'Dữ liệu xu hướng theo hồ sơ nghề.')}
- 4. Học sinh nên chuẩn bị gì (Preparation = Profile + Skill Gap + Career + Future Trends):
${(context?.aiImpactAnalysis?.tailoredAdvice && context.aiImpactAnalysis.tailoredAdvice.length > 0) ? context.aiImpactAnalysis.tailoredAdvice.map((a: string) => `  • ${a}`).join('\n') : '  • Bổ sung các kỹ năng cốt lõi còn thiếu và làm quen với công cụ AI chuyên ngành.'}
- 5. Phân định dữ liệu & Tính bất định (Grounding & Uncertainty):
  • Dữ liệu đã xác thực trong hệ thống (Known data): ${(context?.aiImpactAnalysis?.knownData && context.aiImpactAnalysis.knownData.length > 0) ? context.aiImpactAnalysis.knownData.join(' | ') : 'Nhiệm vụ và yêu cầu kỹ năng trong CSDL nghề nghiệp.'}
  • Suy luận nghiệp vụ (Inference): ${(context?.aiImpactAnalysis?.inferences && context.aiImpactAnalysis.inferences.length > 0) ? context.aiImpactAnalysis.inferences.join(' | ') : 'Mức độ phù hợp dựa trên hồ sơ học sinh và đặc thù ngành.'}
  • Yếu tố bất định trong 3–5 năm tới (Future uncertainty): ${(context?.aiImpactAnalysis?.uncertainties && context.aiImpactAnalysis.uncertainties.length > 0) ? context.aiImpactAnalysis.uncertainties.join(' | ') : 'Tốc độ phát triển công nghệ AI, chính sách quản lý và biến động thị trường lao động.'}
  • LƯU Ý BẮT BUỘC: Dự báo 3–5 năm mang tính định hướng, KHÔNG được trình bày như sự thật chắc chắn. Tuyệt đối không tự bịa phần trăm tự động hóa, số liệu thị trường hay tiền lương không có trong dữ liệu!

10. LỘ TRÌNH THĂNG TIẾN NGHỀ NGHIỆP (CAREER LADDER):
- Khởi điểm (Entry Level): ${context?.progressionPath?.entry || 'Thực tập sinh / Chuyên viên sơ cấp (0 - 2 năm)'}
- Trung cấp (Mid Level): ${context?.progressionPath?.mid || 'Chuyên viên chính / Trưởng nhóm chuyên môn (2 - 5 năm)'}
- Cấp cao (Senior Level): ${context?.progressionPath?.senior || 'Chuyên gia cao cấp / Quản lý / Giám đốc chuyên môn (5+ năm)'}

11. BẢNG SO SÁNH ĐỐI CHIẾU CÁC NGÀNH NGHỀ TRỌNG ĐIỂM (CAREER COMPARISON):
${(context?.careerComparison && context.careerComparison.length > 0) ? context.careerComparison.map((c: any, idx: number) => {
  return `  ${idx + 1}. ${c.title} (${c.cluster}):
     • Mức độ phù hợp: ${c.matchScore ? `${c.matchScore}%` : 'Cao'} | Mức lương: ${c.salary}
     • Kỹ năng cốt lõi: ${(c.requiredSkills || []).join(', ')}
     • Tác động AI: ${c.aiImpact || 'Bổ trợ công việc'} | Xu hướng: ${c.futureTrends || 'Tăng trưởng tốt'}`;
}).join('\n') : '  (Chưa có danh sách đối sánh nhiều ngành)'}

12. DANH SÁCH ĐỐI SÁNH CÁC TRƯỜNG ĐẠI HỌC & CƠ SỞ ĐÀO TẠO TIÊU BIỂU TẠI VIỆT NAM (RAG BENCHMARKS):
- Nhóm 1 (Top 1 Trọng điểm Quốc gia): Đại học Bách Khoa Hà Nội (HUST - Chuẩn TSA 65-85+), Trường ĐH Công nghệ - ĐHQG Hà Nội (UET - Chuẩn HSA 95-115+), ĐH Bách Khoa TP.HCM & UIT (Chuẩn V-ACT 820-950+), ĐH Ngoại Thương (FTU), Kinh tế Quốc dân (NEU), ĐH Y Hà Nội / Y Dược TP.HCM.
- Nhóm 2 (Top 2 Chuyên sâu & Thực hành Uy tín): Học viện Bưu chính Viễn thông (PTIT), ĐH Sư phạm Kỹ thuật TP.HCM (HCMUTE), ĐH FPT, Bách Khoa Đà Nẵng, ĐH Cần Thơ, Phenikaa.
- Nhóm 3 (Cao đẳng & Trường nghề Uy tín chất lượng cao - Đi làm sớm / Thực học thực nghiệp): Cao đẳng Kỹ thuật Cao Thắng (TP.HCM), FPT Polytechnic, Cao đẳng Nghề Bách Khoa Hà Nội (HACTECH), Cao đẳng Công nghệ Thủ Đức (TDC), Cao đẳng Nghề Công nghệ Cao Hà Nội (HHT).
=============================================================`;
  }

  // AI Counselor chat API endpoint with Gemini 3.8 Flash, Local Ollama & Multi-turn Conversation Memory
  app.post('/api/ai/counselor', aiRateLimitMiddleware, async (req, res) => {
    const { context, chatHistory, language, llmConfig } = req.body;
    const userQuestion = req.body?.userQuestion || req.body?.question || req.body?.prompt;

    if (!userQuestion || typeof userQuestion !== 'string' || !userQuestion.trim()) {
      return res.status(400).json({ error: 'User question is required' });
    }

    const isVietnamese = language !== 'en';
    const age = Number(context?.profileContext?.age || 17);
    const ageGroup = context?.profileContext?.ageGroup || (age <= 10 ? '6-10' : age <= 14 ? '11-14' : age <= 18 ? '15-18' : age <= 24 ? '19-24' : age <= 35 ? '25-35' : '35+');
    const style = llmConfig?.systemPromptStyle || 'strategic';

    try {
      // Strictly use gemini-3.8-flash as the state-of-the-art fast reasoning model
      const chosenModel = 'gemini-3.8-flash';
      const temperature = typeof llmConfig?.temperature === 'number' ? llmConfig.temperature : 0.7;

      // Deeply specialized age-adaptive guidance instructions
      let ageSpecificDirectives = '';
      if (ageGroup === '6-10') {
        ageSpecificDirectives = `
- ĐỘ TUỔI HIỆN TẠI: 6 - 10 TUỔI (TIỂU HỌC / THIẾU NHI).
- ĐẶC BIỆT LƯU Ý: Tuyệt đối KHÔNG tạo áp lực thi cử đại học, điểm chuẩn hay chọn nghề quá sớm.
- HƯỚNG TƯ VẤN: Khơi gợi niềm vui học tập, tò mò khám phá khoa học đời thường, các trò chơi rèn luyện tư duy logic, hoạt động STEM vui nhộn, câu lạc bộ năng khiếu nghệ thuật / thể thao và giao tiếp bạn bè.
- NGÔN TỪ: Thân thiện, ấm áp, truyền cảm hứng, ngắn gọn, dễ hiểu.`;
      } else if (ageGroup === '11-14') {
        ageSpecificDirectives = `
- ĐỘ TUỔI HIỆN TẠI: 11 - 14 TUỔI (THCS / CẤP 2).
- HƯỚNG TƯ VẤN: Khám phá thiên hướng môn học (Tự nhiên vs Xã hội), phương pháp tự học và quản lý thời gian, định hướng thi vào lớp 10 (trường chuyên, trường công lập chất lượng cao, trường quốc tế hoặc song bằng), trải nghiệm nghiên cứu KHKT trẻ.
- NGÔN TỪ: Khích lệ, định hướng bài bản, nuôi dưỡng khát vọng khám phá.`;
      } else if (ageGroup === '15-18') {
        ageSpecificDirectives = `
- ĐỘ TUỔI HIỆN TẠI: 15 - 18 TUỔI (THPT / CẤP 3).
- HƯỚNG TƯ VẤN CHIẾN LƯỢC: Chiến lược tuyển sinh Đại học chuyên sâu tại Việt Nam.
  * Phân tích đối chiếu điểm thi thực tế của học sinh (HSA ĐHQG Hà Nội, TSA Bách Khoa Hà Nội, V-ACT ĐHQG TP.HCM, điểm thi THPT theo tổ hợp A00, A01, B00, D01...).
  * So sánh cơ hội thực tế giữa Nhóm trường Đại học TOP 1 (Bách Khoa HUST, ĐHQG UET/UIT, Ngoại thương FTU, Kinh tế Quốc dân NEU, Y Hà Nội...) và Nhóm trường Top 2 Chuyên sâu (PTIT, Sư phạm Kỹ thuật HCMUTE, FPT, Bách Khoa Đà Nẵng, Cần Thơ...).
  * Chiến thuật kết hợp phương thức xét tuyển sớm (học bạ, giải HSG, chứng chỉ IELTS / SAT) và thi tốt nghiệp THPT để tối ưu cơ hội trúng tuyển.
  * Đưa ra lời khuyên thiết thực về đặt thứ tự nguyện vọng an toàn (nguyện vọng mơ ước, nguyện vọng vừa sức, nguyện vọng an toàn).
- NGÔN TỪ: Rõ ràng, chiến lược, sắc bén, định hướng thực tế và truyền cảm hứng.`;
      } else if (ageGroup === '19-24') {
        ageSpecificDirectives = `
- ĐỘ TUỔI HIỆN TẠI: 19 - 24 TUỔI (SINH VIÊN ĐẠI HỌC / CAO ĐẲNG / HỌC NGHỀ).
- HƯỚNG TƯ VẤN: Chuyên môn hóa chuyên ngành, xây dựng Portfolio/GitHub, chuẩn bị CV ứng tuyển thực tập (Internship), chứng chỉ nghề nghiệp quốc tế (AWS, Cisco, CFA, CPA, IELTS chuyên ngành), kỹ năng phỏng vấn doanh nghiệp và mức lương khởi điểm.`;
      } else if (ageGroup === '25-35') {
        ageSpecificDirectives = `
- ĐỘ TUỔI HIỆN TẠI: 25 - 35 TUỔI (NGƯỜI ĐI LÀM / CHUYỂN NGÀNH).
- HƯỚNG TƯ VẤN: Chiến lược chuyển đổi nghề nghiệp (Career Transition / Reskilling) mà vẫn duy trì dòng tiền ổn định; đánh giá kỹ năng có thể chuyển đổi (Transferable Skills); khóa học ngắn hạn thực chiến; lộ trình bứt phá thu nhập lên mức chuyên gia hoặc quản lý cấp trung.`;
      } else {
        ageSpecificDirectives = `
- ĐỘ TUỔI HIỆN TẠI: 35+ TUỔI (CHUYÊN GIA / QUẢN LÝ CẤP CAO).
- HƯỚNG TƯ VẤN: Định vị vai trò lãnh đạo, cố vấn cấp cao (Advisor/Consultant), khởi sự kinh doanh độc lập, phát triển mạng lưới quan hệ sâu rộng và cân bằng bền vững giữa sự nghiệp và cuộc sống gia đình.`;
      }

      let personaDirective = '';
      if (style === 'empathetic') {
        personaDirective = 'PHONG CÁCH TƯ VẤN: Tận tâm, lắng nghe sâu sắc, khích lệ tinh thần, tạo cảm giác an tâm và tin tưởng.';
      } else if (style === 'analytical') {
        personaDirective = 'PHONG CÁCH TƯ VẤN: Logic, khoa học dữ liệu, khách quan, phân tích rõ ưu/nhược điểm, xác suất và dữ liệu thị trường.';
      } else {
        personaDirective = 'PHONG CÁCH TƯ VẤN: Chiến lược gia thực chiến, tập trung vào hành động cụ thể, các mốc thời gian và kết quả đầu ra đo lường được.';
      }

      const surveySummary = buildSurveyContextSummary(context);

      const systemInstruction = `Bạn là Trợ lý Cố vấn Hướng nghiệp Trí tuệ Nhân tạo Cao cấp (Senior AI Career Guidance Counselor & Education Strategist) của Nền tảng "Shape Your Future!".
Bạn có trí thông minh vượt trội, am hiểu sâu sắc hệ thống giáo dục, kỳ thi tuyển sinh và thị trường việc làm tại Việt Nam.

DƯỚI ĐÂY LÀ TOÀN BỘ DỮ LIỆU KHẢO SÁT HƯỚNG NGHIỆP CỦA HỌC VIÊN:
${surveySummary}

QUY TẮC TƯ VẤN BẮT BUỘC:
1. LUÔN CÁ NHÂN HÓA SÂU SẮC: Luôn viện dẫn và kết nối câu trả lời với chính xác dữ liệu của học viên (Mã Holland RIASEC, MBTI, Điểm thi HSA/TSA/THPT, Môn học yêu thích, Kỹ năng và Ngành nghề đề xuất). Không lặp lại máy móc thông tin học viên đã cung cấp nếu không cần thiết.
2. ĐA DẠNG HÓA CON ĐƯỜNG PHÁT TRIỂN NGHỀ NGHIỆP:
   * "Đại học không phải là con đường duy nhất để phát triển nghề nghiệp."
   * Khi năng lực học tập hoặc điểm thi của học viên chưa cao, chưa phù hợp với các trường đại học top đầu, hoặc học viên có thiên hướng thực hành cao (Realistic R cao, thích làm việc thực tế, muốn tự chủ tài chính sớm):
     - Chủ động gợi ý các hướng đi thực tế: Trường Cao đẳng Nghề chất lượng cao (Cao Thắng, FPT Polytechnic, HACTECH, Cao đẳng Công nghệ Thủ Đức, HHT...), học nghề thực hành kết hợp đi làm sớm, các chứng chỉ nghề nghiệp chuyên môn quốc tế và tích lũy kỹ năng thực chiến.
     - Khích lệ tinh thần người học: Thị trường lao động hiện đại coi trọng năng lực thực tế, tay nghề vững vàng và thái độ làm việc hơn là chỉ bằng cấp học thuật đơn thuần.
3. MBTI CHỈ LÀ YẾU TỐ BỔ TRỢ:
   * MBTI chỉ là một góc nhìn tham khảo về phong cách tư duy và tương tác, TUYỆT ĐỐI KHÔNG được dùng MBTI để quyết định hoặc gò ép nghề nghiệp một cách tuyệt đối (Trọng số MBTI trong hệ thống chỉ chiếm 5%).
4. DUY TRÌ BỐI CẢNH HỘI THOẠI: Hãy nhớ các lượt trao đổi trước đó trong cuộc trò chuyện để tư vấn liền mạch, không lặp lại câu hỏi hay đưa thông tin mâu thuẫn.
5. ${personaDirective}
6. ${ageSpecificDirectives}
7. CẤU TRÚC VÀ TRÌNH BÀY KHOA HỌC (TỐI ƯU CHO HỌC SINH THPT):
   - Giữ giọng văn chuyên nghiệp nhưng thân thiện, dễ hiểu đối với học sinh THPT. Tập trung vào thông tin có giá trị ra quyết định, hạn chế diễn giải dài dòng, sáo rỗng hoặc các câu kết luận chung chung.
   - Cấu trúc tổng quát của câu trả lời:
     Kết luận ngắn
     Các lựa chọn phù hợp
     Phân tích từng lựa chọn
     Khuyến nghị cá nhân hóa
     Các bước tiếp theo nếu cần
   - ƯU TIÊN TÍNH DỄ ĐỌC TRÊN THIẾT BỊ DI ĐỘNG & WEB: Hạn chế tối đa các ký tự trang trí không cần thiết (*, |, -, #, ---). TUYỆT ĐỐI KHÔNG DÙNG BẢNG MARKDOWN cho nội dung tư vấn dài hoặc nhiều thông tin. Thay vào đó, trình bày từng trường, ngành nghề hoặc lựa chọn thành từng mục riêng.
   - Định dạng danh sách lựa chọn trường học / ngành nghề:
     [Tên lựa chọn]
     • Điểm phù hợp: [Mức độ phù hợp]
     • Lý do phù hợp: [Lý do ngắn gọn dựa trên RIASEC, MBTI, sở thích]
     • Yêu cầu chính: [Điểm số, khối thi, điều kiện xét tuyển]
     • Chi phí hoặc điều kiện đáng chú ý: [Học phí, học bổng hoặc yêu cầu đặc thù]
     • Đánh giá / khuyến nghị: [Khuyến nghị cụ thể]
   - Định dạng lộ trình hoặc kế hoạch hành động:
     Bước đầu tiên
     [Nội dung ngắn gọn]
     Bước tiếp theo
     [Nội dung ngắn gọn]
     Bước cuối
     [Nội dung ngắn gọn]
   - Mỗi đoạn văn chỉ nên tập trung vào một ý chính, không viết các đoạn văn quá dài. Các thông tin quan trọng như điểm số, IELTS, GPA, mã Holland, MBTI, tên trường, tên ngành được làm nổi bật vừa phải, không lạm dụng Markdown.
   - ĐỘ DÀI & NGÂN SÁCH TOKEN: Phản hồi súc tích khoảng 300 - 450 từ để đảm bảo câu trả lời luôn hoàn chỉnh, trọn vẹn và an toàn trong ngân sách 800 output tokens.
8. NGUYÊN TẮC BẢO TOÀN DỮ LIỆU & GROUNDING (CỰC KỲ QUAN TRỌNG):
   - Bạn chỉ đóng vai trò phân tích, giải thích và định hướng chiến lược học tập dựa trên dữ liệu hệ thống.
   - BẮT BUỘC: Bạn CHỈ ĐƯỢC viện dẫn điểm % phù hợp (Match %) đã được tính toán sẵn bởi Recommendation Engine trong dữ liệu khảo sát. TUYỆT ĐỐI KHÔNG ĐƯỢC tự tính toán, tự bịa hoặc thay đổi Match % của bất kỳ nghề nào.
   - TUYỆT ĐỐI KHÔNG bịa đặt thông tin về các trường đại học, học phí hay điểm chuẩn tuyển sinh ngoài thực tế. Nếu thông tin không có trong cơ sở dữ liệu đã cung cấp, hãy nói rõ là chưa có dữ liệu chính thức thay vì tự suy đoán.
   - LLM KHÔNG quyết định thay cho học sinh: Hãy trao quyền chủ động cho học sinh lựa chọn con đường phù hợp nhất.
9. PHẦN GỢI Ý CÂU HỎI TIẾP THEO:
   Ở cuối cùng của câu trả lời, bạn BẮT BUỘC thêm 3 câu hỏi gợi ý phù hợp nhất với câu trả lời vừa rồi theo định dạng chính xác sau:
---SUGGESTIONS---
1. [Câu hỏi gợi ý 1 ngắn gọn, thiết thực]
2. [Câu hỏi gợi ý 2 ngắn gọn, thiết thực]
3. [Câu hỏi gợi ý 3 ngắn gọn, thiết thực]`;

      // Build Gemini multi-turn contents array preserving conversational memory
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        // Find index of first user message to guarantee sequence starts with 'user'
        const firstUserIdx = chatHistory.findIndex(
          m => m.role === 'user' || m.sender === 'user'
        );

        if (firstUserIdx !== -1) {
          const validHistory = chatHistory.slice(firstUserIdx);
          for (const msg of validHistory) {
            const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'model';
            const rawText = typeof msg.parts === 'string'
              ? msg.parts
              : typeof msg.content === 'string'
              ? msg.content
              : typeof msg.text === 'string'
              ? msg.text
              : '';

            // Clean previous suggestions delimiter from model history turns
            const text = rawText.split('---SUGGESTIONS---')[0].trim();
            if (!text) continue;

            // Merge if same consecutive role to enforce strictly alternating turns
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n\n${text}`;
            } else {
              contents.push({
                role,
                parts: [{ text }]
              });
            }
          }
        }
      }

      // Append current user question
      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        if (!contents[contents.length - 1].parts[0].text.includes(userQuestion)) {
          contents[contents.length - 1].parts[0].text += `\n\n${userQuestion}`;
        }
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: userQuestion }]
        });
      }

      // Check for available Groq API Key (High RPM/TPM Free Tier)
      const groqApiKey = (process.env.GROQ_API_KEY || (llmConfig?.apiKey ? llmConfig.apiKey.trim() : '') || '').trim();

      let reply = '';
      let suggestedFollowUps: string[] = [];
      let usedModelTag = 'Gemini 3.8 Flash';

      // Output tokens cap strictly 800 tokens to ensure safety under 1000 OTPM
      const safeOutputTokens = 800;

      // Prepare standard OpenAI/Groq message history
      const groqMessages: Array<{ role: string; content: string }> = [
        { role: 'system', content: systemInstruction }
      ];

      if (Array.isArray(chatHistory)) {
        for (const msg of chatHistory) {
          const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'assistant';
          const raw = typeof msg.parts === 'string' ? msg.parts : typeof msg.content === 'string' ? msg.content : '';
          const clean = raw.split('---SUGGESTIONS---')[0].trim();
          if (clean) groqMessages.push({ role, content: clean });
        }
      }
      groqMessages.push({ role: 'user', content: userQuestion });

      // =========================================================================
      // STEP 0: Custom Local AI / Ollama Endpoint (Executed when provider is custom/local)
      // =========================================================================
      const isCustomLocal = llmConfig?.provider === 'custom' || !!llmConfig?.customEndpoint;
      if (isCustomLocal) {
        const cleanEndpoint = (llmConfig?.customEndpoint || 'http://localhost:11434').replace(/\/+$/, '');
        const targetModel = llmConfig?.modelName || 'qwen2.5:7b';

        try {
          // Attempt 1: Native Ollama /api/chat (receives full systemInstruction + groqMessages)
          let localRes = await fetch(`${cleanEndpoint}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: targetModel,
              messages: groqMessages,
              stream: false
            }),
            signal: AbortSignal.timeout(18000)
          });

          // Attempt 2: OpenAI-compatible /v1/chat/completions (LM Studio, vLLM, LocalAI)
          if (!localRes.ok && (localRes.status === 404 || localRes.status === 405)) {
            localRes = await fetch(`${cleanEndpoint}/v1/chat/completions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: targetModel,
                messages: groqMessages,
                temperature,
                max_tokens: safeOutputTokens
              }),
              signal: AbortSignal.timeout(18000)
            });
          }

          if (localRes.ok) {
            const data = await localRes.json();
            const text = data?.message?.content || data?.choices?.[0]?.message?.content || data?.response || '';
            if (text) {
              reply = text;
              usedModelTag = `Local AI: ${targetModel} (Ollama)`;
            }
          } else {
            console.warn(`[Local AI] Server at ${cleanEndpoint} returned status ${localRes.status}`);
            usedModelTag = `Offline Knowledge Engine (Ollama unavailable)`;
          }
        } catch (localErr: any) {
          console.warn('[Local AI] Connection error:', localErr?.message || localErr);
          usedModelTag = `Offline Knowledge Engine (Ollama unavailable)`;
        }
      }

      // =========================================================================
      // STEP 1: AI Chính — Gemini 3.8 Flash (Native Google AI Studio Cloud)
      // =========================================================================
      const ai = getAIClient();
      if (!reply && !isCustomLocal && ai) {
        try {
          const response = await ai.models.generateContent({
            model: chosenModel,
            contents,
            config: {
              systemInstruction,
              temperature,
              maxOutputTokens: safeOutputTokens
            }
          });

          const rawText = response.text || '';
          if (rawText) {
            reply = rawText;
            usedModelTag = 'Gemini 3.8 Flash (Cloud)';
          }
        } catch (geminiErr: any) {
          console.warn('[AI] Gemini call failed, attempting cloud backup:', geminiErr?.message || geminiErr);
        }
      }

      // =========================================================================
      // STEP 2: Backup 1 — Qwen 3.8 / GPT-OSS (Called ONLY if Gemini failed and key exists)
      // =========================================================================
      if (!reply && !isCustomLocal && groqApiKey) {
        try {
          const qwenRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'qwen/qwen3.8-27b',
              messages: groqMessages,
              temperature,
              max_tokens: safeOutputTokens
            })
          });

          if (qwenRes.ok) {
            const qwenData = await qwenRes.json();
            const qwenText = qwenData?.choices?.[0]?.message?.content || '';
            if (qwenText) {
              reply = qwenText;
              usedModelTag = 'Qwen 3.8 (Backup Cloud)';
            }
          }
        } catch (qwenErr: any) {
          console.warn('[AI] Qwen backup error:', qwenErr?.message || qwenErr);
        }
      }

      // Extract suggestions if generated by AI models
      if (reply && reply.includes('---SUGGESTIONS---')) {
        const parts = reply.split('---SUGGESTIONS---');
        reply = parts[0].trim();
        const extracted = parts[1].trim()
          .split('\n')
          .map(line => line.replace(/^[\d\-*•.]+\s*/, '').replace(/[\[\]]/g, '').trim())
          .filter(line => line.length > 5 && line.length < 130)
          .slice(0, 3);
        if (extracted.length > 0) {
          suggestedFollowUps = extracted;
        }
      }

      // =========================================================================
      // STEP 3: Fallback cuối cùng — RIASEC + MBTI + Rule & Knowledge Engine
      // =========================================================================
      if (!reply) {
        console.log('[AI] Cloud/Local model unavailable → using deterministic knowledge engine');
        if (isCustomLocal) {
          usedModelTag = 'Offline Knowledge Engine (Ollama unavailable)';
        } else {
          usedModelTag = 'EduPath Knowledge Engine (Offline)';
        }
        const p = req.body?.context?.profileContext || {};
        const name = p.name || 'bạn';
        const age = Number(p.age || 17);
        const riasec = p.riasecCode || 'RIC';
        const mbti = p.mbtiType || 'INTJ';
        const gpa = p.academicGPA || '8.8';
        const hsa = p.examScores?.hsaScore;
        const tsa = p.examScores?.tsaScore;
        const thpt = p.examScores?.thptScore;
        const thptCombo = p.examScores?.thptCombo || 'A00 (Toán, Lý, Hóa)';
        const careerTitle = req.body?.context?.careerTitle || 'Robotics & Automation Engineer';
        const cluster = req.body?.context?.cluster || 'Kỹ thuật & Công nghệ cao';
        const q = (userQuestion || '').toLowerCase().trim();

        // INTENT 1: Greetings / Casual Openers
        if (
          q === 'chào bạn' ||
          q === 'xin chào' ||
          q === 'chào' ||
          q === 'hello' ||
          q === 'hi' ||
          q.startsWith('chào') ||
          q.includes('bạn là ai') ||
          q.includes('giúp gì') ||
          q.includes('bắt đầu')
        ) {
          reply = `Chào **${name}**! Rất vui được đồng hành cùng bạn trên chặng đường định hướng nghề nghiệp. 

Tôi đã tiếp nhận toàn bộ dữ liệu khảo sát chuyên sâu của bạn:
- 🎯 **Mục tiêu nghề nghiệp hàng đầu:** **${careerTitle}** (${cluster}).
- 🧠 **Hồ sơ tâm lý & tính cách:** Mã Holland **${riasec}** (Thiên hướng Kỹ thuật & Nghiên cứu) kết hợp nhóm tính cách MBTI **${mbti}** (Tư duy chiến lược, độc lập và logic).
- 📊 **Năng lực học tập hiện tại:** Điểm GPA **${gpa}** | ${tsa ? `ĐGTD TSA **${tsa}/100** | ` : ''}${hsa ? `ĐGNL HSA **${hsa}/150** | ` : ''}${thpt ? `Dự kiến THPTQG: **${thpt}đ (${thptCombo})**` : ''}

Bạn đang băn khoăn điều gì nhất lúc này? Tôi có thể tư vấn chi tiết cho bạn về:
1. **Đánh giá điểm số:** Điểm của bạn hiện tại cao hay thấp so với chuẩn đầu vào các trường đại học?
2. **Chiến lược chọn trường:** So sánh cơ hội giữa Đại học Bách Khoa (HUST) và ĐHQG (UET)?
3. **Lộ trình chuẩn bị:** Kỹ năng then chốt cần rèn luyện ngay từ bây giờ cho ngành ${careerTitle}?`;

          suggestedFollowUps = [
            'Điểm của tôi như vậy là cao hay thấp?',
            'Với điểm số này tôi nên chọn Đại học Bách Khoa hay ĐHQG?',
            'Cần chuẩn bị kỹ năng gì cho ngành này?'
          ];
        }

        // INTENT 2: Score Evaluation & Admission Chances ("Điểm tôi cao hay thấp", "Có đỗ không")
        else if (
          q.includes('cao hay thấp') ||
          q.includes('điểm') ||
          q.includes('đỗ') ||
          q.includes('trượt') ||
          q.includes('đậu') ||
          q.includes('hsa') ||
          q.includes('tsa') ||
          q.includes('v-act') ||
          q.includes('xét tuyển') ||
          q.includes('khả năng') ||
          q.includes('cơ hội')
        ) {
          const scoreEvals: string[] = [];
          if (tsa) {
            const tsaNum = Number(tsa);
            let cmt = 'thuộc nhóm điểm tích cực để tham gia xét tuyển sớm.';
            if (tsaNum >= 70) {
              cmt = 'nằm trong nhóm điểm xuất sắc, có lợi thế cạnh tranh rất lớn vào các ngành Kỹ thuật của Đại học Bách Khoa Hà Nội (HUST).';
            } else if (tsaNum >= 55) {
              cmt = 'ở mức khá, có cơ hội cạnh tranh tốt ở nhiều ngành kỹ thuật và công nghệ.';
            }
            scoreEvals.push(`🌟 **Điểm ĐGTD Bách Khoa (TSA ${tsa}/100):** ${cmt}`);
          }
          if (hsa) {
            const hsaNum = Number(hsa);
            let cmt = 'thuộc ngưỡng điểm phù hợp để đăng ký xét tuyển sớm.';
            if (hsaNum >= 95) {
              cmt = 'nằm trong nhóm điểm giỏi (top thí sinh điểm cao), tạo lợi thế rõ rệt khi xét tuyển vào UET (ĐHQG Hà Nội), PTIT hoặc ĐH Khoa học Tự nhiên.';
            } else if (hsaNum >= 80) {
              cmt = 'ở mức khá, thích hợp cho nhiều chương trình chuẩn và chất lượng cao.';
            }
            scoreEvals.push(`📈 **Điểm ĐGNL ĐHQGHN (HSA ${hsa}/150):** ${cmt}`);
          }
          if (thpt) {
            scoreEvals.push(`📚 **Điểm dự kiến THPT (${thpt} điểm - Tổ hợp ${thptCombo}):** Là căn cứ quan trọng cho phương thức xét điểm thi tốt nghiệp THPT.`);
          }
          if (gpa) {
            scoreEvals.push(`📝 **Học bạ GPA (${gpa}):** Đáp ứng tốt tiêu chí sơ tuyển và xét tuyển kết hợp học bạ / chứng chỉ.`);
          }

          if (scoreEvals.length === 0) {
            reply = `Chào **${name}**! Hồ sơ hiện tại của bạn chưa ghi nhận điểm thi ĐGNL (HSA), ĐGTD (TSA) hoặc điểm thi THPT cụ thể.

Dưới đây là định hướng chiến lược điểm số cho ngành **${careerTitle}**:
1. **Thi ĐGNL / ĐGTD (Xét tuyển sớm):** Bạn có thể tham khảo đăng ký các đợt thi HSA hoặc TSA để tăng thêm cơ hội đỗ sớm trước kỳ thi tốt nghiệp.
2. **Xét điểm thi THPT (Tổ hợp ${thptCombo}):** Tập trung ôn luyện đồng đều 3 môn trong tổ hợp xét tuyển mục tiêu.
3. **Xét học bạ kết hợp chứng chỉ:** Duy trì điểm GPA tốt cùng chứng chỉ ngoại ngữ để nộp hồ sơ xét tuyển kết hợp.

*Lưu ý: Điểm chuẩn thay đổi theo đề án tuyển sinh hàng năm của từng trường, không có con số trúng tuyển bảo đảm tuyệt đối.*`;
          } else {
            reply = `Chào **${name}**! Dưới đây là phân tích đối chiếu điểm số thực tế từ hồ sơ của bạn:

${scoreEvals.join('\n\n')}

🎯 **Chiến lược tối ưu hóa cơ hội:**
1. **Tận dụng xét tuyển sớm:** Nộp hồ sơ bằng các cột điểm bạn có lợi thế nhất (HSA / TSA / Học bạ kết hợp chứng chỉ) trong các đợt mở sớm từ tháng 4 – tháng 6.
2. **Chiến thuật đăng ký nguyện vọng:** Phân chia danh sách nguyện vọng thành 3 nhóm rõ ràng: Nguyện vọng Mơ ước (Top 1), Nguyện vọng Vừa sức (Top 2), và Nguyện vọng An toàn.
3. **Lưu ý minh bạch:** Khả năng trúng tuyển thực tế phụ thuộc vào chỉ tiêu và phổ điểm chính thức của từng trường trong năm thi.`;
          }

          suggestedFollowUps = [
            'Nên đặt thứ tự nguyện vọng thế nào để an toàn nhất?',
            'Học phí và học bổng ngành này ra sao?',
            'Cần bổ sung chứng chỉ IELTS không để tăng cơ hội?'
          ];
        }

        // INTENT 3: Salary & Career Market Outlook
        else if (
          q.includes('lương') ||
          q.includes('thu nhập') ||
          q.includes('việc làm') ||
          q.includes('thị trường') ||
          q.includes('cơ hội việc') ||
          q.includes('ra trường') ||
          q.includes('kiếm tiền')
        ) {
          const salaryInfo = req.body?.context?.salaryLevel || '15 - 30 triệu VNĐ/tháng (theo dữ liệu tham khảo CSDL nghề)';
          reply = `Chào **${name}**! Dưới đây là thông tin thị trường lao động và mức thu nhập tham khảo cho ngành **${careerTitle}** (${cluster}):

💰 **Mức thu nhập tham khảo theo dữ liệu CSDL nghề nghiệp:**
- **Khung thu nhập định hướng:** ${salaryInfo}
- **Khởi điểm (0 - 2 năm):** Thường dao động theo năng lực thực chiến, ngoại ngữ và kỹ năng chuyên môn.
- **Kinh nghiệm (3 - 5+ năm):** Thu nhập tăng trưởng tương xứng với năng lực giải quyết bài toán phức tạp, quản lý dự án và kỹ năng liên ngành.

🏢 **Môi trường tuyển dụng tiêu biểu:**
- Doanh nghiệp công nghệ, viện nghiên cứu R&D, và các tập đoàn liên doanh trong và ngoài nước.
- Các công ty dịch vụ chuyên môn, sản xuất công nghiệp và doanh nghiệp khởi nghiệp.

*Lưu ý minh bạch: Mức lương thực tế phụ thuộc vào năng lực cá nhân, chứng chỉ nghề nghiệp, quy mô doanh nghiệp và địa điểm làm việc; số liệu trên chỉ mang tính chất tham khảo.*`;

          suggestedFollowUps = [
            'Làm thế nào để nâng cao năng lực để có thu nhập khởi điểm tốt?',
            'Ngoại ngữ đóng vai trò quan trọng thế nào trong mức lương?',
            'Nhu cầu tuyển dụng của ngành này trong 3-5 năm tới ra sao?'
          ];
        }

        // INTENT 4: University Selection & Comparison
        else if (
          q.includes('chọn trường') ||
          q.includes('đại học') ||
          q.includes('bách khoa') ||
          q.includes('uet') ||
          q.includes('hust') ||
          q.includes('ptit') ||
          q.includes('học ở đâu') ||
          q.includes('so sánh') ||
          (q.includes('trường') && !q.includes('ra trường'))
        ) {
          reply = `Chào **${name}**! Đối với ngành **${careerTitle}**, bạn có thể cân nhắc các nhóm cơ sở đào tạo tiêu biểu tại Việt Nam tùy theo định hướng:

🏛️ **1. Nhóm Đại học Trọng điểm Quốc gia (Thế mạnh Nghiên cứu & Kỹ thuật Chuyên sâu):**
- **Đại học Bách Khoa Hà Nội (HUST) / ĐH Bách Khoa TP.HCM:** Thế mạnh về cơ sở vật chất phòng lab, đào tạo kỹ thuật thực chiến, liên kết mạnh mẽ với các tập đoàn công nghiệp.
- **Trường ĐH Công nghệ - ĐHQGHN (UET) / UIT - ĐHQG TP.HCM:** Chuyên sâu về công nghệ cao, thuật toán, trí tuệ nhân tạo và nghiên cứu khoa học.

🏛️ **2. Nhóm Đại học Chuyên sâu & Thực hành Doanh nghiệp:**
- **Học viện Công nghệ Bưu chính Viễn thông (PTIT) / ĐH Sư phạm Kỹ thuật TP.HCM (HCMUTE):** Chương trình bám sát nhu cầu tuyển dụng thực tế, tỷ lệ thực tập sớm cao.
- **Đại học FPT / Phenikaa:** Môi trường quốc tế, cơ sở vật chất hiện đại, mô hình đào tạo theo dự án doanh nghiệp.

🛠️ **3. Con đường Thực học - Thực nghiệp (Cao đẳng Nghề chất lượng cao):**
- **Cao đẳng Kỹ thuật Cao Thắng, FPT Polytechnic, HACTECH:** Đào tạo 2 – 2.5 năm với hơn 70% thời lượng thực hành tay nghề, chi phí hợp lý và cơ hội đi làm tự chủ tài chính sớm.

💡 **Khuyến nghị chiến lược:** Đặt các trường Đại học trọng điểm ở nhóm nguyện vọng đầu, song song chuẩn bị các phương án dự phòng vừa sức để đảm bảo an toàn tuyệt đối.`;

          suggestedFollowUps = [
            'Chương trình đào tạo tại Bách Khoa có khó không?',
            'Cơ hội học bổng và du học ngành này ra sao?',
            'Mức học phí trung bình của các trường này như thế nào?'
          ];
        }

        // INTENT 5: Skills & Learning Roadmap
        else if (
          q.includes('kỹ năng') ||
          q.includes('học gì') ||
          q.includes('chuẩn bị') ||
          q.includes('lộ trình') ||
          q.includes('bắt đầu')
        ) {
          reply = `Chào **${name}**! Để trở thành một chuyên gia xuất sắc trong ngành **${careerTitle}**, bạn nên xây dựng lộ trình rèn luyện 3 giai đoạn:

🚀 **Giai đoạn 1: Chuẩn bị ngay trong giai đoạn THPT (3 - 6 tháng tới):**
1. **Ngoại ngữ (Tiếng Anh chuyên ngành):** Mục tiêu đạt tối thiểu IELTS 6.0 - 6.5. Toàn bộ tài liệu, datasheet linh kiện và cộng đồng kỹ thuật quốc tế đều sử dụng Tiếng Anh.
2. **Nền tảng Toán học & Khoa học:** Giữ vững điểm môn Toán (đại số tuyến tính, giải tích) và môn khoa học tự nhiên cốt lõi.
3. **Làm quen lập trình / kỹ năng căn bản:** Thử tự học ngôn ngữ lập trình hoặc công cụ chuyên ngành cơ bản qua các khóa học trực tuyến miễn phí.

🛠️ **Giai đoạn 2: Năm 1 - Năm 2 Đại học / Cao đẳng (Nền tảng cốt lõi):**
- Làm chủ kỹ thuật chuyên ngành căn bản, tham gia câu lạc bộ học thuật hoặc dự án nghiên cứu khoa học tại trường.

💻 **Giai đoạn 3: Năm 3 - Năm 4 (Chuyên sâu & Thực chiến):**
- Làm dự án thực tế, thực tập tại doanh nghiệp và xây dựng portfolio sản phẩm cá nhân.`;

          suggestedFollowUps = [
            'Có những khóa học trực tuyến miễn phí nào tốt để tự học?',
            'Làm thế nào để duy trì kỷ luật tự học mỗi ngày?',
            'Tính cách của tôi có lợi thế gì khi học chuyên sâu?'
          ];
        }

        // INTENT 6: Holland & MBTI Fit Analysis
        else if (
          q.includes('tại sao') ||
          q.includes('phù hợp') ||
          q.includes('holland') ||
          q.includes('mbti') ||
          q.includes('ric') ||
          q.includes('intj') ||
          q.includes('tính cách')
        ) {
          reply = `Chào **${name}**! Ngành **${careerTitle}** được đề xuất vì sự tương thích giữa bản đồ tâm lý và yêu cầu thực tế của nghề nghiệp:

🧩 **1. Sự kết hợp từ mã Holland (${riasec}):**
- Mã Holland phản ánh nhóm sở thích hành vi tự nhiên của bạn, phù hợp với môi trường làm việc thực tế của ngành ${careerTitle} (${cluster}).

🧠 **2. Sức mạnh từ nhóm tính cách MBTI (${mbti}):**
- MBTI là yếu tố bổ trợ (chiếm 5% trọng số), phản ánh xu hướng xử lý thông tin, phân tích logic và năng lực thiết kế kế hoạch làm việc có hệ thống.`;

          suggestedFollowUps = [
            'Điểm mạnh lớn nhất trong tính cách của tôi khi làm nghề này là gì?',
            'Làm thế nào để phát triển kỹ năng làm việc nhóm cho người hướng nội?',
            'Tôi có thể làm quản lý kỹ thuật trong tương lai không?'
          ];
        }

        // DEFAULT INTENT: Deep Contextual Response referencing survey and question
        else {
          const scoreParts: string[] = [];
          if (gpa) scoreParts.push(`GPA **${gpa}**`);
          if (tsa) scoreParts.push(`TSA **${tsa}/100**`);
          if (hsa) scoreParts.push(`HSA **${hsa}/150**`);
          if (thpt) scoreParts.push(`THPT **${thpt}đ**`);
          const scoreStr = scoreParts.length > 0 ? `, Điểm số: ${scoreParts.join(', ')}` : '';

          reply = `Chào **${name}**! Cảm ơn câu hỏi rất thiết thực của bạn về: "*${userQuestion}*".

Dựa trên toàn bộ hồ sơ khảo sát của bạn (Mã Holland **${riasec}**, MBTI **${mbti}**${scoreStr} và định hướng ngành **${careerTitle}**):

1. **Về mặt năng lực học thuật:** Bạn sở hữu nền tảng kiến thức tự nhiên ổn định, có thể chủ động lựa chọn các phương thức xét tuyển phù hợp với thế mạnh của mình.
2. **Về xu hướng nghề nghiệp:** Sự kết hợp giữa tư duy phân tích sâu sắc (${mbti}) và sở thích thực nghiệm (${riasec}) giúp bạn dễ dàng hòa nhập và phát triển trong các lĩnh vực chuyên môn cao.
3. **Hành động ngay:** Hãy tiếp tục giữ vững phong độ học tập, tập trung hoàn thiện hồ sơ xét tuyển sớm và rèn luyện kỹ năng tự học công nghệ mới.

Tôi luôn ở đây để đồng hành cùng bạn. Bạn có muốn đi sâu vào bất kỳ khía cạnh nào khác không?`;

          suggestedFollowUps = [
            'Đánh giá cơ hội xét tuyển của tôi vào các trường đại học?',
            'Chiến lược đăng ký nguyện vọng đại học an toàn nhất?',
            'Lộ trình chuẩn bị kỹ năng chuyên môn trong 6 tháng tới?'
          ];
        }
      }

      // Default fallback questions if empty
      if (suggestedFollowUps.length === 0) {
        suggestedFollowUps = [
          'Điểm của tôi như vậy là cao hay thấp?',
          'Nên chọn trường Đại học Bách Khoa hay ĐHQG?',
          'Lộ trình rèn luyện kỹ năng trong 6 tháng tới?'
        ];
      }

      // If user explicitly configured Local AI but it was unavailable, prepend diagnostic notice
      if (isCustomLocal && usedModelTag.includes('Ollama unavailable')) {
        const cleanEndpoint = (llmConfig?.customEndpoint || 'http://localhost:11434').replace(/\/+$/, '');
        const targetModel = llmConfig?.modelName || 'qwen2.5:7b';
        reply = `⚠️ **[Thông báo Kết nối Local AI - Máy chủ Ollama không phản hồi]**\nKhông thể kết nối tới máy chủ cục bộ tại \`${cleanEndpoint}\` (Model: \`${targetModel}\`). Hãy kiểm tra lại ứng dụng Ollama đã được mở (\`ollama serve\`) và đã cấp quyền CORS (\`OLLAMA_ORIGINS="*" \`).\n\n*Hệ thống đã tự động kích hoạt Cố vấn Ngoại tuyến (Offline Knowledge Engine) dựa trên dữ liệu khảo sát của bạn:*\n\n${reply}`;
      }

      res.json({
        reply,
        provider: usedModelTag,
        suggestedFollowUps
      });
    } catch (err: any) {
      console.warn('AI counseling endpoint error:', err?.message || err);
      const isCustomLocal = req.body?.llmConfig?.provider === 'custom' || !!req.body?.llmConfig?.customEndpoint;
      const fallbackTag = isCustomLocal
        ? 'Offline Knowledge Engine (Ollama error)'
        : 'EduPath Knowledge Engine (Offline)';
      res.json({
        reply: `Chào bạn! Tôi đã ghi nhận câu hỏi của bạn: "${userQuestion}". Để hỗ trợ bạn một cách chính xác nhất, bạn có thể cho tôi biết rõ hơn bạn muốn tập trung vào việc đánh giá điểm số (HSA, TSA, THPT) hay chiến lược chọn trường đại học?`,
        provider: fallbackTag,
        suggestedFollowUps: [
          'Điểm của tôi như vậy là cao hay thấp?',
          'Nên chọn Đại học Bách Khoa hay ĐHQG?',
          'Lộ trình chuẩn bị kỹ năng cho ngành này?'
        ]
      });
    }
  });

  // Data Extraction API using Gemini
  app.post('/api/ai/extract-data', aiRateLimitMiddleware, async (req, res) => {
    const { prompt, sourceId } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key not configured' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: 'Extract Vietnamese university admission data strictly into JSON. Return only the JSON object without markdown formatting.',
          temperature: 0.1,
          maxOutputTokens: 2000,
          responseMimeType: 'application/json'
        }
      });
      const rawText = response.text || '';
      res.json({ rawJson: rawText, provider: 'Gemini 3.8 Flash' });
    } catch (err: any) {
      console.warn('AI extraction endpoint error:', err?.message || err);
      res.status(500).json({ error: 'Failed to extract data via AI' });
    }
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shape Your Future! Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
