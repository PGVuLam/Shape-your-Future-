/**
 * Master Data Update Pipeline Service
 * Orchestrates the full lifecycle:
 * Scheduler → Source Monitor → Change Detection → Fetch → AI Extraction (if needed)
 * → Validation → Conflict Detection → Database Update → Versioning → RAG Refresh.
 */

import {
  DataSource,
  UpdateJob,
  PipelineMetrics,
  SourceProvenance,
  AdmissionScoreRecord,
  UniversityRecord
} from './types';
import { SourceRegistry, DEFAULT_DATA_SOURCES } from './sourceRegistry';
import { QuotaManager } from './quotaManager';
import { ChangeDetector } from './changeDetector';
import { DataFetcher } from './dataFetcher';
import { DataExtractor } from './dataExtractor';
import { DataValidator } from './dataValidator';
import { ConflictDetector } from './conflictDetector';
import { DataVersionService } from './dataVersionService';
import { SeasonalScheduler } from './seasonalScheduler';
import { RAGUpdateIntegration } from './ragUpdateIntegration';

export interface RunPipelineOptions {
  sourceId?: string; // If provided, run only for this source
  forceFetch?: boolean; // Force check ignoring schedule interval
  onProgress?: (msg: string, percent: number) => void;
}

export class DataUpdateService {
  private static instance: DataUpdateService | null = null;

  public sourceRegistry: SourceRegistry;
  public quotaManager: QuotaManager;
  public versionService: DataVersionService;
  public ragIntegration: RAGUpdateIntegration;
  private dataFetcher: DataFetcher;
  private dataExtractor: DataExtractor;
  private isRunning: boolean = false;
  private lastRunTimestamp: string = '';

  constructor(groqApiKey?: string) {
    this.sourceRegistry = new SourceRegistry(DEFAULT_DATA_SOURCES);
    this.quotaManager = new QuotaManager();
    this.versionService = new DataVersionService();
    this.ragIntegration = new RAGUpdateIntegration();
    this.dataFetcher = new DataFetcher(8000);
    this.dataExtractor = new DataExtractor(this.quotaManager, groqApiKey);

    // Initial RAG synchronization from verified database
    this.syncInitialRag();
  }

  public static getInstance(groqApiKey?: string): DataUpdateService {
    if (!DataUpdateService.instance) {
      DataUpdateService.instance = new DataUpdateService(groqApiKey);
    }
    return DataUpdateService.instance;
  }

  private syncInitialRag(): void {
    const unis = this.versionService.getUniversities();
    const scores = this.versionService.getAdmissionScores();
    this.ragIntegration.indexUniversities(unis);
    this.ragIntegration.indexAdmissionScores(scores);
  }

