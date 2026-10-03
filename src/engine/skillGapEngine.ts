import { Career, UserProfile, SkillGapAnalysis, SkillGapItem } from '../types';

/**
 * Helper to build a comprehensive SkillGapItem with all 9 required dimensions:
 * - Skill
 * - Current Status (Strong | Developing | Missing)
 * - Required Level (Qualitative: Core Essential, Technical Mastery, Soft Skill, Advanced)
 * - Gap (Qualitative: Mastered, Intermediate gap, Large gap)
 * - Priority (High | Medium | Low)
 * - Reason (Why this skill is mandatory for this career)
 * - Improvement Method (Actionable learning plan)
 * - Suggested Practice (Concrete exercises)
 * - Suggested Project (Real-world portfolio/mini project)
 */
function buildEnrichedSkillItem(
  skill: string,
  userLevel: 'Strong' | 'Developing' | 'Missing',
  priority: 'High' | 'Medium' | 'Low',
  category: 'Technical' | 'Soft' | 'Domain',
  career: Career,
  origin: 'required' | 'technical' | 'soft' | 'recommended'
): SkillGapItem {
  // 1. Required Level (Qualitative requirement, no fabricated numeric score)
  let requiredLevel = 'Cốt lõi bắt buộc (Core Essential)';
  if (origin === 'technical') {
    requiredLevel = 'Kỹ thuật chuyên môn (Technical Mastery)';
  } else if (origin === 'soft') {
    requiredLevel = 'Kỹ năng mềm thiết yếu (Professional Soft Skill)';
  } else if (origin === 'recommended') {
    requiredLevel = 'Khuyến nghị nâng cao (Advanced Recommended)';
  }

  // 2. Qualitative Gap Assessment
  let gap = 'Khoảng cách lớn — Chưa có nền tảng, cần đào tạo từ đầu';
  if (userLevel === 'Strong') {
    gap = 'Đã đạt yêu cầu — Nền tảng vững chắc, sẵn sàng áp dụng vào đồ án thực tế';
  } else if (userLevel === 'Developing') {
    gap = 'Khoảng cách trung bình — Đã nắm khái niệm, cần rèn luyện làm việc độc lập';
  }

  // 3. Career-tailored Reason
  let reason = `Kỹ năng trọng yếu để thực hiện các tác vụ kỹ thuật và giải quyết bài toán cốt lõi của nghề ${career.title}.`;
  if (category === 'Soft') {
    reason = `Cần thiết để phối hợp nhóm hiệu quả, báo cáo tiến độ và giải thích giải pháp cho các bên liên quan trong ngành ${career.title}.`;
  } else if (origin === 'required') {
    reason = `Là điều kiện tiên quyết trong mô tả công việc tiêu chuẩn của ngành ${career.title}; thiếu kỹ năng này sẽ gặp khó khăn khi làm đồ án và thử việc.`;
  }

  // 4. Actionable Improvement Method
  let improvementMethod = `Tham gia khóa học bài bản (20–30 giờ), học qua tài liệu chính thức và hoàn thành bài tập tuần tự từ dễ đến khó.`;
  let recommendedAction = `Tham gia khóa học bài bản (20–30 giờ) để làm chủ ${skill}.`;

  if (userLevel === 'Strong') {
    improvementMethod = `Duy trì phong độ bằng cách nghiên cứu các kiến trúc nâng cao, tối ưu hóa hiệu năng và hướng dẫn người khác.`;
    recommendedAction = `Duy trì phong độ qua các dự án thực tế độ phức tạp cao.`;
  } else if (userLevel === 'Developing') {
    improvementMethod = `Đọc tài liệu chuyên sâu, tự giải quyết các lỗi thực tế (debugging) và chủ động xây dựng module độc lập.`;
    recommendedAction = `Rèn luyện phản xạ qua 10–15 bài tập tình huống và làm việc độc lập.`;
  } else {
    improvementMethod = `Bắt đầu từ vạch số 0: học cú pháp, nguyên lý cơ bản qua video hướng dẫn, làm theo từng bước (hands-on walkthrough).`;
    recommendedAction = `Học từ nền tảng: hoàn thành bài tập nhập môn và dự án nhỏ có hướng dẫn với ${skill}.`;
  }

  // 5. Suggested Practice
  let suggestedPractice = `Thực hành 10–15 bài tập tình huống thực tế về ${skill}; tự viết lại lời giải thích logic.`;
  if (userLevel === 'Strong') {
    suggestedPractice = `Thử sức với các bài toán tối ưu hoặc phân tích lỗi hệ thống phức tạp liên quan đến ${skill}.`;
  } else if (userLevel === 'Developing') {
    suggestedPractice = `Làm chuỗi bài tập trung cấp; viết kiểm thử (test cases) hoặc tự đánh giá chéo kết quả.`;
  } else {
    suggestedPractice = `Hoàn thành 5–8 bài thực hành nhập môn cơ bản; ghi chú lại các lỗi cú pháp và khái niệm quan trọng.`;
  }

  // 6. Suggested Project
  let suggestedProject = career.beginnerProjects?.[0] || `Xây dựng ứng dụng mini ứng dụng trực tiếp ${skill} giải quyết một vấn đề thực tế`;
  if (userLevel === 'Strong') {
    suggestedProject = career.portfolioExamples?.[0] || `Dự án tốt nghiệp (Capstone) tích hợp ${skill} vào hệ thống hoàn chỉnh`;
  } else if (userLevel === 'Missing') {
    suggestedProject = career.experiments?.[0]?.title || `Thực nghiệm nhập môn 3–5 ngày: Cài đặt và chạy thử module đầu tay với ${skill}`;
  }

  return {
    skill,
    userLevel,
    priority,
    category,
    recommendedAction,
    currentStatus: userLevel,
    requiredLevel,
    gap,
    reason,
    improvementMethod,
    suggestedPractice,
    suggestedProject
  };
}

