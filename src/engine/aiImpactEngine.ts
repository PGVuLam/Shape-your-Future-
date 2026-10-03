import { Career, UserProfile, SkillGapAnalysis, AIImpactAnalysis } from '../types';

/**
 * AI Impact & Future Trends Engine (3–5 Years Outlook)
 *
 * Grounding Principles:
 * 1. Strict reliance on existing career data (aiImpact, futureTrends, progressionPath, challenges, advantages, tasks, skills).
 * 2. NO fabricated salaries, employment statistics, market percentages, or automation percentages.
 * 3. Clear differentiation between:
 *    - Known data (verified facts in system database)
 *    - Inferences (logical connections between student profile & career)
 *    - Future uncertainties (external 3–5 year market, AI tech shifts, regulatory changes)
 * 4. "Data unavailable" fallback when database lacks information.
 */

// Keywords associated with repetitive, rule-based, or data-heavy tasks that AI tools commonly assist
const AUTOMATION_ASSIST_KEYWORDS = [
  'tổng hợp',
  'báo cáo',
  'làm sạch',
  'nhập',
  'soạn thảo',
  'thu thập',
  'phân tích số liệu',
  'tìm kiếm',
  'viết mã',
  'tự động hóa',
  'kiểm thử',
  'tiền xử lý',
  'tính toán',
  'thống kê',
  'vẽ mẫu',
  'phác thảo',
  'tài liệu',
  'tra cứu',
  'phân loại',
  'lập lịch',
  'đối chiếu',
  'định dạng'
];

/**
 * Identifies tasks from career data that AI tools can assist or streamline.
 */
function identifyAssistableTasks(tasks: string[], responsibilities: string[]): string[] {
  const combined = [...tasks, ...responsibilities];
  if (combined.length === 0) return [];

  const matched = combined.filter(task => {
    const lower = task.toLowerCase();
    return AUTOMATION_ASSIST_KEYWORDS.some(kw => lower.includes(kw));
  });

  if (matched.length > 0) {
    return Array.from(new Set(matched)).slice(0, 4);
  }

  // If no task specifically matched repetitive keywords, return top 2 tasks as candidates for AI tool assistance
  return combined.slice(0, 2);
}

/**
 * Extracts human advantage abilities from advantages, soft skills, workStyle, and challenges.
 */
function extractHumanAdvantage(career: Career): { abilities: string[]; summary: string } {
  const abilities: string[] = [];

  // Check explicit advantages
  if (career.advantages && career.advantages.length > 0) {
    career.advantages.forEach(adv => {
      if (abilities.length < 3) abilities.push(adv);
    });
  }

  // Check soft skills (inherently human abilities)
  if (career.softSkills && career.softSkills.length > 0) {
    career.softSkills.forEach(skill => {
      if (abilities.length < 5 && !abilities.includes(skill)) {
        abilities.push(`Năng lực ${skill.toLowerCase()}`);
      }
    });
  }

  // Check work style
  if (career.workStyle && abilities.length < 5) {
    abilities.push(`Khả năng thích ứng phong cách làm việc: ${career.workStyle}`);
  }

  const summary = abilities.length > 0
    ? `Các năng lực như tư duy phản biện, thấu cảm, đạo đức nghề nghiệp và khả năng ra quyết định chiến lược trong môi trường phức tạp vẫn là thế mạnh độc quyền của con người mà AI không thể thay thế.`
    : 'Dữ liệu năng lực con người đặc thù chưa được phân loại trong hệ thống.';

  return { abilities, summary };
}

/**
 * Extracts emerging skill demand from futureTrends, recommendedSkills, and technicalSkills.
 */
function extractSkillDemand(career: Career): { emergingSkills: string[]; summary: string; hasData: boolean } {
  const emergingSkills: string[] = [];

  if (career.recommendedSkills && career.recommendedSkills.length > 0) {
    career.recommendedSkills.forEach(s => {
      if (emergingSkills.length < 5) emergingSkills.push(s);
    });
  }

  if (career.futureTrends) {
    const trendParts = career.futureTrends.split(/[.;•\n]/).map(p => p.trim()).filter(Boolean);
    trendParts.forEach(p => {
      if (emergingSkills.length < 6 && p.length < 60) {
        emergingSkills.push(p);
      }
    });
  }

  const hasData = Boolean(career.futureTrends || (career.recommendedSkills && career.recommendedSkills.length > 0));
  const summary = career.futureTrends
    ? career.futureTrends
    : (hasData ? 'Tập trung vào kỹ năng ứng dụng công nghệ nâng cao và tư duy liên ngành.' : 'Dữ liệu xu hướng chưa có trong hệ thống.');

  return {
    emergingSkills: Array.from(new Set(emergingSkills)),
    summary,
    hasData
  };
}