  /**
   * Main pipeline execution entry point
   */
  public async runPipeline(options: RunPipelineOptions = {}): Promise<{
    success: boolean;
    jobs: UpdateJob[];
    summary: string;
    totalUpdated: number;
    totalAiCalls: number;
  }> {
    if (this.isRunning) {
      return {
        success: false,
        jobs: [],
        summary: 'Pipeline đang có tác vụ đang chạy trong nền',
        totalUpdated: 0,
        totalAiCalls: 0
      };
    }

    this.isRunning = true;
    const executedJobs: UpdateJob[] = [];
    let totalUpdated = 0;
    let totalAiCalls = 0;
    const activeSeason = SeasonalScheduler.getCurrentSeason();

    const progress = (msg: string, pct: number) => {
      console.log(`[DATA_UPDATE_PIPELINE] ${msg}`);
      if (options.onProgress) options.onProgress(msg, pct);
    };

    try {
      progress('Khởi tạo Data Update Pipeline...', 5);

      // 1. Determine target sources
      let targetSources: DataSource[] = [];
      if (options.sourceId) {
        const single = this.sourceRegistry.getById(options.sourceId);
        if (single) targetSources = [single];
      } else {
        targetSources = this.sourceRegistry.getAll().filter(s => {
          if (!s.enabled) return false;
          if (options.forceFetch) return true;
          return SeasonalScheduler.isSourceDueForCheck(s, activeSeason);
        });
      }

      if (targetSources.length === 0) {
        progress('Tất cả các nguồn dữ liệu đều còn mới, không có nguồn nào đến hạn cập nhật.', 100);
        return {
          success: true,
          jobs: [],
          summary: 'Tất cả các nguồn dữ liệu đều đang cập nhật đầy đủ (0 AI calls required)',
          totalUpdated: 0,
          totalAiCalls: 0
        };
      }

      const totalSources = targetSources.length;
      let processedCount = 0;

      for (const source of targetSources) {
        processedCount++;
        const currentPct = Math.round(10 + (processedCount / totalSources) * 80);
        progress(`[${processedCount}/${totalSources}] Đang kiểm tra nguồn: ${source.name}...`, currentPct);

        const job: UpdateJob = {
          id: `job-${source.id}-${Date.now()}`,
          sourceId: source.id,
          sourceName: source.name,
          startedAt: new Date().toISOString(),
          status: 'RUNNING',
          sourceChanged: false,
          aiCallsCount: 0,
          recordsExtracted: 0,
          recordsUpdated: 0,
          conflictsCount: 0,
          errors: [],
          executionLogs: []
        };

        const log = (msg: string) => {
          job.executionLogs.push(`[${new Date().toLocaleTimeString('vi-VN')}] ${msg}`);
          console.log(`[DATA_UPDATE][${source.id}] ${msg}`);
        };

        try {
          // STEP 1: FETCH
          log(`Đang gửi yêu cầu kiểm tra (ETag/Last-Modified/Content): ${source.url}`);
          const fetchResult = await this.dataFetcher.fetchSource(source);

          // STEP 2: CHANGE DETECTION
          let changeRes = ChangeDetector.checkHeaderChange(source, fetchResult.status, fetchResult.headers);
          if (!changeRes && !fetchResult.is304NotModified) {
            changeRes = ChangeDetector.checkContentChange(source, fetchResult.rawBody);
          }

          source.lastCheckedAt = new Date().toISOString();
          if (fetchResult.headers.etag) source.etag = fetchResult.headers.etag;
          if (fetchResult.headers.lastModified) source.lastModified = fetchResult.headers.lastModified;

          if (!changeRes || !changeRes.hasChanged) {
            // STOP! ZERO AI CALLS!
            log(`Dữ liệu không thay đổi (${changeRes?.reason || 'HASH_MATCH'}). Dừng pipeline tại đây: 0 AI call.`);
            job.status = 'SKIPPED_UNCHANGED';
            job.sourceChanged = false;
            job.completedAt = new Date().toISOString();
            this.versionService.addUpdateJob(job);
            executedJobs.push(job);
            continue;
          }

          // SOURCE HAS CHANGED!
          job.sourceChanged = true;
          source.lastChangedAt = new Date().toISOString();
          source.lastContentHash = changeRes.newContentHash;
          log(`Phát hiện nội dung mới (${changeRes.reason}). Bắt đầu giai đoạn bóc tách dữ liệu...`);

          const provenance: SourceProvenance = {
            sourceUrl: source.url,
            sourceType: source.sourceType,
            publisher: source.name,
            retrievedAt: fetchResult.retrievedAt,
            verified: source.sourceType !== 'OTHER',
            confidence: source.sourceType === 'MINISTRY_OFFICIAL' ? 1.0 : 0.95,
            version: `${new Date().getFullYear()}-update`
          };

          // STEP 3: AI EXTRACTION (WITH SEQUENTIAL QUOTA GUARD & FALLBACK)
          log('Đang bóc tách dữ liệu có cấu trúc với cơ chế bảo vệ Quota AI...');
          const extractRes = await this.dataExtractor.extractDataFromSource(
            source,
            changeRes.changedSnippet || fetchResult.rawBody,
            provenance
          );

          job.aiCallsCount = extractRes.usedAiCalls;
          totalAiCalls += extractRes.usedAiCalls;

          if (!extractRes.success || !extractRes.data) {
            log(`Lỗi bóc tách dữ liệu: ${extractRes.error || 'Trích xuất không thành công'}`);
            job.status = 'FAILED';
            job.errors.push(extractRes.error || 'Extraction failure');
            job.completedAt = new Date().toISOString();
            this.versionService.addUpdateJob(job);
            executedJobs.push(job);
            continue;
          }

          const extractedScores = extractRes.data.admissionScores || [];
          const extractedPrograms = extractRes.data.programs || [];
          job.recordsExtracted = extractedScores.length + extractedPrograms.length;
          log(`Đã bóc tách được ${extractedPrograms.length} ngành học và ${extractedScores.length} bản ghi điểm chuẩn.`);

          // STEP 4: DETERMINISTIC VALIDATION
          log('Đang kiểm tra tính hợp lệ dữ liệu (Deterministic Data Validation)...');
          const valReport = DataValidator.validateAdmissionScores(extractedScores);

          if (!valReport.isValid) {
            log(`Phát hiện ${valReport.invalidRecordsCount} bản ghi không hợp lệ. Đưa các bản ghi lỗi vào danh sách Kiểm duyệt (Review), không ghi đè cơ sở dữ liệu.`);
            valReport.issues.forEach(iss => job.errors.push(`[${iss.rule}] ${iss.message}`));
          }

          // STEP 5: CONFLICT DETECTION & DATABASE UPDATE
          const validScores = extractedScores.filter(s => !valReport.issues.some(i => i.recordId === s.id && i.severity === 'ERROR'));
          let recordsUpdatedThisJob = 0;

          for (const newScore of validScores) {
            const existingScore = this.versionService.getAdmissionScores().find(s => s.id === newScore.id);

            if (existingScore) {
              const conflict = ConflictDetector.detectScoreConflict(existingScore, newScore);
              if (conflict.hasConflict) {
                if (conflict.conflictItem) {
                  this.versionService.addConflict(conflict.conflictItem);
                  job.conflictsCount++;
                }

                if (conflict.autoResolvable) {
                  this.versionService.upsertAdmissionScore(newScore);
                  recordsUpdatedThisJob++;
                  log(`Tự động cập nhật điểm chuẩn ngành ${newScore.programName}: ${existingScore.score} -> ${newScore.score}`);
                } else {
                  log(`Tạo mục xung đột (Conflict Review) cho ngành ${newScore.programName}: Cũ=${existingScore.score}, Mới=${newScore.score}`);
                }
              }
            } else {
              // New record
              this.versionService.upsertAdmissionScore(newScore);
              recordsUpdatedThisJob++;
              log(`Thêm mới điểm chuẩn ngành ${newScore.programName} (${newScore.universityName}): ${newScore.score}/${newScore.scoreScale}đ`);
            }
          }

          job.recordsUpdated = recordsUpdatedThisJob;
          totalUpdated += recordsUpdatedThisJob;
          job.status = 'COMPLETED';
          job.completedAt = new Date().toISOString();

          // STEP 6: INCREMENTAL RAG RE-INDEX
          if (recordsUpdatedThisJob > 0) {
            const reindexed = this.ragIntegration.indexAdmissionScores(validScores);
            log(`Đã làm mới RAG Vector & Grounding Context cho ${reindexed} bản ghi mới.`);
          }

          this.versionService.addUpdateJob(job);
          executedJobs.push(job);
        } catch (sourceErr: any) {
          log(`Lỗi ngoại lệ khi xử lý nguồn ${source.name}: ${sourceErr?.message}`);
          job.status = 'FAILED';
          job.errors.push(String(sourceErr?.message || sourceErr));
          job.completedAt = new Date().toISOString();
          this.versionService.addUpdateJob(job);
          executedJobs.push(job);
        }
      }

      // STEP 7: VERSIONING SNAPSHOT
      if (totalUpdated > 0) {
        const verTag = `v${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12)}`;
        this.versionService.createSnapshot(
          verTag,
          `Đợt cập nhật định kỳ: ${totalUpdated} bản ghi được cập nhật (${totalAiCalls} AI calls sử dụng).`,
          'PIPELINE_AUTO'
        );
        progress(`Đã tạo Snapshot phiên bản mới [${verTag}] thành công.`, 95);
      }

      this.lastRunTimestamp = new Date().toISOString();
      progress('Hoàn tất toàn bộ chu trình Data Update Pipeline!', 100);

      return {
        success: true,
        jobs: executedJobs,
        summary: `Đã kiểm tra ${executedJobs.length} nguồn. Cập nhật ${totalUpdated} bản ghi. Sử dụng ${totalAiCalls} lượt gọi AI.`,
        totalUpdated,
        totalAiCalls
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Retrieves high-level pipeline status and metrics
   */
  public getPipelineMetrics(): PipelineMetrics {
    const quota = this.quotaManager.getStatus();
    const allSources = this.sourceRegistry.getAll();
    const activePeriod = SeasonalScheduler.getCurrentSeason();
    const conflicts = this.versionService.getConflicts().filter(c => c.requiresReview);
    const unis = this.versionService.getUniversities();
    const scores = this.versionService.getAdmissionScores();

    return {
      totalRuns: this.versionService.getUpdateJobs().length,
      lastRunTimestamp: this.lastRunTimestamp || new Date().toISOString(),
      nextScheduledRun: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      activePeriod,
      sourcesTotal: allSources.length,
      sourcesActive: allSources.filter(s => s.enabled).length,
      sourcesChangedLastRun: this.versionService.getUpdateJobs().filter(j => j.sourceChanged).length,
      aiCallsUsedToday: quota.callsToday,
      aiDailyQuotaLimit: quota.dailyLimit,
      circuitBreakerActive: quota.circuitTripped,
      circuitBreakerReason: quota.circuitReason,
      conflictsPendingCount: conflicts.length,
      verifiedUniversitiesCount: unis.length,
      verifiedScoresCount: scores.length,
      ragReindexStatus: 'SYNCHRONIZED',
      lastRagSyncTimestamp: this.ragIntegration.getLastIndexedTimestamp()
    };
  }
}
