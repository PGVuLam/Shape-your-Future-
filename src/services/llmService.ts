import { UserProfile, Career, RecommendationScore } from '../types';
import { retrieveContextForCareer, RetrievedCareerContext } from './ragService';

export interface LLMResponse {
  content: string;
  provider: 'Gemini-3.8-Flash (Cloud)' | 'Deterministic Fallback Engine';
  suggestedFollowUps?: string[];
}

/**
 * Robust Deterministic Explanation Generator (Fallback when AI is unconfigured or offline)
 */
export function generateDeterministicCounselorResponse(
  context: RetrievedCareerContext,
  userQuestion: string,
  language: 'vi' | 'en' = 'vi'
): LLMResponse {
  const qLower = userQuestion.toLowerCase();
  const career = context.careerTitle;
  const age = context.profileContext.age;

  if (language === 'vi') {
    // Question Type 1: Why was this recommended?
    if (qLower.includes('tại sao') || qLower.includes('why') || qLower.includes('gợi ý') || qLower.includes('recommend') || qLower.includes('phù hợp')) {
      return {
        provider: 'Deterministic Fallback Engine',
        content: `Dựa trên hồ sơ năng lực của bạn, nghề **${career}** được đề xuất vì bạn có niềm yêu thích nổi bật với các môn **${context.profileContext.favoriteSubjects.slice(0, 2).join(' và ') || 'các môn tư duy logic'}** cùng nhóm mã tính cách nghề nghiệp Holland (**${context.profileContext.riasecCode}**).

Các yếu tố cốt lõi:
- **Độ phù hợp sở thích**: Niềm đam mê với ${context.profileContext.userInterests.slice(0, 2).join(', ') || 'giải quyết vấn đề'} liên hệ trực tiếp đến các hoạt động thực tiễn trong ngành ${context.cluster}.
- **Thế mạnh sẵn có**: Bạn đã thể hiện sự quen thuộc với ${context.userMatchedSkills.length > 0 ? context.userMatchedSkills.join(', ') : 'tư duy phân tích cơ bản'}.
- **Khoảng trống cần bù đắp**: Để phát triển vững chắc, bạn nên lên kế hoạch học tập thêm: ${context.userMissingSkills.slice(0, 2).join(', ') || 'các công cụ chuyên ngành'}.

*Lưu ý: Đề xuất này là chiếc kim chỉ nam định hướng để bạn khám phá, không phải quyết định bắt buộc. Bạn hoàn toàn có thể thử sức bằng các dự án nhỏ trước khi cam kết.*`,
        suggestedFollowUps: [
          `Tôi nên bắt đầu học kỹ năng nào trước cho nghề ${career}?`,
          `Làm sao để tôi thử xem mình có thực sự thích ${career} không?`,
          `Những nghề tương đồng nào khác tôi có thể cân nhắc?`
        ]
      };
    }

    // Question Type 2: What should I learn first?
    if (qLower.includes('học') || qLower.includes('learn') || qLower.includes('đầu tiên') || qLower.includes('bắt đầu') || qLower.includes('first')) {
      const topMissing = context.userMissingSkills[0] || context.requiredSkills[0] || 'Kỹ năng nền tảng';
      const experiment = context.experiments[0] || 'Xây dựng một dự án ứng dụng nhỏ';

      return {
        provider: 'Deterministic Fallback Engine',
        content: `Ở lứa tuổi ${age}, chiến lược học tập hiệu quả nhất là **tập trung vào một kỹ năng trọng tâm** thay vì cố gắng học mọi thứ cùng lúc:

1. **Kỹ năng ưu tiên hàng đầu**: **${topMissing}**. Dành 2–3 tuần làm quen với các khái niệm căn bản qua bài giảng thực hành.
2. **Thực hiện dự án cọ xát nhỏ**: ${experiment}. Điều này giúp bạn trực tiếp cảm nhận xem mình có thấy hứng thú với công việc hàng ngày không.
3. **Củng cố môn học thế mạnh**: Tiếp tục duy trì kết quả tốt môn **${context.profileContext.favoriteSubjects[0] || 'Toán học & Công nghệ'}**.

Bạn có muốn xem kế hoạch lộ trình 30 ngày chi tiết cho kỹ năng này không?`,
        suggestedFollowUps: [
          `Nếu học Toán chưa thật xuất sắc thì có theo được không?`,
          `Nên đi học Đại học hay theo hướng Cao đẳng/Dự án thực tế?`,
          `Những khó khăn hàng ngày của nghề này là gì?`
        ]
      };
    }

    // Question Type 3: Math concerns
    if (qLower.includes('toán') || qLower.includes('math') || qLower.includes('yếu') || qLower.includes('khó') || qLower.includes('sợ')) {
      return {
        provider: 'Deterministic Fallback Engine',
        content: `Đây là băn khoăn rất phổ biến và hoàn toàn chính đáng! Thực tế trong ngành **${career}**:

- **Toán trường học vs Tư duy ứng dụng**: Trong công việc thực tế, bạn không cần phải tính nhẩm phức tạp hay ghi nhớ công thức trừu tượng bằng tay, mà quan trọng nhất là **tư duy logic, khả năng bẻ nhỏ vấn đề và nhận diện quy luật**.
- **Công cụ hỗ trợ**: Các chuyên gia hiện đại đều sử dụng thư viện phần mềm, máy tính và công cụ hỗ trợ tự động.
- **Lời khuyên**: Hãy tiếp cận môn Toán thông qua **dự án thực tế** (ví dụ lập trình một trò chơi nhỏ hay phân tích số liệu sở thích của bạn). Khi thấy được ý nghĩa cụ thể, bạn sẽ tiếp thu tự nhiên hơn rất nhiều.

Nếu muốn hướng bớt toán học giải tích nặng, bạn có thể cân nhắc các nhánh liên quan như **Thiết kế Trải nghiệm Sản phẩm (UI/UX)** hoặc **Quản lý Sản phẩm Công nghệ**.`,
        suggestedFollowUps: [
          `Chia sẻ thêm về ngành Thiết kế UI/UX`,
          `Có dự án nào giúp tôi rèn luyện tư duy logic không?`,
          `Khác biệt giữa lộ trình Đại học và tự học dự án là gì?`
        ]
      };
    }

    // Default Vietnamese counseling response
    return {
      provider: 'Deterministic Fallback Engine',
      content: `Câu hỏi rất hay về định hướng ngành **${career}**!

Dựa trên hồ sơ của bạn (Cấp độ: ${context.profileContext.educationLevel}, Mã Holland: ${context.profileContext.riasecCode}):
- Lĩnh vực này kế thừa rất tốt từ sở thích **${context.profileContext.userInterests.slice(0, 2).join(' và ') || 'công nghệ và khám phá'}** của bạn.
- Cột mốc khuyến nghị tiếp theo: Thử sức với bài tập thực hành **${context.experiments[0] || 'dự án nhỏ'}** để đánh giá trực quan cảm xúc làm nghề.
- Lộ trình học tập phổ biến: Đa số chuyên gia khởi đầu qua **${context.educationPaths[0] || 'bậc Đại học hoặc các chương trình đào tạo chuyên sâu'}**.

Bạn muốn tìm hiểu sâu hơn về góc độ nào (kỹ năng bắt buộc, một ngày làm việc thực tế hay lựa chọn trường đào tạo)?`,
      suggestedFollowUps: [
        `Tại sao tôi được gợi ý ngành này?`,
        `Tôi nên học kỹ năng nào trước tiên?`,
        `Nếu không muốn học đại học 4 năm thì có lộ trình nào khác không?`
      ]
    };
  }

  // Question Type 1: Why was this recommended? (English)
  if (qLower.includes('why') || qLower.includes('recommend')) {
    return {
      provider: 'Deterministic Fallback Engine',
      content: `Based on your structured profile, **${career}** is recommended primarily because of your strong interest in **${context.profileContext.favoriteSubjects.slice(0, 2).join(' and ') || 'analytical subjects'}** and your Holland RIASEC code (**${context.profileContext.riasecCode}**).

Key matching factors:
- **Interest Alignment**: Your passion for ${context.profileContext.userInterests.slice(0, 2).join(', ') || 'problem-solving'} directly reflects the daily tasks in ${context.cluster}.
- **Strengths Present**: You already demonstrate familiarity with ${context.userMatchedSkills.length > 0 ? context.userMatchedSkills.join(', ') : 'foundational logical thinking'}.
- **Areas to Develop**: To succeed here, you will want to progressively bridge gaps in: ${context.userMissingSkills.slice(0, 2).join(', ') || 'advanced domain tools'}.

*Remember: This recommendation is an exploration compass, not an irreversible decision. You have full agency to test this path through small projects before committing.*`,
      suggestedFollowUps: [
        `What should I learn first for ${career}?`,
        `How can I test if I really like ${career}?`,
        `What alternative careers are close to this?`
      ]
    };
  }

  // Question Type 2: What should I learn first?
  if (qLower.includes('learn') || qLower.includes('first') || qLower.includes('start')) {
    const topMissing = context.userMissingSkills[0] || context.requiredSkills[0] || 'Foundational Principles';
    const experiment = context.experiments[0] || 'Build a small introductory project';

    return {
      provider: 'Deterministic Fallback Engine',
      content: `For someone at your age (${age}), the best first step is to focus on **one foundational skill** rather than feeling overwhelmed:

1. **Top Priority Skill**: **${topMissing}**. Dedicate 2–3 weeks to understanding the fundamentals through tutorials and hands-on exercises.
2. **Try the Career Experiment**: ${experiment}. This lets you test whether you genuinely enjoy the workflow before investing months of study.
3. **Core Subject Focus**: Continue building confidence in **${context.profileContext.favoriteSubjects[0] || 'Mathematics & Technology'}**.

Would you like a step-by-step 30-day checklist for this?`,
      suggestedFollowUps: [
        `Can I do this if I'm not top of my class in math?`,
        `Which university or vocational path is best for this?`,
        `What are the daily challenges in this career?`
      ]
    };
  }

  // Question Type 3: Math concerns
  if (qLower.includes('math') || qLower.includes('weak') || qLower.includes('difficult')) {
    return {
      provider: 'Deterministic Fallback Engine',
      content: `That is an extremely common and valid concern! Here is the honest reality for **${career}**:

- **School Math vs Applied Thinking**: In modern industry, success is rarely about doing mental arithmetic or memorizing obscure formulas by hand. It is about **computational logic, problem decomposition, and pattern recognition**.
- **Available Tools**: Modern practitioners use software libraries, calculators, and automated tools for heavy computation.
- **Actionable Advice**: If pure math feels daunting, approach it through **practical projects** (e.g. programming a game character or analyzing data from a hobby you love). When math has a tangible purpose, it becomes significantly easier to grasp.

If you strongly prefer to avoid advanced calculus, you can also explore closely related careers such as **UI/UX Product Design** or **Technical Product Management**, which emphasize human psychology and user empathy over advanced mathematics.`,
      suggestedFollowUps: [
        `Tell me more about UI/UX Design as an alternative`,
        `What projects can I build to improve my logic?`,
        `What is the difference between university and self-taught paths?`
      ]
    };
  }

  // General fallback counseling response
  return {
    provider: 'Deterministic Fallback Engine',
    content: `Great question regarding **${career}**!

From your profile (${context.profileContext.educationLevel}, RIASEC: ${context.profileContext.riasecCode}):
- This field directly builds upon your interests in **${context.profileContext.userInterests.slice(0, 2).join(' and ') || 'technology and discovery'}**.
- Recommended next milestone: Try the **${context.experiments[0] || 'hands-on experiment'}** to test your hands-on enjoyment.
- Educational route: Most professionals enter through **${context.educationPaths[0] || 'University or specialized vocational training'}**.

What specific aspect would you like to explore deeper (required skills, a day in the life, or education options)?`,
    suggestedFollowUps: [
      `Why did you recommend this career to me?`,
      `What should I learn first?`,
      `What if I don't want to go to university?`
    ]
  };
}

/**
 * Main AI Counselor Query function
 */
export async function askAICounselor(
  profile: UserProfile,
  career: Career,
  userQuestion: string,
  chatHistory: Array<{ role: string; content: string }> = [],
  recScore?: RecommendationScore,
  language: 'vi' | 'en' = 'vi'
): Promise<LLMResponse> {
  const context = retrieveContextForCareer(profile, career, recScore);

  try {
    const res = await fetch('/api/ai/counselor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context,
        userQuestion,
        chatHistory,
        language
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          content: data.reply,
          provider: 'Gemini-3.8-Flash (Cloud)',
          suggestedFollowUps: data.suggestedFollowUps || (language === 'vi' ? [
            `Tôi nên bắt đầu học kỹ năng nào trước cho ${career.title}?`,
            `Nghề này khớp với mã Holland của tôi như thế nào?`,
            `Các nghề thay thế tương đồng nhất là gì?`
          ] : [
            `What should I learn first for ${career.title}?`,
            `How does this match my RIASEC profile?`,
            `What are the closest alternative careers?`
          ])
        };
      }
    }
  } catch {
    // Graceful fallback to deterministic engine
  }

  // Return deterministic fallback
  return generateDeterministicCounselorResponse(context, userQuestion, language);
}
