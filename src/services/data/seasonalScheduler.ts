/**
 * Seasonal Scheduler & Frequency Policy
 * Adjusts crawling and update frequency based on the Vietnamese academic admission calendar.
 */

import { DataSource, UpdatePeriod } from './types';

export class SeasonalScheduler {
  /**
   * Determines the current admission season based on the month (1-12)
   */
  public static getCurrentSeason(date: Date = new Date()): UpdatePeriod {
    const month = date.getMonth() + 1; // 1 to 12

    // August & September: National Score Release Period
    if (month === 8 || month === 9) {
      return 'SCORE_RELEASE_PERIOD';
    }

    // March to July: Application, Exam Registration & Early Admissions
    if (month >= 3 && month <= 7) {
      return 'ADMISSION_PERIOD';
    }

    // October to February: Normal / Baseline
    return 'NORMAL_PERIOD';
  }

  /**
   * Calculates the dynamic check interval in days based on season and entity type
   */
  public static getEffectiveFrequencyDays(
    source: DataSource,
    period: UpdatePeriod = this.getCurrentSeason()
  ): number {
    const base = source.updateFrequencyDays || 14;

    switch (period) {
      case 'SCORE_RELEASE_PERIOD':
        // High frequency for scores, medium for others
        if (source.targetEntity === 'admission_scores') return Math.max(1, Math.floor(base / 4));
        if (source.targetEntity === 'programs') return Math.max(3, Math.floor(base / 2));
        return base;

      case 'ADMISSION_PERIOD':
        if (source.targetEntity === 'admission_scores') return Math.max(3, Math.floor(base / 2));
        if (source.targetEntity === 'programs' || source.targetEntity === 'tuition') return Math.max(7, Math.floor(base / 2));
        return base;

      case 'NORMAL_PERIOD':
      default:
        return base;
    }
  }

  /**
   * Checks whether a source is due for an update check
   */
  public static isSourceDueForCheck(
    source: DataSource,
    period: UpdatePeriod = this.getCurrentSeason(),
    now: Date = new Date()
  ): boolean {
    if (!source.enabled) return false;
    if (!source.lastCheckedAt) return true; // Never checked before

    const lastChecked = new Date(source.lastCheckedAt).getTime();
    const effectiveDays = this.getEffectiveFrequencyDays(source, period);
    const intervalMs = effectiveDays * 24 * 60 * 60 * 1000;

    return now.getTime() - lastChecked >= intervalMs;
  }
}
