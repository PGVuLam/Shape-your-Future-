import { Career, UserProfile, LearningRoadmap, RoadmapPhase, RoadmapMilestoneStep, SkillGapAnalysis } from '../types';
import { analyzeSkillGap } from './skillGapEngine';

/**
 * Builds actionable milestone steps connecting:
 * Skill Gap → Learning Concept → Small Exercises → Mini Project → Milestone
 */
function buildMilestoneStepsForSkills(
  skills: Array<{
    skill: string;
    userLevel: 'Strong' | 'Developing' | 'Missing';
    requiredLevel?: string;
    gap?: string;
    priority: 'High' | 'Medium' | 'Low';
    category?: string;
  }>,
  career: Career,
  phaseType: 'foundation' | 'intermediate' | 'capstone'
): RoadmapMilestoneStep[] {
  return skills.map((item, idx) => {
    const sName = item.skill;

    if (phaseType === 'foundation') {
      // 0–3 months: Focus on missing / high priority skills
      return {
        skill: sName,
        currentStatus: item.userLevel,
        requiredLevel: item.requiredLevel || 'Cốt lõi bắt buộc (Core Essential)',
        gap: item.gap || 'Khoảng cách lớn — Cần học từ nền tảng',
        priority: item.priority,
        learningConcept: `Nghiên cứu nguyên lý, thuật ngữ và cấu trúc vận hành cốt lõi của ${sName}.`,
        smallExercises: [
          `Hoàn thành 5–8 bài tập cú pháp và tư duy cơ bản về ${sName}.`,
          `Thực hành debug và ghi chú các lỗi phổ biến khi sử dụng ${sName}.`
        ],
        miniProject: `Xây dựng mini-project 1: Module độc lập giải quyết bài toán nhập môn ứng dụng ${sName}.`,
        milestoneGoal: `Chạy thử nghiệm thành công mini-project đầu tay và tự kiểm tra đạt yêu cầu kiến thức nền tảng.`
      };
    } else if (phaseType === 'intermediate') {
      // 3–6 months: Developing skills & integration
      return {
        skill: sName,
        currentStatus: item.userLevel,
        requiredLevel: item.requiredLevel || 'Kỹ thuật chuyên sâu (Technical Mastery)',
        gap: item.gap || 'Khoảng cách trung bình — Cần thực hành dự án tích hợp',
        priority: item.priority,
        learningConcept: `Học các mẫu thiết kế (Design patterns), quy chuẩn tối ưu hóa và thư viện thực tế cho ${sName}.`,
        smallExercises: [
          `Giải 10–12 bài tập tình huống nâng cao có kiểm tra tự động (Unit Tests).`,
          `Tối ưu hóa thời gian xử lý và tài nguyên của module ${sName}.`
        ],
        miniProject: `Xây dựng sản phẩm trung cấp kết hợp đa kỹ năng (tích hợp ${sName} vào luồng nghiệp vụ của ${career.title}).`,
        milestoneGoal: `Sản phẩm hoạt động ổn định, có tài liệu README hướng dẫn và đạt tiêu chuẩn mã nguồn sạch.`
      };
    } else {
      // 6–12 months: Capstone & Portfolio readiness
      return {
        skill: sName,
        currentStatus: item.userLevel,
        requiredLevel: item.requiredLevel || 'Sẵn sàng ứng tuyển thực tế',
        gap: 'Chuyển hóa từ bài tập sang sản phẩm chuẩn doanh nghiệp',
        priority: item.priority,
        learningConcept: `Quy trình triển khai hoàn chỉnh (CI/CD, Release), bảo mật dữ liệu và bảo vệ đồ án chuyên nghiệp.`,
        smallExercises: [
          `Tham gia đóng góp mã nguồn cộng đồng hoặc giải quyết bài toán thử thách của ngành.`,
          `Luyện tập thuyết trình kỹ thuật và phỏng vấn tình huống (Mock Interview).`
        ],
        miniProject: career.portfolioExamples?.[0] || `Capstone Project hoàn chỉnh mô phỏng sản phẩm thực tế của nghề ${career.title}`,
        milestoneGoal: `Công khai Portfolio/GitHub có demo hoạt động trực tuyến, sẵn sàng ứng tuyển thực tập hoặc nộp hồ sơ xét tuyển.`
      };
    }
  });
}

/**
 * Generates an age-calibrated, highly personalized 3-phase Learning Roadmap (0–3m, 3–6m, 6–12m)
 * directly driven by the student's real-time Skill Gap Analysis.
 *
 * Each milestone strictly enforces the chain:
 * Skill Gap → Learning Concept → Small Exercises → Mini Project → Milestone
 */
