import { Career, UserProfile, RecommendationScore, ScoringWeights, ScoreBreakdown } from '../types';
import { CAREER_DATABASE } from '../data/careers';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  wRIASEC: 0.30,      // 30% - Thiên hướng sở thích tâm lý Holland
  wAcademic: 0.30,    // 30% - Năng lực học tập, điểm thi & môn thế mạnh
  wSkills: 0.25,      // 25% - Năng lực kỹ năng chuyên môn & kỹ năng mềm
  wMBTI: 0.05,        // 5%  - Phong cách làm việc bổ trợ MBTI (không quyết định tuyệt đối)
  wExpectation: 0.10, // 10% - Mục tiêu nghề nghiệp & môi trường làm việc kỳ vọng
  // Legacy weights for backwards compatibility
  wInterests: 0.10,
  wSubjects: 0.15,
  wGoals: 0.05,
  wPreferences: 0.05
};

/**
 * Calculates cosine similarity between two 6-dimensional RIASEC vectors (0 to 100)
 */
function calculateRIASECSimilarity(userScores: Record<string, number> | undefined, careerScores: Record<string, number> | undefined): number {
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dotProduct = 0;
  let userMagnitudeSq = 0;
  let careerMagnitudeSq = 0;

  for (const dim of dimensions) {
    const u = userScores?.[dim] !== undefined ? userScores[dim] : 0.2;
    const c = careerScores?.[dim] !== undefined ? careerScores[dim] : 0.2;
    dotProduct += u * c;
    userMagnitudeSq += u * u;
    careerMagnitudeSq += c * c;
  }

  const denominator = Math.sqrt(userMagnitudeSq) * Math.sqrt(careerMagnitudeSq);
  if (denominator === 0) return 50;

  const cosine = dotProduct / denominator;
  // Map cosine smoothly to 0-100 scale
  return Math.min(100, Math.max(10, Math.round(cosine * 100)));
}

/**
 * Calculates skill compatibility accounting for skill levels and required priority (0 to 100)
 */
function calculateSkillCompatibility(profile: UserProfile, career: Career): { score: number; missing: string[]; matched: string[] } {
  const allCareerSkills = [...(career.requiredSkills || []), ...(career.technicalSkills || [])];
  if (allCareerSkills.length === 0) return { score: 70, missing: [], matched: [] };

  const userSkillMap = new Map<string, number>();
  (profile.skills || []).forEach(s => {
    if (s) userSkillMap.set(s.toLowerCase().trim(), 0.75);
  });

  profile.selfRatedSkills?.forEach(s => {
    if (s?.skill) {
      const weight = s.level === 'Expert' ? 1.0 : s.level === 'Strong' ? 0.9 : s.level === 'Developing' ? 0.6 : 0.35;
      userSkillMap.set(s.skill.toLowerCase().trim(), weight);
    }
  });

  let earnedPoints = 0;
  const missing: string[] = [];
  const matched: string[] = [];

  for (const reqSkill of career.requiredSkills) {
    const reqLower = reqSkill.toLowerCase().trim();
    let found = false;
    for (const [uSkill, uWeight] of userSkillMap.entries()) {
      if (uSkill.includes(reqLower) || reqLower.includes(uSkill)) {
        earnedPoints += uWeight * 1.5;
        matched.push(reqSkill);
        found = true;
        break;
      }
    }
    if (!found) {
      missing.push(reqSkill);
    }
  }

  for (const techSkill of career.technicalSkills) {
    const techLower = techSkill.toLowerCase().trim();
    let found = false;
    for (const [uSkill, uWeight] of userSkillMap.entries()) {
      if (uSkill.includes(techLower) || techLower.includes(uSkill)) {
        earnedPoints += uWeight;
        if (!matched.includes(techSkill)) matched.push(techSkill);
        found = true;
        break;
      }
    }
    if (!found && !missing.includes(techSkill)) {
      missing.push(techSkill);
    }
  }

  const maxPoints = (career.requiredSkills.length * 1.5) + career.technicalSkills.length;
  const rawRatio = maxPoints > 0 ? earnedPoints / maxPoints : 0.5;
  const normalizedScore = Math.min(100, Math.max(15, Math.round(rawRatio * 100)));

  return { score: normalizedScore, missing, matched };
}

