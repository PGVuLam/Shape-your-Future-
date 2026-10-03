import { LLMProviderRequest, NormalizedAIResponse } from './types';
import { generateOfflineCounselingResponse } from './offlineReasoningEngine';

/**
 * Pure LLM Provider Interface:
 * Handles network transmission, provider selection, timeout handling,
 * and response normalization without mixing domain business logic.
 */
export async function executeLLMRequest(
  request: LLMProviderRequest
): Promise<NormalizedAIResponse> {
  const { userQuestion, context, chatHistory, language = 'vi', llmConfig } = request;

  // 1. Explicit local / offline mode requested
  if (llmConfig?.provider === 'local') {
    return generateOfflineCounselingResponse(context, userQuestion, language);
  }

  // 2. Call backend AI proxy (/api/ai/counselor) for Gemini 3.8 Flash or Custom Local Endpoint
  try {
    const res = await fetch('/api/ai/counselor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userQuestion,
        language,
        llmConfig: {
          ...llmConfig,
          provider: llmConfig?.provider || 'gemini',
          modelName: llmConfig?.modelName || 'gemini-3.8-flash',
          maxOutputTokens: 800,
          maxTokens: 800
        },
        chatHistory: chatHistory.map(m => ({
          role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
          parts: m.content || m.parts || '',
          content: m.content || m.parts || ''
        })),
        context
      }),
      signal: AbortSignal.timeout(16000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        const reply = String(data.reply).trim();
        const modelUsed = String(data.provider || 'Gemini 3.8 Flash (Cloud)');
        const suggestedQuestions = Array.isArray(data.suggestedFollowUps) && data.suggestedFollowUps.length > 0
          ? data.suggestedFollowUps
          : [
              'Lộ trình rèn luyện cụ thể trong 6 tháng tới?',
              'Cách đăng ký nguyện vọng đại học an toàn?',
              'Kỹ năng quan trọng nhất cần tích lũy là gì?'
            ];

        return {
          reply,
          modelUsed,
          suggestedQuestions,
          content: reply,
          provider: modelUsed,
          suggestedFollowUps: suggestedQuestions
        };
      }
    }
  } catch (networkOrTimeoutErr) {
    console.warn('[LLMProvider] Network/Timeout error in cloud AI, activating deterministic reasoning fallback:', networkOrTimeoutErr);
  }

  // 3. Fallback to High-IQ In-Browser Offline Reasoning Engine
  return generateOfflineCounselingResponse(context, userQuestion, language);
}