export function generateLearningRoadmap(
  profile: UserProfile,
  career: Career,
  externalSkillGap?: SkillGapAnalysis
): LearningRoadmap {
  const gap = externalSkillGap || analyzeSkillGap(profile, career);
  const hoursPerWeek = profile.availableStudyTimeHoursPerWeek || 10;
  const studentName = profile.name || 'Học viên';

  // Sort and partition skills based on priority and user level
  const highPriorityMissing = gap.missingSkills.filter(s => s.priority === 'High');
  const mediumPriorityMissing = gap.missingSkills.filter(s => s.priority !== 'High');
  const developing = gap.developingSkills;
  const strong = gap.strongSkills;

  // =========================================================================
  // PHASE 1: 0–3 Months (Nền tảng & Xóa Lỗ hổng Cốt lõi)
  // =========================================================================
  let p1TargetSkills = highPriorityMissing.slice(0, 3);
  if (p1TargetSkills.length === 0) {
    p1TargetSkills = mediumPriorityMissing.slice(0, 3);
  }
  if (p1TargetSkills.length === 0) {
    p1TargetSkills = developing.slice(0, 3);
  }
  if (p1TargetSkills.length === 0) {
    // Student already possesses high mastery, target career foundational tools
    p1TargetSkills = career.requiredSkills.slice(0, 2).map(s => ({
      skill: s,
      userLevel: 'Strong' as const,
      priority: 'Low' as const,
      category: 'Technical' as const,
      recommendedAction: `Duy trì và ứng dụng nâng cao kỹ năng ${s} vào các bài toán thực tế.`
    }));
  }

  const p1ActionSteps = buildMilestoneStepsForSkills(p1TargetSkills, career, 'foundation');
  const p1Projects = [
    career.experiments?.[0]?.title || `Thực nghiệm nhập môn: Cài đặt và làm quen công cụ cho ${career.title}`,
    `Mini-project 1: Ứng dụng giải quyết bài toán nền tảng bằng ${p1TargetSkills[0]?.skill || 'kỹ năng cốt lõi'}`
  ];

  const phase1: RoadmapPhase = {
    phaseNumber: 1,
    name: 'Giai đoạn 1: Nền tảng & Bù đắp Lỗ hổng Cốt lõi',
    duration: '0–3 tháng',
    timeframe: '0–3 months',
    objectives: [
      `Làm chủ khái niệm và cú pháp cơ bản của các kỹ năng thiếu hụt ưu tiên cao: ${p1TargetSkills.map(s => s.skill).join(', ')}`,
      `Củng cố các môn học thế mạnh liên quan (${(career.relevantSubjects || []).slice(0, 2).join(', ')})`,
      `Hoàn thành bài tập nhỏ hàng tuần với cường độ ${hoursPerWeek} giờ/tuần`
    ],
    skillsToLearn: p1TargetSkills.map(s => s.skill),
    projects: p1Projects,
    recommendedActivities: [
      `Tham gia khóa học bài bản nhập môn (20–30 giờ) theo tài liệu chính thức`,
      `Lập nhóm học tập hoặc thảo luận với bạn bè có cùng định hướng ${career.title}`,
      `Ghi chép cẩm nang xử lý các lỗi thường gặp trong quá trình làm bài tập`
    ],
    milestone: `Vượt qua bài kiểm tra trắc nghiệm nền tảng và vận hành thành công mini-project đầu tay với ${p1TargetSkills.map(s => s.skill).join(', ')}.`,
    actionSteps: p1ActionSteps
  };

  // =========================================================================
  // PHASE 2: 3–6 Months (Nâng cao Năng lực Thực hành & Tích hợp)
  // =========================================================================
  let p2TargetSkills = [...developing, ...mediumPriorityMissing].slice(0, 3);
  if (p2TargetSkills.length === 0) {
    p2TargetSkills = career.technicalSkills.slice(0, 3).map(s => ({
      skill: s,
      userLevel: 'Developing' as const,
      priority: 'Medium' as const,
      category: 'Technical' as const,
      recommendedAction: `Thực hành chuyên sâu và làm bài tập nâng cao cho kỹ năng ${s}.`
    }));
  }

  const p2ActionSteps = buildMilestoneStepsForSkills(p2TargetSkills, career, 'intermediate');
  const p2Projects = [
    career.beginnerProjects?.[0] || `Dự án chuyên ngành: Xây dựng hệ thống giải pháp cho ${career.title}`,
    `Module nâng cao: Tối ưu hóa hiệu năng và viết kiểm thử tự động`
  ];

  const phase2: RoadmapPhase = {
    phaseNumber: 2,
    name: 'Giai đoạn 2: Nâng cao Thực hành & Tích hợp Kỹ năng',
    duration: '3–6 tháng',
    timeframe: '3–6 months',
    objectives: [
      `Nâng cấp mức độ thành thạo từ Developing lên Strong cho: ${p2TargetSkills.map(s => s.skill).join(', ')}`,
      `Tích hợp các kỹ năng đã học ở Giai đoạn 1 với công cụ chuyên sâu của ngành`,
      `Rèn luyện khả năng debug độc lập và viết tài liệu kỹ thuật chuẩn mực`
    ],
    skillsToLearn: p2TargetSkills.map(s => s.skill),
    projects: p2Projects,
    recommendedActivities: [
      `Tham gia cuộc thi học thuật, Game Jam, hoặc Hackathon dành cho học sinh/sinh viên`,
      `Thực hành theo các case study thực tế từ doanh nghiệp`,
      `Tham vấn ý kiến chuyên môn từ thầy cô hoặc cựu sinh viên ngành ${career.title}`
    ],
    milestone: `Hoàn thành sản phẩm trung cấp tích hợp đa kỹ năng, có kho lưu trữ GitHub/Portfolio được tài liệu hóa chi tiết.`,
    actionSteps: p2ActionSteps
  };

  // =========================================================================
  // PHASE 3: 6–12 Months (Dự án Chuyên nghiệp, Portfolio & Sẵn sàng Nghề nghiệp)
  // =========================================================================
  const p3TargetSkills = [...strong.slice(0, 2), ...career.softSkills.slice(0, 2).map(s => ({
    skill: s,
    userLevel: 'Developing' as const,
    priority: 'Medium' as const,
    category: 'Soft' as const
  }))];

  const p3ActionSteps = buildMilestoneStepsForSkills(p3TargetSkills, career, 'capstone');
  const p3Projects = [
    career.portfolioExamples?.[0] || `Dự án Capstone giải quyết bài toán thực tế toàn diện cho nghề ${career.title}`,
    `Hồ sơ năng lực cá nhân (Digital Portfolio) và video thuyết minh giải pháp`
  ];

  const phase3: RoadmapPhase = {
    phaseNumber: 3,
    name: 'Giai đoạn 3: Dự án Chuyên nghiệp & Hoàn thiện Portfolio',
    duration: '6–12 tháng',
    timeframe: '6–12 months',
    objectives: [
      `Xây dựng Capstone Project hoàn chỉnh mô phỏng chính xác nghiệp vụ thực tế của ${career.title}`,
      `Hoàn thiện bộ hồ sơ năng lực (Portfolio / GitHub) sẵn sàng nộp xét tuyển đại học hoặc ứng tuyển thực tập`,
      `Luyện tập kỹ năng phỏng vấn chuyên môn, thuyết trình và bảo vệ giải pháp trước hội đồng`
    ],
    skillsToLearn: [career.title, ...career.softSkills.slice(0, 2)],
    projects: p3Projects,
    recommendedActivities: [
      `Tham dự Ngày hội Tư vấn Tuyển sinh / Hướng nghiệp tại các trường đại học mục tiêu`,
      `Chuẩn bị bài luận cá nhân và thư giới thiệu làm nổi bật hành trình dự án`,
      `Kết nối với cộng đồng nghề nghiệp qua LinkedIn, diễn đàn công nghệ chuyên ngành`
    ],
    milestone: `Bộ hồ sơ năng lực cá nhân trực tuyến hoàn chỉnh với dự án demo trực tiếp, sẵn sàng cho kỳ tuyển sinh hoặc phỏng vấn tuyển dụng.`,
    actionSteps: p3ActionSteps
  };

  const phases = [phase1, phase2, phase3];

  // Tailored personal note summarizing the student's unique starting point
  let tailoredNote = '';
  if (gap.missingSkills.length > 0) {
    tailoredNote = `Lộ trình được cá nhân hóa theo Chỉ số sẵn sàng ${gap.overallReadiness}% của ${studentName}: Ưu tiên tập trung xóa bỏ ${gap.highPriorityCount} lỗ hổng kỹ năng cốt lõi (${gap.missingSkills.slice(0, 2).map(s => s.skill).join(', ')}) trong 0–3 tháng đầu, sau đó nâng cấp các kỹ năng thực hành và hoàn thiện Capstone Portfolio trong 12 tháng với tiến độ ${hoursPerWeek}h/tuần.`;
  } else {
    tailoredNote = `Lộ trình được cá nhân hóa theo Năng lực xuất sắc (${gap.overallReadiness}% sẵn sàng) của ${studentName}: Bạn đã có nền tảng vững vàng, lộ trình sẽ tập trung tối ưu hóa chiều sâu kỹ thuật, làm đồ án lớn và hoàn thiện Portfolio cạnh tranh học bổng / tuyển dụng trong 12 tháng với tiến độ ${hoursPerWeek}h/tuần.`;
  }

  return {
    careerId: career.id,
    careerTitle: career.title,
    targetAgeGroup: profile.ageGroup || '15-18',
    phases,
    tailoredNote
  };
}
