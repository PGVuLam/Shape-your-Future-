/**
 * Conflict Detection & Discrepancy Resolution Module
 * Compares incoming records with active database versions.
 * Discrepancies between official & secondary sources trigger structured Conflict items for admin review.
 */

import { AdmissionScoreRecord, UpdateConflict, SourceType } from './types';

const SOURCE_PRIORITY_WEIGHT: Record<SourceType, number> = {
  MINISTRY_OFFICIAL: 100,
  UNIVERSITY_OFFICIAL: 90,
  GOVERNMENT: 80,
  TRUSTED_SECONDARY: 50,
  OTHER: 10
};

export class ConflictDetector {
  /**
   * Evaluates if a new score record conflicts with an existing verified score record
   */
  public static detectScoreConflict(
    existing: AdmissionScoreRecord,
    incoming: AdmissionScoreRecord
  ): { hasConflict: boolean; autoResolvable: boolean; conflictItem?: UpdateConflict } {
    // 1. Same score, method and combination -> No conflict
    if (
      existing.score === incoming.score &&
      existing.scoreScale === incoming.scoreScale &&
      existing.combination === incoming.combination
    ) {
      return { hasConflict: false, autoResolvable: true };
    }

    // 2. Score differs! Evaluate source hierarchy
    const existingWeight = SOURCE_PRIORITY_WEIGHT[existing.provenance.sourceType] || 10;
    const incomingWeight = SOURCE_PRIORITY_WEIGHT[incoming.provenance.sourceType] || 10;

    const isNewerOfficialAnnouncement =
      incomingWeight > existingWeight ||
      (incomingWeight === existingWeight && incoming.provenance.sourceType === 'UNIVERSITY_OFFICIAL');

    const conflictItem: UpdateConflict = {
      id: `conflict-${incoming.id}-${Date.now()}`,
      sourceId: incoming.universityId,
      entityType: 'admission_scores',
      recordId: incoming.id,
      field: 'score',
      oldValue: {
        score: existing.score,
        scale: existing.scoreScale,
        combination: existing.combination,
        source: existing.provenance.publisher
      },
      newValue: {
        score: incoming.score,
        scale: incoming.scoreScale,
        combination: incoming.combination,
        source: incoming.provenance.publisher
      },
      oldSource: existing.provenance,
      newSource: incoming.provenance,
      detectedAt: new Date().toISOString(),
      status: isNewerOfficialAnnouncement ? 'AUTO_RESOLVED' : 'PENDING_REVIEW',
      requiresReview: !isNewerOfficialAnnouncement,
      resolutionNotes: isNewerOfficialAnnouncement
        ? `Tự động cập nhật: Nguồn mới (${incoming.provenance.publisher}) có độ ưu tiên cao hơn nguồn cũ.`
        : `Xung đột dữ liệu: Điểm chuẩn cũ (${existing.score}) khác điểm mới (${incoming.score}). Cần Admin xác minh thủ công.`
    };

    return {
      hasConflict: true,
      autoResolvable: isNewerOfficialAnnouncement,
      conflictItem
    };
  }
}
