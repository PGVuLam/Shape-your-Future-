import { Career, UserProfile, RecommendationScore, ScoringWeights, ScoreBreakdown } from '../types';
import { CAREER_DATABASE } from '../data/careers';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  wRIASEC: 0.35,      // 35%
  wSkills: 0.25,      // 25%
  wInterests: 0.15,   // 15%
  wSubjects: 0.10,    // 10%
  wGoals: 0.05,       // 5%
  wPreferences: 0.05, // 5%
  wMBTI: 0.05         // 5% (Strictly secondary)
};

/**
 * Calculates cosine similarity between two 6-dimensional RIASEC vectors
 */
function calculateRIASECSimilarity(userScores: Record<string, number> | undefined, careerScores: Record<string, number> | undefined): number {
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dotProduct = 0;
  let userMagnitudeSq = 0;
  let careerMagnitudeSq = 0;

  for (const dim of dimensions) {
    const u = userScores?.[dim] || 0.1;
    const c = careerScores?.[dim] || 0.1;
    dotProduct += u * c;
    userMagnitudeSq += u * u;
    careerMagnitudeSq += c * c;
  }

  const denominator = Math.sqrt(userMagnitudeSq) * Math.sqrt(careerMagnitudeSq);
  if (denominator === 0) return 50;

  const cosine = dotProduct / denominator;
  // Map cosine (typically 0.3 to 1.0 in positive space) smoothly to 0-100
  return Math.min(100, Math.max(0, Math.round(cosine * 100)));
}

/**
 * Calculates skill compatibility accounting for skill levels
 */
