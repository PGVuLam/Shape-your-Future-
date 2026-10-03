import { UserProfile, Career, RecommendationScore } from '../types';
import { NormalizedAIResponse } from './ai/types';
import { askAICounselor as unifiedAskAICounselor } from './aiCounselorService';
import { generateOfflineCounselingResponse } from './ai/offlineReasoningEngine';
import { RetrievedCareerContext } from './ragService';

export interface LLMResponse {
  content: string;
  provider: string;
  suggestedFollowUps?: string[];
}

export type { NormalizedAIResponse };

/**
 * Backwards-compatible counselor query wrapper delegating to unified AI architecture
 */
export async function askAICounselor(
  profile: UserProfile,
  career: Career,
  userQuestion: string,
  chatHistory: Array<{ role: string; content: string }> = [],
  recScore?: RecommendationScore,
  language: 'vi' | 'en' = 'vi'
): Promise<LLMResponse> {
  const result: NormalizedAIResponse = await unifiedAskAICounselor(
    profile,
    career,
    userQuestion,
    chatHistory,
    recScore,
    language
  );

  return {
    content: result.reply,
    provider: result.modelUsed,
    suggestedFollowUps: result.suggestedQuestions
  };
}

/**
 * Backwards-compatible offline generator
 */
export function generateDeterministicCounselorResponse(
  context: RetrievedCareerContext,
  userQuestion: string,
  language: 'vi' | 'en' = 'vi'
): LLMResponse {
  const payload = {
    careerTitle: context.careerTitle,
    cluster: context.cluster,
    tasks: context.tasks,
    requiredSkills: context.requiredSkills,
    userMatchedSkills: context.userMatchedSkills,
    userMissingSkills: context.userMissingSkills,
    educationPaths: context.educationPaths,
    salaryLevel: context.salaryLevel,
    riasecFitSummary: context.riasecFitSummary,
    verifiedAdmissionContext: context.verifiedAdmissionContext,
    surveyRecommendations: [],
    profileContext: {
      age: context.profileContext.age,
      ageGroup: (context.profileContext.ageGroup || '15-18') as any,
      educationLevel: context.profileContext.educationLevel,
      favoriteSubjects: context.profileContext.favoriteSubjects,
      interests: context.profileContext.userInterests,
      riasecCode: context.profileContext.riasecCode,
      careerPriorities: context.profileContext.careerPriorities,
      mbtiType: context.profileContext.mbtiType
    }
  };

  const offlineRes = generateOfflineCounselingResponse(payload, userQuestion, language);

  return {
    content: offlineRes.reply,
    provider: offlineRes.modelUsed,
    suggestedFollowUps: offlineRes.suggestedQuestions
  };
}