/**
 * Calculates subject alignment (0 to 100)
 */
function calculateSubjectCompatibility(
  userSubjects: string[],
  careerSubjects: string[],
  confidentSubjects?: string[]
): { score: number; matched: string[] } {
  if (!userSubjects || userSubjects.length === 0) return { score: 50, matched: [] };
  const matched: string[] = [];

  for (const uSub of userSubjects) {
    const uLower = uSub.toLowerCase().trim();
    for (const cSub of careerSubjects) {
      const cLower = cSub.toLowerCase().trim();
      if (cLower.includes(uLower) || uLower.includes(cLower)) {
        if (!matched.includes(cSub)) matched.push(cSub);
      }
    }
  }

  let bonus = 0;
  if (confidentSubjects && confidentSubjects.length > 0) {
    for (const cSub of confidentSubjects) {
      const cLower = cSub.toLowerCase().trim();
      for (const carSub of careerSubjects) {
        if (carSub.toLowerCase().trim().includes(cLower)) {
          bonus += 10;
          break;
        }
      }
    }
  }

  const ratio = matched.length / Math.max(1, Math.min(3, careerSubjects.length));
  const score = Math.min(100, Math.max(20, Math.round(ratio * 85 + bonus)));
  return { score, matched };
}

/**
 * Calculates academic score (0 to 100): Combines subjects affinity + GPA + standardized test scores
 */
function calculateAcademicMatch(profile: UserProfile, career: Career): { score: number; subjectResult: { score: number; matched: string[] } } {
  const subjectResult = calculateSubjectCompatibility(
    profile.favoriteSubjects || [],
    career.relevantSubjects || [],
    profile.confidentSubjects || []
  );

  let gpaScore = 70; // baseline moderate
  let hasGpa = false;

  if (profile.academicGPA) {
    hasGpa = true;
    const gpaStr = profile.academicGPA.toLowerCase();
    if (gpaStr.includes('xuất sắc') || gpaStr.includes('giỏi') || gpaStr.includes('>8.0') || gpaStr.includes('9.')) {
      gpaScore = 92;
    } else if (gpaStr.includes('khá') || gpaStr.includes('6.5') || gpaStr.includes('7.')) {
      gpaScore = 76;
    } else if (gpaStr.includes('trung bình') || gpaStr.includes('5.')) {
      gpaScore = 58;
    } else {
      const num = parseFloat(gpaStr.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        if (num <= 10) gpaScore = Math.min(100, Math.max(30, Math.round(num * 10)));
        else if (num <= 4.0) gpaScore = Math.min(100, Math.max(30, Math.round((num / 4.0) * 100)));
      }
    }
  }

  // Check standardized exam scores if available
  let examScore = 0;
  let examCount = 0;
  const exams = profile.examScores;

  if (exams) {
    if (exams.thptScore && exams.thptScore > 0) {
      examScore += Math.min(100, Math.round((exams.thptScore / 30) * 100));
      examCount++;
    }
    if (exams.hsaScore && exams.hsaScore > 0) {
      examScore += Math.min(100, Math.round((exams.hsaScore / 150) * 100));
      examCount++;
    }
    if (exams.tsaScore && exams.tsaScore > 0) {
      examScore += Math.min(100, Math.round(exams.tsaScore));
      examCount++;
    }
    if (exams.vactScore && exams.vactScore > 0) {
      examScore += Math.min(100, Math.round((exams.vactScore / 1200) * 100));
      examCount++;
    }
  }

  let finalAcademic = subjectResult.score;

  if (hasGpa && examCount > 0) {
    const avgExam = Math.round(examScore / examCount);
    finalAcademic = Math.round(subjectResult.score * 0.45 + gpaScore * 0.25 + avgExam * 0.30);
  } else if (hasGpa) {
    finalAcademic = Math.round(subjectResult.score * 0.60 + gpaScore * 0.40);
  } else if (examCount > 0) {
    const avgExam = Math.round(examScore / examCount);
    finalAcademic = Math.round(subjectResult.score * 0.55 + avgExam * 0.45);
  }

  return {
    score: Math.min(100, Math.max(15, finalAcademic)),
    subjectResult
  };
}