export function analyzeSkillGap(profile: UserProfile, career: Career): SkillGapAnalysis {
  const userSkillMap = new Map<string, { level: 'Strong' | 'Developing' | 'Beginner'; category: string }>();

  // Extract from selfRatedSkills
  profile.selfRatedSkills?.forEach(s => {
    if (s && s.skill) {
      userSkillMap.set(s.skill.toLowerCase().trim(), {
        level: s.level === 'Expert' || s.level === 'Strong' ? 'Strong' : s.level === 'Developing' ? 'Developing' : 'Beginner',
        category: s.category || 'Technical'
      });
    }
  });

  // Extract from general skills array
  profile.skills?.forEach(s => {
    if (s) {
      const sLower = s.toLowerCase().trim();
      if (!userSkillMap.has(sLower)) {
        userSkillMap.set(sLower, { level: 'Developing', category: 'Technical' });
      }
    }
  });

  const strongSkills: SkillGapItem[] = [];
  const developingSkills: SkillGapItem[] = [];
  const missingSkills: SkillGapItem[] = [];

  // 1. Process Required Skills (High / Medium Priority)
  career.requiredSkills.forEach((reqSkill, idx) => {
    const reqLower = reqSkill.toLowerCase().trim();
    let foundLevel: 'Strong' | 'Developing' | 'Beginner' | null = null;

    for (const [uSkill, data] of userSkillMap.entries()) {
      if (uSkill.includes(reqLower) || reqLower.includes(uSkill)) {
        foundLevel = data.level;
        break;
      }
    }

    if (foundLevel === 'Strong') {
      strongSkills.push(
        buildEnrichedSkillItem(reqSkill, 'Strong', 'Low', 'Technical', career, 'required')
      );
    } else if (foundLevel === 'Developing' || foundLevel === 'Beginner') {
      developingSkills.push(
        buildEnrichedSkillItem(reqSkill, 'Developing', idx < 2 ? 'High' : 'Medium', 'Technical', career, 'required')
      );
    } else {
      missingSkills.push(
        buildEnrichedSkillItem(reqSkill, 'Missing', 'High', 'Technical', career, 'required')
      );
    }
  });

  // 2. Process Technical Skills
  career.technicalSkills.forEach(techSkill => {
    const techLower = techSkill.toLowerCase().trim();
    // Skip if already evaluated in required skills
    if ([...strongSkills, ...developingSkills, ...missingSkills].some(s => s.skill.toLowerCase() === techLower)) {
      return;
    }

    let foundLevel: 'Strong' | 'Developing' | 'Beginner' | null = null;
    for (const [uSkill, data] of userSkillMap.entries()) {
      if (uSkill.includes(techLower) || techLower.includes(uSkill)) {
        foundLevel = data.level;
        break;
      }
    }

    if (foundLevel === 'Strong') {
      strongSkills.push(
        buildEnrichedSkillItem(techSkill, 'Strong', 'Low', 'Technical', career, 'technical')
      );
    } else if (foundLevel === 'Developing') {
      developingSkills.push(
        buildEnrichedSkillItem(techSkill, 'Developing', 'Medium', 'Technical', career, 'technical')
      );
    } else {
      missingSkills.push(
        buildEnrichedSkillItem(techSkill, 'Missing', 'Medium', 'Technical', career, 'technical')
      );
    }
  });

  // 3. Process Soft Skills
  career.softSkills.forEach(softSkill => {
    const softLower = softSkill.toLowerCase().trim();
    // Skip if already in list
    if ([...strongSkills, ...developingSkills, ...missingSkills].some(s => s.skill.toLowerCase() === softLower)) {
      return;
    }

    let foundLevel: 'Strong' | 'Developing' | 'Beginner' | null = null;
    for (const [uSkill, data] of userSkillMap.entries()) {
      if (uSkill.includes(softLower) || softLower.includes(uSkill)) {
        foundLevel = data.level;
        break;
      }
    }

    if (foundLevel === 'Strong') {
      strongSkills.push(
        buildEnrichedSkillItem(softSkill, 'Strong', 'Low', 'Soft', career, 'soft')
      );
    } else {
      developingSkills.push(
        buildEnrichedSkillItem(softSkill, 'Developing', 'Medium', 'Soft', career, 'soft')
      );
    }
  });

  // Overall readiness: percentage of weighted skill points attained
  const totalSkills = strongSkills.length + developingSkills.length + missingSkills.length;
  const points = (strongSkills.length * 1.0) + (developingSkills.length * 0.5);
  const overallReadiness = totalSkills > 0 ? Math.round((points / totalSkills) * 100) : 40;

  return {
    careerId: career.id,
    careerTitle: career.title,
    overallReadiness,
    strongSkills,
    developingSkills,
    missingSkills,
    highPriorityCount: missingSkills.filter(s => s.priority === 'High').length
  };
}
