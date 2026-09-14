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

  // AI Counselor chat API endpoint
  app.post('/api/ai/counselor', async (req, res) => {
    const { context, userQuestion, chatHistory, language, llmConfig } = req.body;

    if (!userQuestion) {
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
        
        // Attempt Ollama /api/chat or /api/generate
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
      const chosenModel = llmConfig?.modelName?.startsWith('gemini') ? llmConfig.modelName : 'gemini-3.8-flash';
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
- HƯỚNG TƯ VẤN: Chiến lược tuyển sinh Đại học chuyên sâu tại Việt Nam.
  * Phân tích đối chiếu điểm thi thực tế (HSA ĐHQG Hà Nội, TSA Bách Khoa Hà Nội, V-ACT ĐHQG TP.HCM, điểm thi THPT theo tổ hợp A00, A01, B00, D01...).
  * So sánh cơ hội giữa Nhóm trường Đại học TOP 1 (Bách Khoa HUST, ĐHQG UET/UIT, Ngoại thương FTU, Kinh tế Quốc dân NEU, Y Hà Nội...) và Nhóm trường Top 2 Chuyên sâu (PTIT, Sư phạm Kỹ thuật HCMUTE, FPT, Bách Khoa Đà Nẵng, Cần Thơ...).
  * Chiến thuật kết hợp phương thức xét tuyển sớm (học bạ, giải HSG, IELTS, chứng chỉ quốc tế) và thi tốt nghiệp.
- NGÔN TỪ: Rõ ràng, chiến lược, sắc bén, định hướng thực tế.`;
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
        personaDirective = 'PHONG CÁCH: Tận tâm, lắng nghe sâu sắc, khích lệ tinh thần, tạo cảm giác an tâm và tin tưởng.';
      } else if (style === 'analytical') {
        personaDirective = 'PHONG CÁCH: Logic, khoa học dữ liệu, khách quan, phân tích rõ ưu/nhược điểm, xác suất và dữ liệu thị trường.';
      } else {
        personaDirective = 'PHONG CÁCH: Chiến lược gia thực chiến, tập trung vào hành động cụ thể, các mốc thời gian và kết quả đầu ra đo lường được.';
      }

      const systemInstruction = `You are the EduPath AI Career Exploration Counselor, a leading educational and career guidance intelligence system.
You MUST follow these strict rules:
1. Ground all recommendations in the user's specific Holland RIASEC code, MBTI personality type, exam scores (HSA, TSA, V-ACT, THPTQG), and academic achievements.
2. ${personaDirective}
3. ${ageSpecificDirectives}
4. AI is a trusted navigator, but does NOT make an irreversible life decision for the user. Emphasize user agency.
5. All replies MUST be in fluent, polished Vietnamese (tiếng Việt), beautifully structured with clear headings and bullet points. Never hallucinate false official university cutoff laws.`;

      const prompt = `Language: Vietnamese
User Question: "${userQuestion}"

HỒ SƠ NGƯỜI HỌC CHI TIẾT:
- Họ tên: ${context?.profileContext?.name || 'Học viên'}
- Độ tuổi: ${context?.profileContext?.age} (Nhóm: ${ageGroup})
- Trình độ / Lớp học: ${context?.profileContext?.grade || context?.profileContext?.educationLevel || 'Chưa cập nhật'}
- Tỉnh / Thành phố: ${context?.profileContext?.province || 'Toàn quốc'}
- Môn học tự tin / yêu thích: ${(context?.profileContext?.favoriteSubjects || []).join(', ') || 'Chưa cập nhật'}
- Học lực GPA: ${context?.profileContext?.academicGPA || 'Chưa cập nhật'}
- Điểm thi ĐGNL & THPT:
  * HSA (ĐHQG Hà Nội): ${context?.profileContext?.examScores?.hsaScore || 'Chưa thi'}
  * TSA (Bách Khoa HN): ${context?.profileContext?.examScores?.tsaScore || 'Chưa thi'}
  * V-ACT (ĐHQG TP.HCM): ${context?.profileContext?.examScores?.vactScore || 'Chưa thi'}
  * Khối thi & Điểm THPT: ${context?.profileContext?.examScores?.thptCombo || ''} - ${context?.profileContext?.examScores?.thptScore || 'Chưa thi'} điểm
  * Chứng chỉ / Giải thưởng: ${(context?.profileContext?.examScores?.awards || []).join(', ') || 'Chưa có'}
- Mã Holland RIASEC: ${context?.profileContext?.riasecCode || 'Chưa có'}
- Phong cách MBTI: ${context?.profileContext?.mbtiType || 'Chưa có'}
- Ngành nghề quan tâm: ${context?.profileContext?.interestedMajorInput || 'Chưa nhập'}
- Nhóm nghề đang đối chiếu: ${context?.careerTitle || 'Chuyên viên Công nghệ & Phân tích'} (${context?.cluster || 'Khoa học Kỹ thuật'})

YÊU CẦU TRẢ LỜI: Hãy trả lời câu hỏi của người học một cách chi tiết, chuyên sâu, đúng với lứa tuổi ${age} tuổi (${ageGroup}), có các bước hành động rõ ràng.`;

      const response = await ai.models.generateContent({
        model: chosenModel,
        contents: prompt,
        config: {
          systemInstruction,
          temperature
        }
      });

      const reply = response.text || 'Tôi sẵn sàng đồng hành cùng bạn khám phá lộ trình phù hợp nhất!';

      res.json({
        reply,
        provider: `${chosenModel} (Google Cloud)`,
        suggestedFollowUps: age <= 14 ? [
          'Những hoạt động hoặc câu lạc bộ nào phù hợp nhất với em lúc này?',
          'Làm thế nào để rèn luyện thói quen tự học hiệu quả?',
          'Em nên chuẩn bị gì cho kỳ thi tuyển sinh sắp tới?'
        ] : age <= 18 ? [
          'Với điểm thi hiện tại, cơ hội vào các trường Top 1 như thế nào?',
          'Em nên đặt thứ tự nguyện vọng xét tuyển ra sao để an toàn nhất?',
          'Kỹ năng quan trọng nhất cần tích lũy trước khi lên Đại học là gì?'
        ] : [
          'Lộ trình chuyển đổi kỹ năng (Reskilling) trong 6 tháng tới?',
          'Cách xây dựng hồ sơ năng lực (Portfolio) để bứt phá thu nhập?',
          'Những chứng chỉ chuyên ngành nào có giá trị cao nhất hiện nay?'
        ]
      });
    } catch (err: any) {
      console.error('Gemini API counseling error:', err?.message || err);
      res.status(500).json({
        error: 'Failed to generate AI response from Gemini',
        fallback: true,
        details: err?.message
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
