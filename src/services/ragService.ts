import { Career, UserProfile, RecommendationScore, SkillGapAnalysis } from '../types';
import { analyzeSkillGap } from '../engine/skillGapEngine';

export interface RetrievedCareerContext {
  careerId: string;
  careerTitle: string;
  cluster: string;
  tasks: string[];
  requiredSkills: string[];
  userMatchedSkills: string[];
  userMissingSkills: string[];
  educationPaths: string[];
  experiments: string[];
  salaryLevel: string;
  riasecFitSummary: string;
  profileContext: {
    age: number;
    ageGroup: string;
    educationLevel: string;
    favoriteSubjects: string[];
    userInterests: string[];
    riasecCode: string;
    careerPriorities: string[];
    mbtiType?: string;
  };
}

/**
 * Retrieves and formats structured grounding context from Career Knowledge Base & Profile
 */
export function retrieveContextForCareer(
  profile: UserProfile,
  career: Career,
  recScore?: RecommendationScore
): RetrievedCareerContext {
  const gap: SkillGapAnalysis = analyzeSkillGap(profile, career);

  const matchedSkills = [
    ...gap.strongSkills.map(s => `${s.skill} (Strong)`),
    ...gap.developingSkills.map(s => `${s.skill} (Developing)`)
  ];

  const missingSkills = gap.missingSkills.map(s => `${s.skill} (Missing - ${s.priority} Priority)`);

  const educationPathSummaries = career.educationPaths.map(
    p => `${p.type}: ${p.duration} — ${p.description} (Trade-offs: ${p.tradeoffs})`
  );

  const experimentSummaries = career.experiments.map(
    e => `${e.title} (${e.duration}): ${e.description}`
  );

  const riasecFit = recScore
    ? `Holland RIASEC Match: ${recScore.breakdown.riasec}%. Top positive signals: ${recScore.positiveContributors.join('; ')}`
    : `Career RIASEC: R=${career.riaSecProfile.R}, I=${career.riaSecProfile.I}, A=${career.riaSecProfile.A}, S=${career.riaSecProfile.S}, E=${career.riaSecProfile.E}, C=${career.riaSecProfile.C}`;

  return {
    careerId: career.id,
    careerTitle: career.title,
    cluster: career.careerCluster,
    tasks: career.tasks,
    requiredSkills: career.requiredSkills,
    userMatchedSkills: matchedSkills,
    userMissingSkills: missingSkills,
    educationPaths: educationPathSummaries,
    experiments: experimentSummaries,
    salaryLevel: `${career.salaryInfo.levelIndicator} (${career.salaryInfo.disclaimer})`,
    riasecFitSummary: riasecFit,
    profileContext: {
      age: profile.age,
      ageGroup: profile.ageGroup,
      educationLevel: profile.educationLevel,
      favoriteSubjects: profile.favoriteSubjects || [],
      userInterests: profile.interests || [],
      riasecCode: profile.riaSecProfile?.code || 'N/A',
      careerPriorities: profile.careerPriorities || [],
      mbtiType: profile.mbtiType
    }
  };
}

/**
 * Builds a strict grounded prompt preventing hallucination and enforcing scientific neutrality
 */
export function buildCounselorPrompt(
  context: RetrievedCareerContext,
  userQuestion: string,
  chatHistory: Array<{ role: string; content: string }>
): string {
  return `You are the EduPath AI Career Exploration Counselor, a supportive, scientifically grounded educational guide for students and lifelong learners.

=== GROUNDED FACTUAL CAREER CONTEXT (FROM KNOWLEDGE BASE) ===
Career: ${context.careerTitle} (${context.cluster})
Tasks: ${context.tasks.slice(0, 4).join('; ')}
Required Competencies: ${context.requiredSkills.join(', ')}
User's Matched Skills: ${context.userMatchedSkills.length > 0 ? context.userMatchedSkills.join(', ') : 'None documented yet'}
User's Critical Missing Skills: ${context.userMissingSkills.length > 0 ? context.userMissingSkills.join(', ') : 'No gaps identified'}
Educational Pathways: ${context.educationPaths.join(' | ')}
Career Experiments ("Try before you decide"): ${context.experiments.join(' | ')}
Salary Benchmark: ${context.salaryLevel}
RIASEC Holland Fit: ${context.riasecFitSummary}

=== STUDENT / USER PROFILE ===
Age: ${context.profileContext.age} (Cohort: ${context.profileContext.ageGroup})
Education Level: ${context.profileContext.educationLevel}
Subjects Enjoyed: ${context.profileContext.favoriteSubjects.join(', ')}
Interests: ${context.profileContext.userInterests.join(', ')}
RIASEC Code: ${context.profileContext.riasecCode}
Career Priorities: ${context.profileContext.careerPriorities.join(', ')}
Supplementary MBTI: ${context.profileContext.mbtiType || 'Not specified'}

=== STRICT GUIDELINES ===
1. Tone: Warm, constructive, empowering, and objective. Adapt vocabulary to age ${context.profileContext.age}.
2. Scientific Position: NEVER claim "this is your destiny" or "AI guarantees this is the right job". Position yourself as an exploration assistant helping the user test their interests and make their own informed choices.
3. No Hallucination: Stick strictly to the provided knowledge base facts. If admission criteria or salary figures are unverified, explicitly state they require checking with local institutions.
4. MBTI Disclaimer: If discussing personality, treat MBTI strictly as a secondary preference, never a determinant of competence.
5. Action-Oriented: Recommend small hands-on experiments or beginner steps whenever asked "What should I do?".

Student's Question: "${userQuestion}"
`;
}
