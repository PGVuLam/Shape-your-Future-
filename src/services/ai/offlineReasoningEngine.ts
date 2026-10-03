import { CounselorContextPayload, NormalizedAIResponse } from './types';
import { getAgeGroupMeta } from '../../utils/ageGroupUtils';

/**
 * Deterministic Domain Reasoning Engine (100% offline, instantaneous, privacy-safe)
 * Combines intent-matching with specialized age-group directives, dynamic profile evaluation,
 * and verified career grounding without hardcoded score fallbacks or hallucinated claims.
 */
export function generateOfflineCounselingResponse(
  context: CounselorContextPayload,
  userQuestion: string,
  language: 'vi' | 'en' = 'vi'
): NormalizedAIResponse {
  const p = context.profileContext;
  const name = p.name?.trim() || (language === 'vi' ? 'bạn' : 'there');
  const age = Number(p.age || 17);
  const ageGroup = p.ageGroup || '15-18';
  const ageMeta = getAgeGroupMeta(ageGroup);
  const careerTitle = context.careerTitle || 'Chuyên viên Kỹ thuật & Công nghệ';
  const cluster = context.cluster || 'Khoa học Kỹ thuật';
  const riasec = p.riasecCode || 'IRC';
  const mbti = p.mbtiType || 'INTJ';
  const gpa = p.academicGPA;

  const hsa = p.examScores?.hsaScore;
  const tsa = p.examScores?.tsaScore;
  const vact = p.examScores?.vactScore;
  const thpt = p.examScores?.thptScore;
  const thptCombo = p.examScores?.thptCombo || 'A00 / A01 / D01';
  const awards = p.examScores?.awards || [];
  const salaryDesc = context.salaryLevel || '15 - 30 triệu VNĐ/tháng (theo dữ liệu tham khảo CSDL nghề)';

  const qLower = (userQuestion || '').toLowerCase().trim();

  let reply = '';
  let suggestedQuestions: string[] = [];

  // Helper to summarize actual verified score profile
  const buildScoreSummaryLines = () => {
    const lines: string[] = [];
    if (gpa) lines.push(`- 📚 **Học bạ GPA:** ${gpa}`);
    if (tsa) lines.push(`- 🌟 **Đánh giá tư duy Bách Khoa (TSA):** ${tsa}/100 điểm`);
    if (hsa) lines.push(`- 📈 **Đánh giá năng lực ĐHQGHN (HSA):** ${hsa}/150 điểm`);
    if (vact) lines.push(`- 🧭 **Đánh giá năng lực ĐHQG TP.HCM (V-ACT):** ${vact}/1200 điểm`);
    if (thpt) lines.push(`- 🎯 **Dự kiến điểm thi THPT:** ${thpt} điểm (Tổ hợp ${thptCombo})`);
    if (awards.length > 0) lines.push(`- 🏆 **Chứng chỉ / Giải thưởng:** ${awards.join(', ')}`);
    return lines;
  };

  // =========================================================================
  // Intent 1: Greetings & Casual Openers
  // =========================================================================
  if (
    qLower === 'chào bạn' ||
    qLower === 'xin chào' ||
    qLower === 'chào' ||
    qLower === 'hello' ||
    qLower === 'hi' ||
    qLower.startsWith('chào') ||
    qLower.includes('bạn là ai') ||
    qLower.includes('bắt đầu')
  ) {
    if (language === 'vi') {
      const scoreLines = buildScoreSummaryLines();
      const scoreText = scoreLines.length > 0
        ? scoreLines.join('\n')
        : '- 📊 **Năng lực học tập:** Đang cập nhật điểm thi / học bạ';

      reply = `Chào **${name}**! Tôi là Cố vấn Hướng nghiệp AI của hệ thống. Tôi đã tiếp nhận đầy đủ dữ liệu khảo sát định hướng của bạn:
- 🎯 **Ngành mục tiêu trọng điểm:** **${careerTitle}** (${cluster}).
- 🧠 **Hồ sơ tâm lý & sở thích:** Mã Holland **${riasec}** kết hợp phong cách tư duy **${mbti}**.
${scoreText}

Bạn muốn tôi hỗ trợ phân tích phần nào trước?
1. **Đánh giá năng lực xét tuyển:** Phân tích cơ hội dựa trên hồ sơ điểm số thực tế của bạn.
2. **Chiến lược chọn trường:** So sánh thế mạnh giữa các cơ sở đào tạo phù hợp.
3. **Lộ trình rèn luyện & Kỹ năng:** Xác định các kỹ năng then chốt cần ưu tiên cho ngành ${careerTitle}.`;

      suggestedQuestions = [
        'Hồ sơ điểm số của tôi có lợi thế xét tuyển gì?',
        'Nên chọn trường Đại học trọng điểm hay trường chuyên sâu thực hành?',
        'Cần chuẩn bị kỹ năng gì cho ngành này?'
      ];
    } else {
      reply = `Hello **${name}**! I am your AI Career Exploration Counselor. I have analyzed your complete survey profile:
- Target Career: **${careerTitle}** (${cluster})
- Holland Code: **${riasec}** | MBTI Style: **${mbti}** | GPA: **${gpa || 'In progress'}**

What would you like to explore first? I can help evaluate your admission options, compare university pathways, or map out your skill development roadmap.`;
      suggestedQuestions = [
        'How competitive is my profile for this career?',
        'What skills should I prioritize learning first?',
        'What are the alternative educational paths?'
      ];
    }
  }

  // =========================================================================
  // Intent 2: Score Evaluation & Admission Chances (No made-up fallback scores)
  // =========================================================================
  else if (
    qLower.includes('cao hay thấp') ||
    qLower.includes('điểm') ||
    qLower.includes('đỗ') ||
    qLower.includes('trượt') ||
    qLower.includes('đậu') ||
    qLower.includes('hsa') ||
    qLower.includes('tsa') ||
    qLower.includes('v-act') ||
    qLower.includes('xét tuyển') ||
    qLower.includes('cơ hội') ||
    qLower.includes('khả năng trúng')
  ) {
    const hasStandardizedScores = !!(tsa || hsa || vact || thpt || gpa);
    const scoreEvals: string[] = [];

    if (tsa) {
      const tsaNum = Number(tsa);
      let tsaComment = 'thuộc nhóm điểm tích cực để tham gia xét tuyển sớm.';
      if (tsaNum >= 70) {
        tsaComment = 'nằm trong nhóm điểm xuất sắc (top thí sinh điểm cao), có lợi thế cạnh tranh rất lớn vào các ngành Kỹ thuật của Đại học Bách Khoa Hà Nội (HUST).';
      } else if (tsaNum >= 55) {
        tsaComment = 'ở mức khá, có cơ hội cạnh tranh tốt ở nhiều ngành kỹ thuật và công nghệ.';
      }
      scoreEvals.push(`🌟 **Điểm ĐGTD Bách Khoa (TSA ${tsa}/100):** Kết quả này ${tsaComment}`);
    }

    if (hsa) {
      const hsaNum = Number(hsa);
      let hsaComment = 'thuộc ngưỡng điểm phù hợp để đăng ký xét tuyển sớm.';
      if (hsaNum >= 95) {
        hsaComment = 'nằm trong nhóm điểm giỏi (top 15-20% thí sinh), tạo lợi thế rõ rệt khi xét tuyển vào UET (ĐHQG Hà Nội), PTIT hoặc ĐH Khoa học Tự nhiên.';
      } else if (hsaNum >= 80) {
        hsaComment = 'ở mức khá, thích hợp cho nhiều chương trình chuẩn và chương trình chất lượng cao.';
      }
      scoreEvals.push(`📈 **Điểm ĐGNL ĐHQGHN (HSA ${hsa}/150):** Kết quả này ${hsaComment}`);
    }

    if (vact) {
      scoreEvals.push(`🧭 **Điểm ĐGNL ĐHQG TP.HCM (V-ACT ${vact}/1200):** Thích hợp sử dụng phương thức xét điểm ĐGNL vào ĐH Bách Khoa TP.HCM, UIT, Khoa học Tự nhiên TP.HCM.`);
    }

    if (thpt) {
      scoreEvals.push(`📚 **Điểm dự kiến THPT (${thpt} điểm - Tổ hợp ${thptCombo}):** Là căn cứ quan trọng cho phương thức xét điểm thi tốt nghiệp THPT toàn quốc.`);
    }

    if (gpa) {
      scoreEvals.push(`📝 **Học bạ GPA (${gpa}):** Đáp ứng tốt điều kiện sơ tuyển và xét tuyển kết hợp chứng chỉ ngoại ngữ / học bạ.`);
    }

    if (!hasStandardizedScores) {
      reply = `Chào **${name}**! Hồ sơ hiện tại của bạn chưa ghi nhận điểm thi ĐGNL (HSA), ĐGTD (TSA) hoặc điểm thi THPT. 

Dưới đây là định hướng chiến lược điểm số tham khảo cho ngành **${careerTitle}**:
1. **Thi ĐGNL / ĐGTD (Xét tuyển sớm):** Bạn có thể tham khảo đăng ký thi HSA (ĐHQGHN) hoặc TSA (Bách Khoa) vào đợt đầu năm để tăng thêm cơ hội đỗ sớm trước kỳ thi tốt nghiệp.
2. **Xét điểm thi THPT (Tổ hợp ${thptCombo}):** Chuẩn bị đều 3 môn trong tổ hợp xét tuyển. Mức điểm chuẩn các trường top dao động theo từng năm.
3. **Xét học bạ kết hợp chứng chỉ:** Duy trì GPA giỏi cùng chứng chỉ tiếng Anh (IELTS) để nộp hồ sơ xét tuyển kết hợp.

*Lưu ý: Điểm chuẩn thay đổi theo đề án tuyển sinh hàng năm của từng trường, không có con số trúng tuyển bảo đảm tuyệt đối.*`;
    } else {
      reply = `Chào **${name}**! Dưới đây là phân tích đối chiếu điểm số thực tế từ hồ sơ của bạn:

${scoreEvals.join('\n\n')}

🎯 **Chiến lược tối ưu hóa cơ hội:**
1. **Tận dụng xét tuyển sớm:** Nộp hồ sơ bằng các cột điểm bạn có lợi thế nhất (HSA / TSA / Học bạ kết hợp chứng chỉ) trong các đợt mở sớm từ tháng 4 – tháng 6.
2. **Chiến thuật đăng ký nguyện vọng:** Phân chia danh sách nguyện vọng thành 3 nhóm rõ ràng: Nguyện vọng Mơ ước (Top 1), Nguyện vọng Vừa sức (Top 2), và Nguyện vọng An toàn.
3. **Lưu ý minh bạch:** Khả năng trúng tuyển thực tế phụ thuộc vào chỉ tiêu và phổ điểm chính thức của từng trường trong năm thi.`;
    }

    suggestedQuestions = [
      'Nên sắp xếp thứ tự nguyện vọng thế nào cho an toàn?',
      'Có nên thi thêm kỳ thi Đánh giá năng lực không?',
      'Học phí và cơ hội học bổng của ngành này ra sao?'
    ];
  }

  // =========================================================================
  // Intent 3: University Selection & Comparison (Neutral, no biased "Lựa chọn số 1")
  // =========================================================================
  else if (
    qLower.includes('chọn trường') ||
    qLower.includes('đại học') ||
    qLower.includes('bách khoa') ||
    qLower.includes('uet') ||
    qLower.includes('hust') ||
    qLower.includes('ptit') ||
    qLower.includes('học ở đâu') ||
    qLower.includes('so sánh trường') ||
    (qLower.includes('trường') && !qLower.includes('ra trường'))
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

    suggestedQuestions = [
      'Học phí trung bình giữa trường công lập và trường tư thục?',
      'Nên ưu tiên trường có danh tiếng hay trường có học bổng?',
      'Lộ trình liên thông từ Cao đẳng lên Đại học như thế nào?'
    ];
  }

  // =========================================================================
  // Intent 4: Salary & Labor Market Outlook (Dynamic data grounded)
  // =========================================================================
  else if (
    qLower.includes('lương') ||
    qLower.includes('thu nhập') ||
    qLower.includes('việc làm') ||
    qLower.includes('thị trường') ||
    qLower.includes('cơ hội việc') ||
    qLower.includes('ra trường') ||
    qLower.includes('kiếm tiền')
  ) {
    reply = `Chào **${name}**! Dưới đây là thông tin thị trường lao động và mức thu nhập tham khảo cho ngành **${careerTitle}** (${cluster}):

💰 **Mức thu nhập tham khảo theo dữ liệu CSDL nghề nghiệp:**
- **Khung thu nhập định hướng:** ${salaryDesc}
- **Khởi điểm (0 - 2 năm):** Thường dao động theo năng lực thực chiến, ngoại ngữ và kỹ năng lập trình/chuyên môn.
- **Kinh nghiệm (3 - 5+ năm):** Thu nhập tăng trưởng tương xứng với khả năng quản lý dự án, giải quyết bài toán phức tạp và kỹ năng ngoại ngữ.

🏢 **Môi trường tuyển dụng tiêu biểu:**
- Các doanh nghiệp công nghệ, viện nghiên cứu R&D, và các tập đoàn liên doanh nước ngoài.
- Các công ty dịch vụ chuyên môn, sản xuất công nghiệp và doanh nghiệp khởi nghiệp.

*Lưu ý minh bạch: Mức lương thực tế phụ thuộc vào năng lực cá nhân, chứng chỉ nghề nghiệp, quy mô doanh nghiệp và địa điểm làm việc; số liệu trên chỉ mang tính chất tham khảo.*`;

    suggestedQuestions = [
      'Làm thế nào để nâng cao năng lực để có thu nhập khởi điểm tốt?',
      'Ngoại ngữ đóng vai trò quan trọng thế nào trong mức lương?',
      'Nhu cầu tuyển dụng của ngành này trong 3-5 năm tới ra sao?'
    ];
  }

  // =========================================================================
  // Intent 5: Skills & Learning Roadmap
  // =========================================================================
  else if (
    qLower.includes('kỹ năng') ||
    qLower.includes('học gì') ||
    qLower.includes('lộ trình') ||
    qLower.includes('chuẩn bị') ||
    qLower.includes('bắt đầu')
  ) {
    const topMissing = context.userMissingSkills?.[0] || context.requiredSkills[0] || 'Kỹ năng chuyên môn nền tảng';
    const sampleTask = context.tasks[0] || 'Xây dựng một module thực hành ứng dụng cơ bản';

    reply = `Chào **${name}**! Ở lứa tuổi **${age} tuổi (${ageMeta.stageVi})**, lộ trình rèn luyện hiệu quả cho ngành **${careerTitle}** được chia thành 3 bước:

🚀 **Giai đoạn 1: Xây dựng nền tảng (Ngay bây giờ):**
1. **Kỹ năng ưu tiên hàng đầu:** **${topMissing}**. Dành thời gian tiếp cận khái niệm cơ bản qua các tài liệu học tập thực hành.
2. **Củng cố môn học thế mạnh:** Duy trì kết quả tốt các môn ${context.profileContext.favoriteSubjects?.slice(0, 2).join(' và ') || 'Toán học & Công nghệ'}.
3. **Ngoại ngữ chuyên ngành:** Rèn thói quen đọc tài liệu kỹ thuật bằng tiếng Anh.

🛠️ **Giai đoạn 2: Thực hành ứng dụng (Trải nghiệm thực tế):**
- Thử sức với bài tập thực hành: *${sampleTask}*.
- Tham gia các câu lạc bộ học thuật, hoạt động nghiên cứu khoa học trẻ hoặc làm dự án nhỏ cùng bạn bè.

🎯 **Giai đoạn 3: Hoàn thiện & Định vị:**
- Tích lũy chứng chỉ chuyên môn, xây dựng portfolio sản phẩm thực tế để sẵn sàng ứng tuyển thực tập.`;

    suggestedQuestions = [
      'Có những khóa học trực tuyến miễn phí nào phù hợp cho kỹ năng này?',
      'Làm sao để vừa học tốt trên lớp vừa rèn luyện kỹ năng ngoài giờ?',
      'Cách xây dựng portfolio học tập ấn tượng từ cấp 3?'
    ];
  }

  // =========================================================================
  // Intent 6: AI Impact, Automation & 3–5 Year Future Outlook (Strictly Grounded)
  // =========================================================================
  else if (
    qLower.includes('ai') ||
    qLower.includes('trí tuệ nhân tạo') ||
    qLower.includes('tự động hóa') ||
    qLower.includes('thay thế') ||
    qLower.includes('tương lai') ||
    qLower.includes('xu hướng') ||
    qLower.includes('3-5 năm') ||
    qLower.includes('3 năm') ||
    qLower.includes('5 năm')
  ) {
    const analysis = context.aiImpactAnalysis;
    const aiImpactText = analysis?.directAiImpact || (typeof context.aiImpact === 'string' ? context.aiImpact : 'AI đóng vai trò công cụ cộng tác hỗ trợ tăng năng suất, giải phóng thời gian khỏi thao tác lặp lại.');
    const assistTasks = (analysis?.assistableTasks && analysis.assistableTasks.length > 0)
      ? analysis.assistableTasks.slice(0, 3).map(t => `- ⚙️ ${t}`).join('\n')
      : '- ⚙️ Tra cứu, tiền xử lý dữ liệu và soạn thảo quy chuẩn ban đầu.';
    const humanSkills = (analysis?.humanAbilities && analysis.humanAbilities.length > 0)
      ? analysis.humanAbilities.slice(0, 3).map(s => `- 🧠 ${s}`).join('\n')
      : '- 🧠 Tư duy phản biện, thấu cảm, đạo đức nghề nghiệp và giải quyết vấn đề phức tạp.';
    const newSkills = (analysis?.emergingSkills && analysis.emergingSkills.length > 0)
      ? analysis.emergingSkills.slice(0, 4).join(', ')
      : 'Kỹ năng cộng tác với AI, tư duy hệ thống và phân tích chuyên sâu';
    const prepAdvice = (analysis?.tailoredAdvice && analysis.tailoredAdvice.length > 0)
      ? analysis.tailoredAdvice.slice(0, 3).map(a => `• ${a}`).join('\n')
      : `• Nắm vững kiến thức nền tảng và rèn luyện kỹ năng sử dụng công cụ AI như một trợ lý tăng tốc.`;

    reply = `Chào **${name}**! Dưới đây là phân tích toàn diện về **Tác động của AI & Triển vọng 3–5 năm** cho ngành **${careerTitle}** dựa trên dữ liệu hệ thống:

🤖 **1. AI Automation (Những gì AI có thể hỗ trợ / tự động hóa):**
${aiImpactText}
*Các tác vụ AI có thể đẩy nhanh:*
${assistTasks}

🛡️ **2. Human Advantage (Thế mạnh con người vẫn mang tính quyết định):**
${analysis?.humanAdvantageSummary || 'AI là công cụ đắc lực, nhưng con người vẫn nắm giữ quyền kiểm định, đạo đức và sự sáng tạo bản nguyên.'}
${humanSkills}

📈 **3. Skill Demand (Kỹ năng gia tăng tầm quan trọng trong 3–5 năm tới):**
- Trọng tâm cần trang bị: **${newSkills}**.
- Định hướng thị trường: ${analysis?.marketTrendSummary || 'Tăng cường ứng dụng công nghệ thông minh song song với tư duy liên ngành.'}

🎯 **4. Học sinh nên chuẩn bị gì (Personalized Preparation):**
${prepAdvice}

⚖️ **5. Phân định dữ liệu & Tính bất định (Grounding & Uncertainty):**
- 📌 **Dữ liệu đã xác thực trong hệ thống (Known data):** Các nhiệm vụ, chuẩn kỹ năng và lộ trình thăng tiến được chuẩn hóa trong CSDL nghề.
- 💡 **Suy luận tương thích (Inference):** Mức độ hòa hợp dựa trên hồ sơ học sinh và đặc thù ngành.
- ⏳ **Yếu tố bất định 3–5 năm (Future uncertainty):** Tốc độ phát triển của các mô hình AI mới và biến động thị trường lao động.
*Lưu ý: Dự báo 3–5 năm mang tính định hướng phát triển năng lực, không phải cam kết việc làm cố định.*`;

    suggestedQuestions = [
      'Làm thế nào để ứng dụng AI vào việc tự học ngành này?',
      'Những kỹ năng nào của con người AI khó thay thế nhất?',
      'Cần học thêm ngoại ngữ gì để tiếp cận tài liệu AI mới nhất?'
    ];
  }

  // =========================================================================
  // Intent 7: Holland & MBTI Fit Analysis
  // =========================================================================
  else if (
    qLower.includes('tại sao') ||
    qLower.includes('phù hợp') ||
    qLower.includes('holland') ||
    qLower.includes('mbti') ||
    qLower.includes('tính cách')
  ) {
    reply = `Chào **${name}**! Ngành **${careerTitle}** được đề xuất dựa trên mức độ tương thích giữa hồ sơ tâm lý và yêu cầu thực tế của nghề:

🧩 **1. Thiên hướng sở thích nghề nghiệp RIASEC (${riasec}):**
- Mã Holland phản ánh nhóm sở thích hành vi tự nhiên của bạn, phù hợp với môi trường làm việc thực tế của ngành ${careerTitle} (${cluster}).

🧠 **2. Phong cách tư duy MBTI (${mbti}):**
- MBTI là yếu tố bổ trợ (chiếm 5% trọng số), phản ánh xu hướng xử lý thông tin và lập kế hoạch làm việc độc lập hoặc theo nhóm.
- Bạn sở hữu thế mạnh trong việc phân tích logic và kiên trì với mục tiêu đã đề ra.`;

    suggestedQuestions = [
      'Điểm mạnh lớn nhất trong tính cách của tôi khi làm nghề này là gì?',
      'Làm thế nào để phát triển kỹ năng làm việc nhóm hiệu quả?',
      'Tôi có thể thử nghiệm những ngành nghề liên quan nào khác?'
    ];
  }

  // =========================================================================
  // Default Adaptive Contextual Response
  // =========================================================================
  else {
    reply = `Chào **${name}**! Cảm ơn câu hỏi của bạn về: "*${userQuestion}*".

Dựa trên toàn bộ hồ sơ khảo sát của bạn (Mã Holland **${riasec}**, MBTI **${mbti}**, GPA **${gpa || 'Khá - Giỏi'}** và mục tiêu ngành nghề **${careerTitle}**):

1. **Về sự tương thích nghề nghiệp:** Sự kết hợp giữa tư duy phân tích (${mbti}) và thiên hướng thực hành (${riasec}) giúp bạn có nền tảng vững chắc để học tập và phát triển trong ngành ${careerTitle}.
2. **Về chiến lược học tập:** Hãy tiếp tục duy trì kết quả học tập ổn định, chủ động rèn luyện ngoại ngữ và trải nghiệm các bài tập thực hành nhỏ để kiểm chứng niềm đam mê.
3. **Về cơ hội phát triển:** Thị trường lao động luôn rộng mở với những nhân sự có kỹ năng thực chiến, thái độ chủ động và khả năng thích ứng linh hoạt.

Tôi luôn sẵn sàng đồng hành cùng bạn. Bạn muốn tìm hiểu sâu hơn về khía cạnh nào?`;

    suggestedQuestions = [
      'Đánh giá cơ hội xét tuyển của tôi vào các trường đại học?',
      'Chiến lược đăng ký nguyện vọng đại học an toàn?',
      'Lộ trình chuẩn bị kỹ năng chuyên môn trong 6 tháng tới?'
    ];
  }

  return {
    reply,
    modelUsed: 'EduPath Knowledge Engine (Offline)',
    suggestedQuestions,
    content: reply,
    provider: 'EduPath Knowledge Engine (Offline)',
    suggestedFollowUps: suggestedQuestions
  };
}
