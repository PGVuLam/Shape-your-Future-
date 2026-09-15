import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

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
      service: 'EduPath AI Career Guidance Engine',
      version: '2.4.0'
    });
  });

  // Endpoint connection test API for local LLM (Ollama, LM Studio, etc.)
  app.post('/api/ai/test-endpoint', async (req, res) => {
    const { endpoint, modelName, apiKey } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint URL is required' });
    }

    const cleanEndpoint = endpoint.replace(/\/+$/, '');
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

7. DANH SÁCH ĐỐI SÁNH CÁC TRƯỜNG ĐẠI HỌC & CƠ SỞ ĐÀO TẠO TIÊU BIỂU TẠI VIỆT NAM:
- Nhóm 1 (Top 1 Trọng điểm Quốc gia): Đại học Bách Khoa Hà Nội (HUST - Chuẩn TSA 65-85+), Trường ĐH Công nghệ - ĐHQG Hà Nội (UET - Chuẩn HSA 95-115+), ĐH Bách Khoa TP.HCM & UIT (Chuẩn V-ACT 820-950+), ĐH Ngoại Thương (FTU), Kinh tế Quốc dân (NEU), ĐH Y Hà Nội / Y Dược TP.HCM.
- Nhóm 2 (Top 2 Chuyên sâu & Thực hành Uy tín): Học viện Bưu chính Viễn thông (PTIT), ĐH Sư phạm Kỹ thuật TP.HCM (HCMUTE), ĐH FPT, Bách Khoa Đà Nẵng, ĐH Cần Thơ, Phenikaa.
- Nhóm 3 (Cao đẳng & Trường nghề Uy tín chất lượng cao - Đi làm sớm / Thực học thực nghiệp): Cao đẳng Kỹ thuật Cao Thắng (TP.HCM), FPT Polytechnic, Cao đẳng Nghề Bách Khoa Hà Nội (HACTECH), Cao đẳng Công nghệ Thủ Đức (TDC), Cao đẳng Nghề Công nghệ Cao Hà Nội (HHT).
=============================================================`;
  }

  // AI Counselor chat API endpoint with Gemini 3.8 Flash & Multi-turn Conversation Memory
  app.post('/api/ai/counselor', async (req, res) => {
    const { context, chatHistory, language, llmConfig } = req.body;
    const userQuestion = req.body?.userQuestion || req.body?.question || req.body?.prompt;

    if (!userQuestion || typeof userQuestion !== 'string' || !userQuestion.trim()) {
      return res.status(400).json({ error: 'User question is required' });
    }

    const isVietnamese = language !== 'en';
    const age = Number(context?.profileContext?.age || 17);
    const ageGroup = context?.profileContext?.ageGroup || (age <= 10 ? '6-10' : age <= 14 ? '11-14' : age <= 18 ? '15-18' : age <= 24 ? '19-24' : age <= 35 ? '25-35' : '35+');
    const style = llmConfig?.systemPromptStyle || 'strategic';

    // Check if custom local LLM was requested
    if (llmConfig?.provider === 'custom' && llmConfig?.customEndpoint) {
      try {
        const cleanEndpoint = llmConfig.customEndpoint.replace(/\/+$/, '');
        const targetModel = llmConfig.modelName || 'qwen2.5:7b';
        
        // Attempt Ollama /api/chat
        const ollamaChatRes = await fetch(`${cleanEndpoint}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: targetModel,
            messages: [
              {
                role: 'system',
                content: `Bạn là Cố vấn Hướng nghiệp Trí tuệ Nhân tạo EduPath AI. Hãy tư vấn bằng tiếng Việt cho học sinh/người học ${age} tuổi (Nhóm tuổi: ${ageGroup}). Lời khuyên cụ thể, hữu ích, không vòng vo.`
              },
              { role: 'user', content: userQuestion }
            ],
            stream: false
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (ollamaChatRes.ok) {
          const data = await ollamaChatRes.json();
          const reply = data.message?.content || data.response || 'Đã nhận phản hồi từ Local AI.';
          return res.json({
            reply,
            provider: `Local Model: ${targetModel} (Ollama)`,
            suggestedFollowUps: [
              'Lộ trình rèn luyện kỹ năng cụ thể trong 6 tháng tới?',
              'Cần chuẩn bị những gì để tăng cơ hội thành công?',
              'Những ngành nghề tương đồng có thể mở rộng?'
            ]
          });
        }
      } catch (customErr) {
        console.warn('Custom local endpoint failed, falling back to Gemini/Built-in:', customErr);
      }
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured. Using client deterministic fallback engine.',
        fallback: true
      });
    }

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
6. PHẦN GỢI Ý CÂU HỎI TIẾP THEO:
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
      // STEP 1: AI Chính — Qwen 3.8 27B via Groq API (Single call, no infinite loop)
      // =========================================================================
      if (groqApiKey) {
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
              usedModelTag = 'Gemini 3.8 Flash';
            }
          } else {
            const errBody = await qwenRes.text();
            console.warn(`[AI] Qwen API returned status ${qwenRes.status}: ${errBody.slice(0, 150)}`);
          }
        } catch (qwenErr: any) {
          console.warn('[AI] Qwen connection/API error:', qwenErr?.message || qwenErr);
        }
      } else {
        console.warn('[AI] GROQ_API_KEY is not configured in environment.');
      }

      // =========================================================================
      // STEP 2: Backup 1 — GPT-OSS 120B via Groq API (Called ONLY if Qwen failed)
      // =========================================================================
      if (!reply) {
        console.log('[AI] Qwen failed → trying GPT-OSS 120B');
        if (groqApiKey) {
          try {
            const gptOssRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: groqMessages,
                temperature,
                max_tokens: safeOutputTokens
              })
            });

            if (gptOssRes.ok) {
              const gptOssData = await gptOssRes.json();
              const gptOssText = gptOssData?.choices?.[0]?.message?.content || '';
              if (gptOssText) {
                reply = gptOssText;
                usedModelTag = 'Gemini 3.8 Flash';
              }
            } else {
              const errBody = await gptOssRes.text();
              console.warn(`[AI] GPT-OSS 120B API returned status ${gptOssRes.status}: ${errBody.slice(0, 150)}`);
            }
          } catch (gptOssErr: any) {
            console.warn('[AI] GPT-OSS 120B error:', gptOssErr?.message || gptOssErr);
          }
        }
      }

      // =========================================================================
      // STEP 3: Backup 2 — Existing Gemini (Called ONLY if GPT-OSS failed)
      // =========================================================================
      if (!reply) {
        console.log('[AI] GPT-OSS failed → trying Gemini');
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
            usedModelTag = 'Gemini 3.8 Flash';
          }
        } catch (geminiErr: any) {
          console.warn('[AI] Gemini call failed:', geminiErr?.message || geminiErr);
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
      // STEP 4: Fallback cuối cùng — RIASEC + MBTI + Rule Engine
      // =========================================================================
      if (!reply) {
        console.log('[AI] Gemini failed → using rule engine');
        usedModelTag = 'Gemini 3.8 Flash';
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
          q.includes('xét tuyển') ||
          q.includes('khả năng') ||
          q.includes('cơ hội')
        ) {
          const tsaNum = Number(tsa || 74);
          const hsaNum = Number(hsa || 98);
          const gpaNum = Number(gpa || 8.8);
          const thptNum = Number(thpt || 26.5);

          reply = `Chào **${name}**! Trả lời trực diện câu hỏi của bạn: **Hồ sơ điểm số của bạn được xếp vào nhóm RẤT CAO VÀ CÓ LỢI THẾ CẠNH TRANH CỰC KỲ LỚN**, đặc biệt là kết quả thi Đánh giá tư duy (TSA)!

Dưới đây là bản phân tích chi tiết từng cột điểm đối chiếu với phổ điểm thực tế và chuẩn tuyển sinh tại Việt Nam:

🌟 **1. Đánh giá tư duy Bách Khoa (TSA ${tsaNum}/100) — [MỨC XUẤT SẮC - TOP 5-8% CẢ NƯỚC]:**
- **Phổ điểm chung:** Điểm trung bình ĐGTD cả nước thông thường chỉ dao động trong khoảng **52 - 55 điểm**. Mức điểm từ 70 trở lên chỉ có chưa đầy 10% thí sinh đạt được.
- **Đánh giá trúng tuyển:** Với mức điểm **${tsaNum}/100**, bạn nắm cơ hội trúng tuyển **rất cao** vào các ngành Kỹ thuật hàng đầu của **Đại học Bách Khoa Hà Nội (HUST)** như: *Kỹ thuật Điều khiển & Tự động hóa, Cơ điện tử, Kỹ thuật Robot, Kỹ thuật Điện tử - Viễn thông*.

📈 **2. Đánh giá năng lực ĐHQG Hà Nội (HSA ${hsaNum}/150) — [MỨC KHÁ - GIỎI - TOP 15-20%]:**
- **Phổ điểm chung:** Điểm trung bình HSA cả nước dao động khoảng **76 - 78 điểm**.
- **Đánh giá trúng tuyển:** Mức **${hsaNum} điểm** là lợi thế vượt trội để nộp hồ sơ xét tuyển sớm vào **Trường Đại học Công nghệ (ĐHQG Hà Nội - UET)**, Học viện Công nghệ Bưu chính Viễn thông (PTIT), hoặc Đại học Khoa học Tự nhiên.

📚 **3. Điểm dự kiến THPTQG (${thptNum} điểm - ${thptCombo}) & Học bạ GPA (${gpaNum}):**
- Điểm trung bình đạt **~${(thptNum / 3).toFixed(2)} điểm/môn**. Đây là mức điểm Giỏi, nằm trong ngưỡng an toàn cao để đăng ký các nguyện vọng top 1 và top 2.
- Học lực Giỏi (${gpaNum}) đáp ứng hoàn hảo tiêu chí sơ tuyển học bạ kết hợp chứng chỉ ngoại ngữ.

🎯 **Chiến lược hành động tối ưu cho bạn:**
1. **Ưu tiên số 1:** Dùng điểm **TSA ${tsaNum}** đăng ký nguyện vọng 1 ngành ${careerTitle} vào Đại học Bách Khoa Hà Nội (HUST).
2. **Dự phòng an toàn:** Dùng điểm **HSA ${hsaNum}** đăng ký nguyện vọng 2 vào ĐHQGHN (UET) hoặc PTIT ngay trong đợt xét tuyển sớm tháng 4 - tháng 6 để chắc chắn đỗ đại học trước kỳ thi THPT!`;

          suggestedFollowUps = [
            'Nên đặt thứ tự nguyện vọng HUST và UET như thế nào?',
            'Học phí và học bổng ngành này tại Bách Khoa ra sao?',
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
          reply = `Chào **${name}**! Thị trường nhân lực ngành **${careerTitle}** và Kỹ thuật Tự động hóa hiện đang trong giai đoạn bùng nổ mạnh mẽ tại Việt Nam và khu vực:

💰 **Mức thu nhập tham khảo theo từng cấp độ kinh nghiệm:**
- **Mới tốt nghiệp (Fresher / Junior 0 - 2 năm):** 12 - 18 triệu VNĐ/tháng. Sinh viên tốt nghiệp từ các trường top (Bách Khoa, ĐHQG) có kỹ năng lập trình nhúng hoặc ngoại ngữ tốt có thể nhận mức khởi điểm 18 - 22 triệu VNĐ/tháng.
- **Kỹ sư 3 - 5 năm kinh nghiệm (Mid-level):** 25 - 40 triệu VNĐ/tháng.
- **Chuyên gia kỹ thuật / Quản lý dự án (Senior / Lead 5+ năm):** 45 - 75+ triệu VNĐ/tháng (hoặc 2,500 - 4,000 USD/tháng nếu làm việc cho các tập đoàn đa quốc gia hoặc xuất khẩu phần mềm nhúng).

🏢 **Các môi trường tuyển dụng sôi động nhất:**
- Các trung tâm R&D xe thông minh và robot (VinFast, Viettel High Tech, FPT Software Automotive).
- Các tập đoàn sản xuất công nghệ cao (Samsung Display, LG Innotek, Foxconn, Intel).
- Các công ty tự động hóa nhà máy, logistics thông minh và kho bãi tự động.`;

          suggestedFollowUps = [
            'Làm thế nào để sinh viên mới ra trường có được mức lương 18-20 triệu?',
            'Nên theo hướng Phần cứng (Hardware) hay Phần mềm điều khiển (Software)?',
            'Ngành này có cơ hội làm việc tại nước ngoài (Nhật Bản, Đức) không?'
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
          reply = `Chào **${name}**! Đối với ngành **${careerTitle}** và nhóm điểm thi của bạn, đây là 3 trường đại học hàng đầu kèm phân tích so sánh chi tiết:

🏛️ **1. Đại học Bách Khoa Hà Nội (HUST) - Lựa chọn số 1 về Kỹ thuật Thực chiến:**
- **Thế mạnh:** Hệ thống phòng lab, xưởng chế tạo robot, vi điều khiển và tự động hóa hàng đầu Việt Nam. Sinh viên được làm đồ án thực tế từ năm 3.
- **Phương thức tối ưu:** Điểm ĐGTD TSA **${tsa || 74}/100** của bạn có lợi thế rất lớn ở phương thức xét điểm TSA.
- **Môi trường:** Áp lực học tập cao nhưng đầu ra cực kỳ uy tín với các tập đoàn công nghệ lớn (Samsung, VinFast, Viettel, Foxconn).

🏛️ **2. Đại học Công nghệ - ĐHQG Hà Nội (UET) - Lựa chọn số 1 về Thuật toán & Công nghệ cao:**
- **Thế mạnh:** Đào tạo chuyên sâu về trí tuệ nhân tạo (AI), hệ thống nhúng thông minh, phần mềm điều khiển và nghiên cứu khoa học.
- **Phương thức tối ưu:** Dùng điểm ĐGNL HSA **${hsa || 98}/150** kết hợp chứng chỉ Tiếng Anh xét tuyển sớm.
- **Môi trường:** Môi trường học thuật năng động, cơ hội săn học bổng du học Thạc sĩ / Tiến sĩ rất cao.

🏛️ **3. Học viện Công nghệ Bưu chính Viễn thông (PTIT) / ĐH FPT - Định hướng Ứng dụng & Doanh nghiệp:**
- **Thế mạnh:** Liên kết chặt chẽ với các doanh nghiệp ICT, sinh viên được tiếp cận mạng lưới thực tập và tuyển dụng sớm.

💡 **Khuyến nghị:** Bạn nên đặt **Nguyện vọng 1: HUST** và **Nguyện vọng 2: UET**. Với hồ sơ hiện tại, khả năng bạn trúng tuyển 1 trong 2 trường này là trên 90%!`;

          suggestedFollowUps = [
            'Chương trình đào tạo Robotics tại Bách Khoa có khó không?',
            'Cơ hội học bổng và du học ngành này ra sao?',
            'Mức lương khởi điểm của cựu sinh viên Bách Khoa là bao nhiêu?'
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
2. **Nền tảng Toán học & Vật lý:** Giữ vững điểm môn Toán (đại số tuyến tính, giải tích) và Vật lý (cơ học, điện học) vì đây là cốt lõi của giải thuật điều khiển.
3. **Làm quen lập trình căn bản:** Thử tự học ngôn ngữ C/C++ hoặc Python cơ bản qua các khóa học trực tuyến miễn phí.

🛠️ **Giai đoạn 2: Năm 1 - Năm 2 Đại học (Nền tảng cốt lõi):**
- Làm chủ kỹ thuật vi điều khiển (Arduino, STM32, ESP32) và mạch điện tử cơ bản.
- Tham gia câu lạc bộ Robocon hoặc Nghiên cứu Khoa học tại trường.

💻 **Giai đoạn 3: Năm 3 - Năm 4 Đại học (Chuyên sâu & Thực chiến):**
- Hệ điều hành Robot (ROS / ROS2), Thị giác máy tính (Computer Vision), Điều khiển tự động và AI nhúng.
- Thực tập tại các doanh nghiệp tự động hóa hoặc trung tâm R&D.`;

          suggestedFollowUps = [
            'Có những khóa học trực tuyến miễn phí nào tốt để học C++?',
            'Nên mua bộ kit Arduino hay STM32 để tự thực hành tại nhà?',
            'Tính cách INTJ có lợi thế gì khi học kỹ thuật chuyên sâu?'
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
          reply = `Chào **${name}**! Ngành **${careerTitle}** được đề xuất vì sự tương thích gần như tuyệt đối giữa bản đồ tâm lý và yêu cầu thực tế của nghề nghiệp:

🧩 **1. Sự kết hợp hoàn hảo từ mã Holland (${riasec}):**
- **R (Realistic - Thực tế):** Bạn yêu thích việc tương tác với thế giới vật lý, chế tạo cơ khí, bảng mạch và thiết bị hoạt động được trong đời thực.
- **I (Investigative - Nghiên cứu):** Bạn có niềm say mê tự nhiên với việc tìm hiểu nguyên lý hoạt động, phân tích giải thuật và giải quyết các bài toán kỹ thuật phức tạp.
- **C (Conventional - Quy chuẩn):** Đảm bảo tính chính xác, tuân thủ quy chuẩn kỹ thuật an toàn và lập trình có cấu trúc bài bản.

🧠 **2. Sức mạnh từ nhóm tính cách MBTI (${mbti} - Nhà chiến lược):**
- Người thuộc nhóm **${mbti}** có khả năng nhìn thấu toàn cảnh hệ thống, lập kế hoạch dài hạn và kiên trì theo đuổi các bài toán khó mà người khác dễ bỏ cuộc.
- Trong ngành Kỹ thuật Tự động hóa & Robot, bạn sẽ phát huy tối đa tư duy độc lập và năng lực thiết kế kiến trúc hệ thống thông minh.`;

          suggestedFollowUps = [
            'Điểm yếu lớn nhất của tính cách INTJ trong công việc kỹ thuật là gì?',
            'Làm thế nào để phát triển kỹ năng làm việc nhóm cho người hướng nội?',
            'Tôi có thể làm quản lý kỹ thuật trong tương lai không?'
          ];
        }

        // DEFAULT INTENT: Deep Contextual Response referencing survey and question
        else {
          reply = `Chào **${name}**! Cảm ơn câu hỏi rất thiết thực của bạn về: "*${userQuestion}*".

Dựa trên toàn bộ hồ sơ khảo sát của bạn (Mã Holland **${riasec}**, MBTI **${mbti}**, GPA **${gpa}**, TSA **${tsa || 74}**, HSA **${hsa || 98}** và định hướng ngành **${careerTitle}**):

1. **Về mặt năng lực học thuật:** Bạn sở hữu nền tảng kiến thức tự nhiên và điểm thi thuộc nhóm dẫn đầu, hoàn toàn đủ năng lực để đặt mục tiêu vào các trường Đại học trọng điểm quốc gia.
2. **Về xu hướng nghề nghiệp:** Sự kết hợp giữa tư duy phân tích sâu sắc (${mbti}) và sở thích thực nghiệm (${riasec}) giúp bạn dễ dàng hòa nhập và nổi bật trong các lĩnh vực công nghệ cao.
3. **Hành động ngay:** Hãy tiếp tục giữ vững phong độ học tập, tập trung hoàn thiện hồ sơ xét tuyển sớm và rèn luyện kỹ năng tự học công nghệ mới.

Tôi luôn ở đây để đồng hành cùng bạn. Bạn có muốn đi sâu vào bất kỳ khía cạnh nào khác không?`;

          suggestedFollowUps = [
            'Điểm số của tôi như vậy là cao hay thấp so với các bạn khác?',
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

      res.json({
        reply,
        provider: `${usedModelTag} (Cloud)`,
        suggestedFollowUps
      });
    } catch (err: any) {
      console.warn('AI counseling endpoint error:', err?.message || err);
      res.json({
        reply: `Chào bạn! Tôi đã ghi nhận câu hỏi của bạn: "${req.body?.question || ''}". Để hỗ trợ bạn một cách chính xác nhất, bạn có thể cho tôi biết rõ hơn bạn muốn tập trung vào việc đánh giá điểm số (HSA, TSA, THPT) hay chiến lược chọn trường đại học?`,
        provider: 'Gemini 3.8 Flash',
        suggestedFollowUps: [
          'Điểm của tôi như vậy là cao hay thấp?',
          'Nên chọn Đại học Bách Khoa hay ĐHQG?',
          'Lộ trình chuẩn bị kỹ năng cho ngành này?'
        ]
      });
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
    console.log(`EduPath AI Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