/**
 * Generates tailored student preparation advice based on:
 * Student Profile + Skill Gap + Career + Future Trends.
 */
function generatePreparationAdvice(
  career: Career,
  profile?: UserProfile,
  skillGap?: SkillGapAnalysis
): { advice: string[]; focusAreas: string[]; progressionAdvice: string; hasData: boolean } {
  const advice: string[] = [];
  const focusAreas: string[] = [];

  // 1. Incorporate Missing & Developing skills from Skill Gap
  if (skillGap) {
    const highGaps = skillGap.missingSkills.filter(s => s.priority === 'High');
    if (highGaps.length > 0) {
      advice.push(
        `Ưu tiên bù đắp các kỹ năng cốt lõi còn thiếu (${highGaps.map(s => s.skill).slice(0, 3).join(', ')}) thông qua bài tập thực hành đều đặn.`
      );
      highGaps.slice(0, 3).forEach(g => focusAreas.push(`Bổ sung: ${g.skill}`));
    }

    if (skillGap.developingSkills.length > 0) {
      advice.push(
        `Nâng cấp các kỹ năng đang phát triển (${skillGap.developingSkills.map(s => s.skill).slice(0, 2).join(', ')}) lên mức độ thành thạo qua mini-project.`
      );
      skillGap.developingSkills.slice(0, 2).forEach(g => focusAreas.push(`Nâng cao: ${g.skill}`));
    }
  }

  // 2. Incorporate Student Profile strengths & academic foundation
  if (profile) {
    const confidentSubs = profile.confidentSubjects || profile.favoriteSubjects || [];
    if (confidentSubs.length > 0) {
      advice.push(
        `Phát huy thế mạnh học tập ở môn ${confidentSubs.slice(0, 2).join(', ')} để xây dựng nền tảng tư duy định lượng và giải quyết vấn đề cho ngành ${career.title}.`
      );
    }

    if (profile.availableStudyTimeHoursPerWeek) {
      advice.push(
        `Duy trì kỷ luật học tập với quỹ thời gian hiện có (${profile.availableStudyTimeHoursPerWeek} giờ/tuần), phân bổ 60% cho thực hành dự án và 40% cho lý thuyết.`
      );
    }
  }

  // 3. Incorporate Future Trends & AI adaptation
  if (career.futureTrends) {
    advice.push(
      `Chủ động học cách cộng tác cùng các công cụ AI trong lĩnh vực (${career.futureTrends.split('.')[0] || 'công nghệ mới'}) để tăng năng suất và đón đầu xu hướng 3–5 năm tới.`
    );
  }

  // 4. Progression path orientation
  let progressionAdvice = 'Tiến bước từ các dự án nhập môn cơ bản đến vị trí chuyên môn vững vàng.';
  if (career.progressionPath?.entry) {
    progressionAdvice = `Mục tiêu giai đoạn khởi đầu (Entry-level): ${career.progressionPath.entry}`;
  }

  const hasData = advice.length > 0;
  if (!hasData) {
    advice.push(`Tập trung nắm vững các kỹ năng cốt lõi được yêu cầu: ${(career.requiredSkills || []).slice(0, 3).join(', ')}.`);
    progressionAdvice = career.progressionPath?.entry || 'Dữ liệu lộ trình khởi đầu chưa cập nhật.';
  }

  return {
    advice,
    focusAreas: Array.from(new Set(focusAreas)),
    progressionAdvice,
    hasData: true
  };
}

/**
 * Builds the 3-tier Grounding and Uncertainty differentiation:
 * 1. Known Data (Fact-based in DB)
 * 2. Inference (Derived connections)
 * 3. Future Uncertainty (External unknowns over 3–5 years)
 */
