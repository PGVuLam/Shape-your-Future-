/**
 * Type definitions for the Data Update Pipeline
 * Covering Universities, Programs, Admission Methods, Combinations,
 * Benchmark Scores, Tuition, Career Profiles, Skills & Labor Market Intelligence.
 */

export type SourceType =
  | 'MINISTRY_OFFICIAL'    // Bộ GD&ĐT / Cổng thông tin tuyển sinh quốc gia
  | 'UNIVERSITY_OFFICIAL'  // Website & Cổng tuyển sinh chính thức của trường
  | 'GOVERNMENT'            // Tổng cục Thống kê, Bộ LĐTB&XH, Cơ quan nhà nước
  | 'TRUSTED_SECONDARY'    // Báo chí chính thống (VnExpress, Tuổi Trẻ, Thanh Niên)
  | 'OTHER';

export type UpdatePeriod = 'NORMAL_PERIOD' | 'ADMISSION_PERIOD' | 'SCORE_RELEASE_PERIOD';

export interface DataSource {
  id: string;
  name: string;
  url: string;
  sourceType: SourceType;
  priority: number; // 1 = highest (Ministry), 2 = University, 3 = Gov, 4 = Secondary
  targetEntity: 'universities' | 'admission_scores' | 'programs' | 'tuition' | 'careers' | 'labor_market';
  updateFrequencyDays: number; // base frequency in days
  enabled: boolean;
  lastCheckedAt?: string;
  lastChangedAt?: string;
  lastContentHash?: string;
  etag?: string;
  lastModified?: string;
  consecutiveFailures: number;
  lastError?: string;
}

export interface SourceProvenance {
  sourceUrl: string;
  sourceType: SourceType;
  publisher: string;
  publishedAt?: string;
  retrievedAt: string;
  verified: boolean;
  confidence: number; // 0.0 - 1.0
  version: string;
  checksum?: string;
}

export interface AdmissionMethodDetail {
  methodCode: string; // THPT, HSA, TSA, V-ACT, HOC_BA, XET_TUYEN_THANG, CCQT
  methodName: string; // e.g. "Xét điểm thi Tốt nghiệp THPT 2026"
  combination?: string; // A00, A01, B00, C00, D01, D07, etc.
  score?: number; // e.g. 27.5
  scoreScale: 30 | 100 | 150 | 1200; // Standard Vietnamese score scales
  rawScoreText?: string; // e.g. "27.50 điểm (Toán x2)"
  specialConditions?: string; // e.g. "IELTS >= 6.5 hoặc HSA >= 90"
  quotaPercentage?: number; // e.g. 40% chỉ tiêu
}

export interface ProgramRecord {
  id: string;
  universityId: string;
  programCode: string; // Mã ngành tuyển sinh, e.g. "7480201"
  programName: string; // e.g. "Khoa học máy tính (IT1)"
  degreeLevel: 'Đại học' | 'Cao đẳng' | 'Thạc sĩ' | 'Kỹ sư chuyên sâu';
  durationYears: number;
  admissionMethods: AdmissionMethodDetail[];
  tuitionPerYearVND?: number;
  tuitionDescription?: string;
  entryThreshold?: number; // Điểm sàn nộp hồ sơ
  entryThresholdScale?: 30 | 100 | 150 | 1200;
  year: number;
  provenance: SourceProvenance;
}

export interface UniversityRecord {
  id: string;
  code: string; // Mã trường, e.g. "BKA", "QHI", "QSX", "NTH", "KHA"
  name: string;
  shortName: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  location: string;
  tier: 'Top 1' | 'Top 2' | 'Chuyên ngành' | 'Cao đẳng nghề';
  category: string;
  website: string;
  admissionWebsite: string;
  hotline?: string;
  isVocational: boolean;
  programs: ProgramRecord[];
  latestNews?: Array<{
    title: string;
    date: string;
    url: string;
    summary: string;
  }>;
  year: number;
  provenance: SourceProvenance;
  lastUpdated: string;
}

export interface AdmissionScoreRecord {
  id: string;
  universityId: string;
  universityCode: string;
  universityName: string;
  programCode: string;
  programName: string;
  year: number;
  method: string;
  combination?: string;
  score: number;
  scoreScale: 30 | 100 | 150 | 1200;
  notes?: string;
  provenance: SourceProvenance;
  status: 'ACTIVE' | 'ARCHIVED' | 'DISPUTED';
}

export interface CareerMarketRecord {
  careerId: string;
  title: string;
  cluster: string;
  salaryBenchmark: {
    entryVND: string;
    midVND: string;
    seniorVND: string;
    levelIndicator: 'Moderate' | 'Above Average' | 'High' | 'Very High';
    lastSurveyYear: number;
    disclaimer: string;
  };
  keySkills: string[];
  emergingSkills: string[];
  aiDisruptionLevel: 'Low' | 'Moderate' | 'High' | 'Transformative';
  growthOutlookPercent: number; // e.g. 15% projected 5-year growth
  provenance: SourceProvenance;
  lastUpdated: string;
}

export interface DataVersion {
  id: string;
  versionTag: string; // e.g. "v2026.09.16-1"
  entityType: 'universities' | 'admission_scores' | 'programs' | 'careers' | 'all';
  createdAt: string;
  createdBy: 'PIPELINE_AUTO' | 'ADMIN_MANUAL';
  description: string;
  recordsCount: number;
  snapshotJson: string; // Serialized snapshot for easy rollback
  sourceJobId?: string;
}

export interface UpdateConflict {
  id: string;
  sourceId: string;
  entityType: string;
  recordId: string;
  field: string;
  oldValue: any;
  newValue: any;
  oldSource: SourceProvenance;
  newSource: SourceProvenance;
  detectedAt: string;
  status: 'PENDING_REVIEW' | 'AUTO_RESOLVED' | 'MANUALLY_RESOLVED' | 'REJECTED';
  resolutionNotes?: string;
  requiresReview: boolean;
}

export interface UpdateJob {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  completedAt?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED_UNCHANGED' | 'QUOTA_EXCEEDED';
  sourceChanged: boolean;
  contentHash?: string;
  aiCallsCount: number;
  recordsExtracted: number;
  recordsUpdated: number;
  conflictsCount: number;
  errors: string[];
  executionLogs: string[];
}

export interface PipelineMetrics {
  totalRuns: number;
  lastRunTimestamp: string;
  nextScheduledRun: string;
  activePeriod: UpdatePeriod;
  sourcesTotal: number;
  sourcesActive: number;
  sourcesChangedLastRun: number;
  aiCallsUsedToday: number;
  aiDailyQuotaLimit: number;
  circuitBreakerActive: boolean;
  circuitBreakerReason?: string;
  conflictsPendingCount: number;
  verifiedUniversitiesCount: number;
  verifiedScoresCount: number;
  ragReindexStatus: 'IDLE' | 'INDEXING' | 'SYNCHRONIZED';
  lastRagSyncTimestamp: string;
}