/**
 * Calculates career goals & priorities compatibility (0 to 100)
 */
function calculateGoalCompatibility(priorities: string[], career: Career): number {
  if (!priorities || priorities.length === 0) return 60;
  let score = 50;

  for (const prio of priorities) {
    const p = prio.toLowerCase();
    if ((p.includes('thu nhập') || p.includes('tiền') || p.includes('income')) &&
        (career.salaryInfo.levelIndicator === 'Very High' || career.salaryInfo.levelIndicator === 'High')) {
      score += 20;
    }
    if ((p.includes('tri thức') || p.includes('nghiên cứu') || p.includes('intellectual')) &&
        career.riaSecProfile.I >= 0.7) {
      score += 20;
    }
    if ((p.includes('xã hội') || p.includes('giúp đỡ') || p.includes('social')) &&
        career.riaSecProfile.S >= 0.7) {
      score += 20;
    }
    if ((p.includes('sáng tạo') || p.includes('nghệ thuật') || p.includes('creativity')) &&
        career.riaSecProfile.A >= 0.7) {
      score += 20;
    }
    if ((p.includes('ổn định') || p.includes('cân bằng') || p.includes('balance')) &&
        career.workStyle.toLowerCase().includes('balance')) {
      score += 15;
    }
  }

  return Math.min(100, Math.max(20, score));
}

/**
 * Calculates work preference compatibility (teamwork, remote, physical) (0 to 100)
 */
function calculatePreferenceCompatibility(profile: UserProfile, career: Career): number {
  let score = 70;
  const prefs = profile.workPreferences;
  if (!prefs) return 70;

  if (prefs.remotePreference === 'Remote') {
    const hasRemote = career.workEnvironment.some(e => e.toLowerCase().includes('remote') || e.toLowerCase().includes('linh hoạt'));
    score += hasRemote ? 15 : -10;
  }

  if (prefs.handsOnVsAbstract === 'Hands-on') {
    score += career.riaSecProfile.R >= 0.6 ? 15 : -10;
  } else if (prefs.handsOnVsAbstract === 'Theoretical') {
    score += career.riaSecProfile.I >= 0.7 ? 15 : -10;
  }

  return Math.min(100, Math.max(25, score));
}

/**
 * Calculates supplementary MBTI compatibility (0 to 100).
 * Weighted at 5% in overall formula: strictly supplementary, not absolute.
 */
function calculateMBTICompatibility(userMbti: string | undefined, careerCompatibleMbti: string[]): number {
  if (!userMbti || careerCompatibleMbti.length === 0) return 60;

  const target = userMbti.toUpperCase().trim();
  if (careerCompatibleMbti.map(m => m.toUpperCase()).includes(target)) {
    return 95;
  }

  let maxMatchLetters = 0;
  for (const cType of careerCompatibleMbti) {
    let matchCount = 0;
    for (let i = 0; i < Math.min(4, target.length); i++) {
      if (target[i] === cType[i]) matchCount++;
    }
    if (matchCount > maxMatchLetters) maxMatchLetters = matchCount;
  }

  if (maxMatchLetters === 3) return 75;
  if (maxMatchLetters === 2) return 50;
  return 35;
}

