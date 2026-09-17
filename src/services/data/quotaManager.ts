/**
 * AI Quota Protection & Rate Limiting Engine
 * Guarantees zero unhandled crashes, circuit breaker isolation,
 * strictly sequential concurrency (max 1), exponential backoff, and daily quota guards.
 */

export interface QuotaConfig {
  maxConcurrentAiCalls: number; // strictly 1
  maxRetries: number; // 2
  initialBackoffMs: number; // 1500ms
  maxBackoffMs: number; // 10000ms
  dailyAiCallLimit: number; // e.g. 50 calls per day
  requestTimeoutMs: number; // 15000ms
}

export const DEFAULT_QUOTA_CONFIG: QuotaConfig = {
  maxConcurrentAiCalls: 1,
  maxRetries: 2,
  initialBackoffMs: 1500,
  maxBackoffMs: 10000,
  dailyAiCallLimit: 60,
  requestTimeoutMs: 15000
};

export class QuotaManager {
  private config: QuotaConfig;
  private currentActiveCalls: number = 0;
  private callsMadeToday: number = 0;
  private lastResetDate: string;
  private circuitBreakerTripped: boolean = false;
  private circuitBreakerReason: string = '';
  private tripTimestamp: number = 0;
  private readonly CIRCUIT_COOLOFF_MS = 60000 * 5; // 5 minutes cool-off

  constructor(config: Partial<QuotaConfig> = {}) {
    this.config = { ...DEFAULT_QUOTA_CONFIG, ...config };
    this.lastResetDate = new Date().toISOString().split('T')[0];
  }

  private checkAndResetDailyCounter(): void {
    const today = new Date().toISOString().split('T')[0];
    if (today !== this.lastResetDate) {
      this.callsMadeToday = 0;
      this.lastResetDate = today;
      this.circuitBreakerTripped = false;
      this.circuitBreakerReason = '';
    }
  }

  public getStatus() {
    this.checkAndResetDailyCounter();
    // Auto-recover circuit breaker if cool-off period has passed
    if (this.circuitBreakerTripped && Date.now() - this.tripTimestamp > this.CIRCUIT_COOLOFF_MS) {
      this.circuitBreakerTripped = false;
      this.circuitBreakerReason = '';
    }

    return {
      activeCalls: this.currentActiveCalls,
      callsToday: this.callsMadeToday,
      dailyLimit: this.config.dailyAiCallLimit,
      circuitTripped: this.circuitBreakerTripped,
      circuitReason: this.circuitBreakerReason,
      remainingQuota: Math.max(0, this.config.dailyAiCallLimit - this.callsMadeToday)
    };
  }

  public tripCircuitBreaker(reason: string): void {
    this.circuitBreakerTripped = true;
    this.circuitBreakerReason = reason;
    this.tripTimestamp = Date.now();
    console.warn(`[QUOTA_CIRCUIT_BREAKER] Tripped: ${reason}. AI calls paused.`);
  }

  public resetCircuitBreaker(): void {
    this.circuitBreakerTripped = false;
    this.circuitBreakerReason = '';
    this.tripTimestamp = 0;
  }

  public canMakeCall(): { allowed: boolean; reason?: string } {
    this.checkAndResetDailyCounter();

    if (this.circuitBreakerTripped) {
      return { allowed: false, reason: `Circuit breaker active: ${this.circuitBreakerReason}` };
    }

    if (this.callsMadeToday >= this.config.dailyAiCallLimit) {
      this.tripCircuitBreaker(`Daily AI call limit (${this.config.dailyAiCallLimit}) reached.`);
      return { allowed: false, reason: 'Daily AI quota limit reached' };
    }

    if (this.currentActiveCalls >= this.config.maxConcurrentAiCalls) {
      return { allowed: false, reason: 'Max concurrent AI requests reached (1)' };
    }

    return { allowed: true };
  }

  /**
   * Executes an AI operation with strict rate limiting, exponential backoff and error recovery
   */
  public async executeWithProtection<T>(
    operationName: string,
    action: () => Promise<T>,
    fallbackAction?: () => Promise<T>
  ): Promise<{ success: boolean; result?: T; error?: string; usedAiCalls: number }> {
    const check = this.canMakeCall();
    if (!check.allowed) {
      console.warn(`[QUOTA_GUARD] Call rejected for "${operationName}": ${check.reason}`);
      if (fallbackAction) {
        try {
          const fb = await fallbackAction();
          return { success: true, result: fb, usedAiCalls: 0 };
        } catch (fbErr: any) {
          return { success: false, error: `Fallback failed: ${fbErr?.message}`, usedAiCalls: 0 };
        }
      }
      return { success: false, error: check.reason, usedAiCalls: 0 };
    }

    this.currentActiveCalls++;
    let attempts = 0;
    let delay = this.config.initialBackoffMs;

    try {
      while (attempts <= this.config.maxRetries) {
        attempts++;
        try {
          // Wrap action in timeout
          const resultPromise = action();
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI_REQUEST_TIMEOUT')), this.config.requestTimeoutMs)
          );

          const result = await Promise.race([resultPromise, timeoutPromise]);
          this.callsMadeToday++;
          return { success: true, result, usedAiCalls: 1 };
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          const is429 = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota');
          const isTimeout = errMsg.includes('TIMEOUT');
          const is5xx = errMsg.includes('500') || errMsg.includes('502') || errMsg.includes('503') || errMsg.includes('504');

          if (is429) {
            this.tripCircuitBreaker('HTTP 429 Quota Exceeded from AI Provider');
            break; // Stop immediately, no pointless retries
          }

          if (attempts > this.config.maxRetries) {
            console.error(`[QUOTA_GUARD] Max retries (${this.config.maxRetries}) exhausted for "${operationName}". Error: ${errMsg}`);
            break;
          }

          if (isTimeout || is5xx) {
            console.warn(`[QUOTA_GUARD] Temporary failure (attempt ${attempts}/${this.config.maxRetries}) for "${operationName}": ${errMsg}. Backing off ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
            delay = Math.min(delay * 2, this.config.maxBackoffMs);
          } else {
            // Unrecoverable application / format error, do not retry
            console.error(`[QUOTA_GUARD] Non-retryable error for "${operationName}": ${errMsg}`);
            break;
          }
        }
      }
    } finally {
      this.currentActiveCalls = Math.max(0, this.currentActiveCalls - 1);
    }

    // Try fallback if primary AI call failed
    if (fallbackAction) {
      try {
        console.log(`[QUOTA_GUARD] Executing deterministic fallback for "${operationName}"`);
        const fallbackRes = await fallbackAction();
        return { success: true, result: fallbackRes, usedAiCalls: 0 };
      } catch (fbErr: any) {
        return { success: false, error: `AI and Fallback failed: ${fbErr?.message}`, usedAiCalls: 0 };
      }
    }

    return { success: false, error: `Failed to execute ${operationName} after quota-protected attempts`, usedAiCalls: 0 };
  }
}