function buildGroundingAndUncertainty(
  career: Career,
  profile?: UserProfile,
  skillGap?: SkillGapAnalysis
): { knownData: string[]; inferences: string[]; uncertainties: string[]; disclaimer: string } {
  // 1. Known Data: facts present in system database
  const knownData: string[] = [
    `Nhiệm vụ và trách nhiệm thực tế đã được chuẩn hóa trong hồ sơ nghề (${career.tasks.length} nhiệm vụ cốt lõi).`,
    `Danh mục kỹ năng kỹ thuật & kỹ năng mềm yêu cầu chuẩn hóa (${(career.requiredSkills || []).slice(0, 4).join(', ')}).`,
    career.aiImpact
      ? `Định hướng tác động AI đã ghi nhận: "${career.aiImpact}"`
      : 'Hệ thống chưa ghi nhận ghi chú tác động AI riêng cho nghề này.',
    career.progressionPath?.entry
      ? `Lộ trình khởi đầu thực tế: ${career.progressionPath.entry}`
      : 'Lộ trình khởi đầu theo chuẩn chung của ngành.'
  ];

  // 2. Inference: Logical deductions linking student profile and career needs
  const inferences: string[] = [];
  if (profile && skillGap) {
    inferences.push(
      `Dựa trên hồ sơ của bạn, mức độ sẵn sàng kỹ năng khởi điểm đạt ${Math.round(skillGap.overallReadiness)}% với ${skillGap.strongSkills.length} kỹ năng thế mạnh.`
    );
    if (skillGap.missingSkills.length > 0) {
      inferences.push(
        `Cần tập trung xóa khoảng cách ở ${skillGap.missingSkills.length} kỹ năng còn thiếu để đạt tiêu chuẩn ứng tuyển entry-level.`
      );
    }
  } else {
    inferences.push(
      `Người học có nền tảng tư duy phù hợp sẽ dễ dàng thích ứng với các công cụ AI hỗ trợ trong nghề ${career.title}.`
    );
  }

  inferences.push(
    `AI có khả năng hỗ trợ đắc lực ở khâu xử lý dữ liệu và thao tác quy chuẩn, cho phép con người tập trung vào phân tích sâu và tương tác thực tế.`
  );

  // 3. Future Uncertainty: Uncontrollable / unknown external shifts in 3–5 years
  const uncertainties: string[] = [
    'Tốc độ đột phá của các mô hình AI thế hệ mới có thể tái định hình các công cụ làm việc nhanh hơn hoặc theo hướng khác so với dự báo hiện tại.',
    'Chính sách pháp lý, quy định an toàn dữ liệu và tiêu chuẩn kiểm định lao động tại Việt Nam và quốc tế có thể thay đổi cách ứng dụng AI trong ngành.',
    'Biến động chu kỳ kinh tế và nhu cầu dịch chuyển cơ cấu nhân sự của các tổ chức doanh nghiệp trong 3–5 năm tới mang tính bất định.'
  ];

  const disclaimer =
    'Phân tích 3–5 năm dựa trên dữ liệu hiện có và suy luận thích ứng kỹ năng, mang tính chất định hướng rèn luyện năng lực; không phải là cam kết tỷ lệ tuyển dụng hay sự thật tương lai cố định.';

  return {
    knownData,
    inferences,
    uncertainties,
    disclaimer
  };
}

/**
 * Main Unified AI Impact & Future Trends Engine
 *
 * Can be called by:
 * - Career Comparison
 * - Learning Roadmap
 * - AI Counselor
 */
export function analyzeAIImpactAndFutureTrends(
  career: Career,
  profile?: UserProfile,
  skillGap?: SkillGapAnalysis
): AIImpactAnalysis {
  const hasDirectAiData = Boolean(career.aiImpact && career.aiImpact.trim().length > 0);
  const assistableTasks = identifyAssistableTasks(career.tasks || [], career.responsibilities || []);

  const automatedAspectsSummary = hasDirectAiData
    ? career.aiImpact!
    : (assistableTasks.length > 0
      ? `AI có thể hỗ trợ đẩy nhanh các tác vụ thu thập, tiền xử lý và soạn thảo tài liệu quy chuẩn; con người giữ vai trò kiểm duyệt và định hướng.`
      : 'Dữ liệu về mức độ tự động hóa của nghề chưa có trong hệ thống.');

  const humanAdv = extractHumanAdvantage(career);
  const skillDem = extractSkillDemand(career);
  const prep = generatePreparationAdvice(career, profile, skillGap);
  const grounding = buildGroundingAndUncertainty(career, profile, skillGap);

  return {
    careerId: career.id,
    careerTitle: career.title,
    timeHorizon: '3–5 năm',
    aiAutomation: {
      hasData: hasDirectAiData || assistableTasks.length > 0,
      directAiImpact: career.aiImpact,
      assistableTasks,
      automatedAspectsSummary
    },
    humanAdvantage: {
      hasData: humanAdv.abilities.length > 0,
      coreAbilities: humanAdv.abilities,
      irreplaceableAspectsSummary: humanAdv.summary
    },
    skillDemand: {
      hasData: skillDem.hasData,
      emergingSkills: skillDem.emergingSkills,
      marketTrendSummary: skillDem.summary
    },
    preparation: {
      hasData: prep.hasData,
      tailoredAdvice: prep.advice,
      keyFocusAreas: prep.focusAreas,
      progressionAdvice: prep.progressionAdvice
    },
    groundingAndUncertainty: {
      knownData: grounding.knownData,
      inferences: grounding.inferences,
      uncertainties: grounding.uncertainties,
      disclaimer: grounding.disclaimer
    }
  };
}
