import { UserProfile, Career, LLMConfig, RecommendationScore } from '../types';
import { ChatMessage, NormalizedAIResponse } from './ai/types';
import { buildCounselorContext } from './ai/contextBuilder';
import { executeLLMRequest } from './ai/llmProvider';

export type { ChatMessage, NormalizedAIResponse };

/**
 * High-Level AI Counselor Orchestrator
 * Connects Context Builder → Grounding / RAG → LLM Provider Interface
 *
 * Supports overloaded calling conventions for 100% backward compatibility:
 * - Style 1 (Step 4 Report): (userQuestion, profile, topCareers, llmConfig, chatHistory, recommendations)
 * - Style 2 (Legacy View):   (profile, career, userQuestion, chatHistory, recScore, language)
 */
export async function askAICounselor(
  arg1: string | UserProfile,
  arg2: UserProfile | Career,
  arg3: Career[] | string,
  arg4?: LLMConfig | Array<{ role: string; content: string }>,
  arg5?: ChatMessage[] | RecommendationScore,
  arg6?: any[] | ('vi' | 'en'),
  arg7?: Career[]
): Promise<NormalizedAIResponse> {
  // Case A: Style 1 - (userQuestion, profile, topCareers, llmConfig, chatHistory, recommendations, comparedCareers)
  if (typeof arg1 === 'string') {
    const userQuestion = arg1;
    const profile = arg2 as UserProfile;
    const topCareers = (Array.isArray(arg3) ? arg3 : []) as Career[];
    const llmConfig = (arg4 && !Array.isArray(arg4) ? arg4 : { provider: 'gemini', modelName: 'gemini-3.8-flash' }) as LLMConfig;
    const chatHistory = (Array.isArray(arg5) ? arg5 : []) as ChatMessage[];
    const recommendations = (Array.isArray(arg6) ? arg6 : []) as any[];
    const comparedCareers = (Array.isArray(arg7) ? arg7 : undefined) as Career[] | undefined;

    const context = buildCounselorContext(profile, topCareers[0], topCareers, recommendations, undefined, comparedCareers, userQuestion);

    return executeLLMRequest({
      userQuestion,
      context,
      chatHistory: chatHistory.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.content
      })),
      language: 'vi',
      llmConfig
    });
  }

  // Case B: Style 2 - (profile, career, userQuestion, chatHistory, recScore, language)
  const profile = arg1 as UserProfile;
  const career = arg2 as Career;
  const userQuestion = typeof arg3 === 'string' ? arg3 : '';
  const chatHistory = (Array.isArray(arg4) ? arg4 : []) as Array<{ role: string; content: string }>;
  const recScore = (arg5 && typeof arg5 === 'object' && 'overallScore' in arg5 ? arg5 : undefined) as RecommendationScore | undefined;
  const language = (typeof arg6 === 'string' && (arg6 === 'vi' || arg6 === 'en') ? arg6 : 'vi') as 'vi' | 'en';

  const context = buildCounselorContext(profile, career, [career], undefined, recScore, undefined, userQuestion);

  return executeLLMRequest({
    userQuestion,
    context,
    chatHistory: chatHistory.map(m => ({
      role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      content: m.content
    })),
    language,
    llmConfig: {
      provider: 'gemini',
      modelName: 'gemini-3.8-flash'
    }
  });
}