function calculateSkillCompatibility(profile: UserProfile, career: Career): { score: number; missing: string[]; matched: string[] } {
  const allCareerSkills = [...(career.requiredSkills || []), ...(career.technicalSkills || [])];
  if (allCareerSkills.length === 0) return { score: 70, missing: [], matched: [] };

  const userSkillMap = new Map<string, number>();
  // Base skills list
  (profile.skills || []).forEach(s => {
    if (s) userSkillMap.set(s.toLowerCase(), 0.75);
  });

  // Self rated skills
  profile.selfRatedSkills?.forEach(s => {
    if (s?.skill) {
      const weight = s.level === 'Expert' ? 1.0 : s.level === 'Strong' ? 0.9 : s.level === 'Developing' ? 0.6 : 0.3;
      userSkillMap.set(s.skill.toLowerCase(), weight);
    }
  });

  let earnedPoints = 0;
  const missing: string[] = [];
  const matched: string[] = [];

  for (const reqSkill of career.requiredSkills) {
    const reqLower = reqSkill.toLowerCase();
    let found = false;
    for (const [uSkill, uWeight] of userSkillMap.entries()) {
      if (uSkill.includes(reqLower) || reqLower.includes(uSkill)) {
        earnedPoints += uWeight * 1.5; // Required skills weighted higher
        matched.push(reqSkill);
        found = true;
        break;
      }
    }
    if (!found) {
      missing.push(reqSkill);
    }
  }

  // Check technical skills
  for (const techSkill of career.technicalSkills) {
    const techLower = techSkill.toLowerCase();
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
 * Calculates interest overlap
 */
function calculateInterestCompatibility(userInterests: string[], careerInterests: string[]): { score: number; matched: string[] } {
  if (!userInterests || userInterests.length === 0) return { score: 50, matched: [] };
  const matched: string[] = [];

  for (const uInt of userInterests) {
    const uLower = uInt.toLowerCase();
    for (const cInt of careerInterests) {
      if (cInt.toLowerCase().includes(uLower) || uLower.includes(cInt.toLowerCase())) {
        if (!matched.includes(cInt)) matched.push(cInt);
      }
    }
  }

  const ratio = matched.length / Math.max(1, Math.min(4, careerInterests.length));
  const score = Math.min(100, Math.max(20, Math.round(ratio * 100)));
  return { score, matched };
}

/**
 * Calculates subject overlap
 */
function calculateSubjectCompatibility(userSubjects: string[], careerSubjects: string[]): { score: number; matched: string[] } {
  if (!userSubjects || userSubjects.length === 0) return { score: 50, matched: [] };
  const matched: string[] = [];

  for (const uSub of userSubjects) {
    const uLower = uSub.toLowerCase();
    for (const cSub of careerSubjects) {
      if (cSub.toLowerCase().includes(uLower) || uLower.includes(cSub.toLowerCase())) {
        if (!matched.includes(cSub)) matched.push(cSub);
      }
    }
  }

  const ratio = matched.length / Math.max(1, Math.min(3, careerSubjects.length));
  const score = Math.min(100, Math.max(15, Math.round(ratio * 100)));
  return { score, matched };
}

/**
 * Calculates goal and priority compatibility
 */
function calculateGoalCompatibility(priorities: string[], career: Career): number {
  if (!priorities || priorities.length === 0) return 60;
  let score = 50;

  for (const prio of priorities) {
    if (prio === 'High income' && (career.salaryInfo.levelIndicator === 'Very High' || career.salaryInfo.levelIndicator === 'High')) {
      score += 20;
    }
    if (prio === 'Intellectual Impact' && career.riaSecProfile.I >= 0.8) {
      score += 20;
    }
    if (prio === 'Social Purpose' && career.riaSecProfile.S >= 0.7) {
      score += 20;
    }
    if (prio === 'Creativity' && career.riaSecProfile.A >= 0.8) {
      score += 20;
    }
    if (prio === 'Work-life balance' && career.workStyle.toLowerCase().includes('balance')) {
      score += 15;
    }
  }

  return Math.min(100, Math.max(20, score));
}

/**
 * Calculates work preference compatibility (teamwork, remote, physical)
 */
function calculatePreferenceCompatibility(profile: UserProfile, career: Career): number {
  let score = 70;
  const prefs = profile.workPreferences;
  if (!prefs) return 70;

  if (prefs.remotePreference === 'Remote') {
    const hasRemote = career.workEnvironment.some(e => e.toLowerCase().includes('remote'));
    score += hasRemote ? 15 : -15;
  }

  if (prefs.handsOnVsAbstract === 'Hands-on') {
    score += career.riaSecProfile.R >= 0.6 ? 15 : -10;
  } else if (prefs.handsOnVsAbstract === 'Theoretical') {
    score += career.riaSecProfile.I >= 0.8 ? 15 : -10;
  }

  return Math.min(100, Math.max(25, score));
}

/**
 * Calculates supplementary MBTI compatibility (max 5-8% total weight impact)
 */
function calculateMBTICompatibility(userMbti: string | undefined, careerCompatibleMbti: string[]): number {
  if (!userMbti || careerCompatibleMbti.length === 0) return 60;

  const target = userMbti.toUpperCase().trim();
  if (careerCompatibleMbti.map(m => m.toUpperCase()).includes(target)) {
    return 95;
  }

  // Partial match: count shared letters
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
 * Deterministic recommendation engine function
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
    // 1. Subscores
    const riasecScore = calculateRIASECSimilarity(safeProfile.riaSecScores, career.riaSecProfile);
    const skillResult = calculateSkillCompatibility(safeProfile, career);
    const interestResult = calculateInterestCompatibility(safeProfile.interests, career.relevantInterests);
    const subjectResult = calculateSubjectCompatibility(safeProfile.favoriteSubjects, career.relevantSubjects);
    const goalScore = calculateGoalCompatibility(safeProfile.careerPriorities, career);
    const prefScore = calculatePreferenceCompatibility(safeProfile, career);
    const mbtiScore = calculateMBTICompatibility(safeProfile.mbtiType, career.mbtiCompatibility);

    const breakdown: ScoreBreakdown = {
      riasec: riasecScore,
      skills: skillResult.score,
      interests: interestResult.score,
      subjects: subjectResult.score,
      goals: goalScore,
      preferences: prefScore,
      mbti: mbtiScore
    };

    // 2. Weighted Sum
    const totalWeight =
      weights.wRIASEC +
      weights.wSkills +
      weights.wInterests +
      weights.wSubjects +
      weights.wGoals +
      weights.wPreferences +
      weights.wMBTI;

    const rawOverall =
      (breakdown.riasec * weights.wRIASEC +
        breakdown.skills * weights.wSkills +
        breakdown.interests * weights.wInterests +
        breakdown.subjects * weights.wSubjects +
        breakdown.goals * weights.wGoals +
        breakdown.preferences * weights.wPreferences +
        breakdown.mbti * weights.wMBTI) / (totalWeight || 1);

    const overallScore = Math.min(100, Math.max(10, Math.round(rawOverall)));

    // 3. Positive Contributors
    const positiveContributors: string[] = [];
    if (breakdown.riasec >= 80) {
      positiveContributors.push(`Strong RIASEC Holland alignment (score: ${breakdown.riasec}%)`);
    }
    if (interestResult.matched.length > 0) {
      positiveContributors.push(`Direct interest in ${interestResult.matched.slice(0, 2).join(', ')}`);
    }
    if (subjectResult.matched.length > 0) {
      positiveContributors.push(`Strong affinity for core subjects: ${subjectResult.matched.slice(0, 2).join(', ')}`);
    }
    if (skillResult.matched.length > 0) {
      positiveContributors.push(`Demonstrated proficiency in ${skillResult.matched.slice(0, 2).join(', ')}`);
    }
    if (breakdown.goals >= 80) {
      positiveContributors.push(`Matches career priorities (${profile.careerPriorities?.slice(0, 2).join(', ')})`);
    }

    // 4. Negative / Challenging Contributors
    const negativeContributors: string[] = [];
    if (skillResult.missing.length > 0) {
      negativeContributors.push(`Missing key required competencies: ${skillResult.missing.slice(0, 2).join(', ')}`);
    }
    if (breakdown.riasec < 60) {
      negativeContributors.push(`Divergent interest profile in daily work tasks`);
    }
    if (subjectResult.matched.length === 0 && career.relevantSubjects.length > 0) {
      negativeContributors.push(`No reported background in primary subject: ${career.relevantSubjects[0]}`);
    }

    // 5. Confidence Calculation
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let confidenceReason = 'Standard recommendation based on partial assessment inputs.';

    const completeness = profile.completenessPercentage || 60;
    const hasDetailedSkills = profile.selfRatedSkills && profile.selfRatedSkills.length >= 3;

    if (completeness >= 85 && hasDetailedSkills) {
      confidence = 'High';
      confidenceReason = 'High confidence: comprehensive RIASEC data, detailed self-rated skills, and subject preferences present.';
    } else if (completeness < 60 || !hasDetailedSkills) {
      confidence = 'Medium';
      confidenceReason = 'Moderate confidence: interest and RIASEC alignment is solid, but skill levels require deeper assessment.';
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
      rank: 0 // Assigned after sorting
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