/**
 * Deterministic recommendation engine function with the 30/30/25/5/10 formula:
 * Overall Career Score =
 *   0.30 × RIASEC Match
 * + 0.30 × Academic Match
 * + 0.25 × Skill Match
 * + 0.05 × MBTI Match
 * + 0.10 × Expectation Match
 */
export function generateRecommendations(
  profile: UserProfile,
  careers: Career[] = CAREER_DATABASE,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): RecommendationScore[] {
  if (!profile || !careers || careers.length === 0) {
    return [];
  }

  const safeProfile: UserProfile = {
    ...profile,
    riaSecScores: profile.riaSecScores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
    favoriteSubjects: profile.favoriteSubjects || [],
    confidentSubjects: profile.confidentSubjects || [],
    interests: profile.interests || [],
    skills: profile.skills || [],
    careerPriorities: profile.careerPriorities || [],
    workPreferences: profile.workPreferences || {
      teamworkVsSolo: 'Balanced',
      handsOnVsAbstract: 'Balanced',
      remotePreference: 'Any',
      creativityVsStructure: 'Balanced'
    }
  };

  const scoredCareers: RecommendationScore[] = careers.map(career => {
    // 1. Five normalized sub-scores (0-100 each)
    const riasecScore = calculateRIASECSimilarity(safeProfile.riaSecScores, career.riaSecProfile);
    const academicResult = calculateAcademicMatch(safeProfile, career);
    const skillResult = calculateSkillCompatibility(safeProfile, career);
    const mbtiScore = calculateMBTICompatibility(safeProfile.mbtiType, career.mbtiCompatibility);

    const goalScore = calculateGoalCompatibility(safeProfile.careerPriorities, career);
    const prefScore = calculatePreferenceCompatibility(safeProfile, career);
    const expectationScore = Math.round(goalScore * 0.5 + prefScore * 0.5);

    // Breakdown object
    const breakdown: ScoreBreakdown = {
      riasec: riasecScore,
      academic: academicResult.score,
      skills: skillResult.score,
      mbti: mbtiScore,
      expectation: expectationScore,
      // Backwards compatibility
      interests: riasecScore,
      subjects: academicResult.score,
      goals: goalScore,
      preferences: prefScore
    };

    // 2. Strict 30/30/25/5/10 Weighted Sum
    const wRIASEC = weights.wRIASEC ?? 0.30;
    const wAcademic = weights.wAcademic ?? 0.30;
    const wSkills = weights.wSkills ?? 0.25;
    const wMBTI = weights.wMBTI ?? 0.05;
    const wExpectation = weights.wExpectation ?? 0.10;

    const totalWeight = wRIASEC + wAcademic + wSkills + wMBTI + wExpectation;

    const rawOverall =
      (breakdown.riasec * wRIASEC +
        breakdown.academic * wAcademic +
        breakdown.skills * wSkills +
        breakdown.mbti * wMBTI +
        breakdown.expectation * wExpectation) / (totalWeight || 1);

    const overallScore = Math.min(100, Math.max(10, Math.round(rawOverall)));

    // 3. Positive Contributors in Vietnamese
    const positiveContributors: string[] = [];
    if (breakdown.riasec >= 80) {
      positiveContributors.push(`Sở thích Holland rất tương thích với tính chất ngành (${breakdown.riasec}%)`);
    }
    if (breakdown.academic >= 75) {
      positiveContributors.push(`Năng lực học tập & môn thế mạnh đáp ứng tốt (${breakdown.academic}%)`);
    }
    if (academicResult.subjectResult.matched.length > 0) {
      positiveContributors.push(`Môn học sở trường phù hợp: ${academicResult.subjectResult.matched.slice(0, 2).join(', ')}`);
    }
    if (skillResult.matched.length > 0) {
      positiveContributors.push(`Đã có nền tảng kỹ năng: ${skillResult.matched.slice(0, 2).join(', ')}`);
    }
    if (breakdown.expectation >= 75) {
      positiveContributors.push(`Phù hợp với kỳ vọng nghề nghiệp và môi trường làm việc`);
    }
    if (breakdown.mbti >= 80 && safeProfile.mbtiType) {
      positiveContributors.push(`Phong cách làm việc MBTI (${safeProfile.mbtiType}) hòa hợp tự nhiên`);
    }

    // 4. Negative / Improvement Contributors in Vietnamese
    const negativeContributors: string[] = [];
    if (skillResult.missing.length > 0) {
      negativeContributors.push(`Cần bồi dưỡng bổ sung: ${skillResult.missing.slice(0, 2).join(', ')}`);
    }
    if (breakdown.riasec < 55) {
      negativeContributors.push(`Sở thích tự nhiên có độ phân tán so với công việc thực tế`);
    }
    if (breakdown.academic < 60 && career.relevantSubjects.length > 0) {
      negativeContributors.push(`Cần chú trọng nâng cao học lực môn: ${career.relevantSubjects.slice(0, 2).join(', ')}`);
    }

    // 5. Educational Pathway Guidance (Đại học không phải là con đường duy nhất)
    let recommendedPathway: 'University' | 'VocationalCollege' | 'CertificationAndWork' | 'Flexible' = 'University';
    let pathwayAdvice = 'Phù hợp với lộ trình Đại học chính quy kết hợp thực tập chuyên sâu.';

    const isPracticalOriented = (safeProfile.riaSecScores?.R || 0) >= 0.5 || safeProfile.workPreferences?.handsOnVsAbstract === 'Hands-on';
    const isAcademicModerate = breakdown.academic < 70;

    if (isPracticalOriented && isAcademicModerate) {
      recommendedPathway = 'VocationalCollege';
      pathwayAdvice = 'Đại học không phải là con đường duy nhất. Chương trình Cao đẳng Nghề chất lượng cao (2 - 2.5 năm) tập trung 70% thực hành thực chiến sẽ giúp bạn đi làm sớm, tiết kiệm chi phí và phát triển kỹ năng nhanh chóng.';
    } else if (isAcademicModerate) {
      recommendedPathway = 'Flexible';
      pathwayAdvice = 'Nên cân nhắc song song giữa Đại học ứng dụng hoặc Cao đẳng chuyên ngành chất lượng cao để đảm bảo cơ hội việc làm thực tế vững vàng.';
    } else if (isPracticalOriented) {
      recommendedPathway = 'CertificationAndWork';
      pathwayAdvice = 'Lộ trình phát triển mạnh mẽ qua chứng chỉ nghề chuyên sâu kết hợp dự án thực tế và đồ án cá nhân (portfolio).';
    }

    // 6. Confidence Calculation
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let confidenceReason = 'Khuyến nghị tiêu chuẩn dựa trên thông tin đánh giá ban đầu.';

    const completeness = profile.completenessPercentage || 60;
    const hasDetailedSkills = profile.selfRatedSkills && profile.selfRatedSkills.length >= 3;

    if (completeness >= 80 && hasDetailedSkills) {
      confidence = 'High';
      confidenceReason = 'Độ tin cậy cao: Đầy đủ dữ liệu RIASEC, kỹ năng tự đánh giá và môn học thế mạnh.';
    } else if (completeness < 55 || !hasDetailedSkills) {
      confidence = 'Medium';
      confidenceReason = 'Độ tin cậy trung bình: Dữ liệu sở thích tốt nhưng cần bổ sung mức độ kỹ năng thực tế.';
    }

    return {
      careerId: career.id,
      career,
      overallScore,
      confidence,
      confidenceReason,
      breakdown,
      positiveContributors,
      negativeContributors,
      missingSkills: skillResult.missing,
      rank: 0,
      recommendedPathway,
      pathwayAdvice
    };
  });

  // Sort descending by overallScore
  scoredCareers.sort((a, b) => b.overallScore - a.overallScore);

  // Assign ranks
  scoredCareers.forEach((item, index) => {
    item.rank = index + 1;
  });

  return scoredCareers;
}
