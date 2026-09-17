import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Database,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  Play,
  RotateCcw,
  Zap,
  Globe,
  Sliders,
  X,
  FileText,
  Search,
  ChevronRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { DataUpdateService } from '../services/data/dataUpdateService';
import {
  DataSource,
  UpdateJob,
  UpdateConflict,
  DataVersion,
  PipelineMetrics,
  AdmissionScoreRecord,
  UniversityRecord
} from '../services/data/types';

interface AdminDataPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  groqApiKey?: string;
}

export const AdminDataPipelineModal: React.FC<AdminDataPipelineModalProps> = ({
  isOpen,
  onClose,
  groqApiKey
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'conflicts' | 'database' | 'versions' | 'logs'>('overview');
  const [pipelineService] = useState<DataUpdateService>(() => DataUpdateService.getInstance(groqApiKey));

  const [metrics, setMetrics] = useState<PipelineMetrics>(() => pipelineService.getPipelineMetrics());
  const [sources, setSources] = useState<DataSource[]>(() => pipelineService.sourceRegistry.getAll());
  const [jobs, setJobs] = useState<UpdateJob[]>(() => pipelineService.versionService.getUpdateJobs());
  const [conflicts, setConflicts] = useState<UpdateConflict[]>(() => pipelineService.versionService.getConflicts());
  const [versions, setVersions] = useState<DataVersion[]>(() => pipelineService.versionService.getVersions());
  const [verifiedScores, setVerifiedScores] = useState<AdmissionScoreRecord[]>(() => pipelineService.versionService.getAdmissionScores());
  const [verifiedUnis, setVerifiedUnis] = useState<UniversityRecord[]>(() => pipelineService.versionService.getUniversities());

  // Pipeline Run State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [runLogs, setRunLogs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshLocalState = () => {
    setMetrics(pipelineService.getPipelineMetrics());
    setSources([...pipelineService.sourceRegistry.getAll()]);
    setJobs([...pipelineService.versionService.getUpdateJobs()]);
    setConflicts([...pipelineService.versionService.getConflicts()]);
    setVersions([...pipelineService.versionService.getVersions()]);
    setVerifiedScores([...pipelineService.versionService.getAdmissionScores()]);
    setVerifiedUnis([...pipelineService.versionService.getUniversities()]);
  };

  useEffect(() => {
    if (isOpen) {
      refreshLocalState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunPipeline = async (forceFetch = false) => {
    setIsRunning(true);
    setProgressPct(0);
    setProgressMsg('Bắt đầu khởi chạy Data Update Pipeline...');
    setRunLogs([`[${new Date().toLocaleTimeString()}] Khởi động chu trình kiểm tra nguồn dữ liệu tuyển sinh...`]);

    try {
      const res = await pipelineService.runPipeline({
        forceFetch,
        onProgress: (msg, pct) => {
          setProgressMsg(msg);
          setProgressPct(pct);
          setRunLogs(prev => [...prev.slice(-40), `[${new Date().toLocaleTimeString()}] ${msg}`]);
        }
      });

      refreshLocalState();
      setStatusMessage({
        type: res.success ? 'success' : 'error',
        text: res.summary
      });
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: `Lỗi thực thi pipeline: ${e?.message || e}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleSource = (sourceId: string) => {
    pipelineService.sourceRegistry.toggleEnabled(sourceId);
    refreshLocalState();
  };

  const handleResetSources = () => {
    pipelineService.sourceRegistry.resetToDefaults();
    refreshLocalState();
    setStatusMessage({
      type: 'success',
      text: 'Đã khôi phục toàn bộ danh sách nguồn dữ liệu chính thức theo chuẩn mới nhất!'
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleResolveConflict = (conflictId: string, action: 'ACCEPT_NEW' | 'KEEP_OLD') => {
    pipelineService.versionService.resolveConflict(conflictId, action);
    refreshLocalState();
    setStatusMessage({
      type: 'success',
      text: action === 'ACCEPT_NEW' ? 'Đã phê duyệt và cập nhật giá trị mới vào Database!' : 'Đã bác bỏ giá trị mới, giữ nguyên dữ liệu cũ.'
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleRollback = (versionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn Rollback cơ sở dữ liệu về phiên bản này?')) {
      const res = pipelineService.versionService.rollbackToVersion(versionId);
      refreshLocalState();
      setStatusMessage({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Filtered scores
  const filteredScores = verifiedScores.filter(s => {
    const matchesYear = !selectedYear || s.year === selectedYear;
    const matchesSearch =
      !searchTerm ||
      s.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.universityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.combination && s.combination.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesYear && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Trung tâm Cập nhật Dữ liệu Tuyển sinh & Hướng nghiệp
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pipeline Active</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Check Cheap → Fetch Only If Changed → AI Only If Needed → Validate → Version → RAG Grounding
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleRunPipeline(true)}
              disabled={isRunning}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer ${
                isRunning
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Đang cập nhật...' : 'Cập nhật Dữ liệu Ngay'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar when running */}
        {isRunning && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-2.5 shrink-0 flex items-center justify-between text-xs text-indigo-900 animate-pulse">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold truncate">{progressMsg}</span>
            </div>
            <div className="w-48 bg-indigo-200/80 rounded-full h-2 overflow-hidden shrink-0">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {statusMessage && (
          <div
            className={`px-6 py-2 text-xs font-semibold flex items-center space-x-2 border-b shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 space-x-1 shrink-0 overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng quan & Metrics', icon: TrendingUp },
            { id: 'sources', label: `Nguồn dữ liệu (${sources.length})`, icon: Globe },
            {
              id: 'conflicts',
              label: `Xung đột & Phê duyệt (${conflicts.filter(c => c.requiresReview).length})`,
              icon: AlertTriangle,
              badge: conflicts.filter(c => c.requiresReview).length
            },
            { id: 'database', label: `Kho Dữ liệu Xác thực (${verifiedScores.length})`, icon: Database },
            { id: 'versions', label: `Phiên bản & Rollback (${versions.length})`, icon: History },
            { id: 'logs', label: 'Nhật ký Thực thi (Live Logs)', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                    <span>MÙA TUYỂN SINH HIỆN TẠI</span>
                    <Clock className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="font-extrabold text-slate-900 text-lg">
                    {metrics.activePeriod === 'SCORE_RELEASE_PERIOD'
                      ? 'MÙA CÔNG BỐ ĐIỂM (T8-T9)'
                      : metrics.activePeriod === 'ADMISSION_PERIOD'
                      ? 'MÙA TUYỂN SINH (T3-T7)'
                      : 'GIAI ĐOẠN BÌNH THƯỜNG'}
                  </div>
                  <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                    Tần suất quét điểm: {metrics.activePeriod === 'SCORE_RELEASE_PERIOD' ? '1-3 ngày/lần' : '7-14 ngày/lần'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                    <span>HẠN MỨC AI QUOTA HÔM NAY</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-extrabold text-slate-900 text-lg">
                    {metrics.aiCallsUsedToday} / {metrics.aiDailyQuotaLimit} <span className="text-xs font-normal text-slate-500">lượt gọi</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(metrics.aiCallsUsedToday / metrics.aiDailyQuotaLimit) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                    <span>DỮ LIỆU ĐÃ XÁC THỰC</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="font-extrabold text-slate-900 text-lg">
                    {metrics.verifiedScoresCount} điểm chuẩn / {metrics.verifiedUniversitiesCount} trường
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    100% có xuất xứ nguồn & tem thời gian
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                    <span>CIRCUIT BREAKER & RAG</span>
                    <Database className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>RAG ĐỒNG BỘ: OK</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Circuit Breaker: {metrics.circuitBreakerActive ? '⚠️ Tạm ngắt do 429' : 'Bình thường (Sẵn sàng)'}
                  </p>
                </div>
              </div>

              {/* Architecture Blueprint Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>NGUYÊN TẮC HOẠT ĐỘNG & BẢO VỆ DỮ LIỆU CỦA PIPELINE</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">1. Kiểm tra Siêu Rẻ (Check Cheap)</span>
                    <p>So sánh ETag, Last-Modified & Content Hash. Nếu nguồn không đổi: <strong>dừng lại ngay lập tức (0 AI call)</strong>.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">2. Gọi AI Có Kiểm Soát (Quota Guard)</span>
                    <p>Chỉ chạy đơn luồng (max 1 concurrent), tự động fallback Qwen 27B → GPT-OSS 120B → Gemini → Parser luật cứng.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">3. Kiểm Định & Versioning Tuyệt Đối</span>
                    <p>Xác thực thang điểm (30/100/150/1200), phát hiện xung đột và tự động lưu Snapshot cho phép Rollback 1 chạm.</p>
                  </div>
                </div>
              </div>

              {/* Recent Jobs Table Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <span className="font-bold text-xs text-slate-800">CÁC TÁC VỤ CẬP NHẬT GẦN ĐÂY</span>
                  <span className="text-[11px] text-slate-500">Tối đa 10 tác vụ mới nhất</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {jobs.slice(0, 6).map(job => (
                    <div key={job.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center space-x-2">
                          <span>{job.sourceName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              job.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : job.status === 'SKIPPED_UNCHANGED'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {job.status === 'SKIPPED_UNCHANGED'
                              ? 'Không đổi (0 AI)'
                              : job.status === 'COMPLETED'
                              ? 'Đã cập nhật'
                              : 'Thất bại'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {new Date(job.startedAt).toLocaleString('vi-VN')} • {job.recordsUpdated} bản ghi cập nhật • {job.aiCallsCount} AI calls
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Chưa có tác vụ cập nhật nào được chạy. Hãy nhấn "Cập nhật Dữ liệu Ngay".
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOURCES REGISTRY */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Danh mục Nguồn Dữ liệu Chính Thức (Source Registry)</h3>
                  <p className="text-xs text-slate-500">Hệ thống nguồn chính quy: Bộ GD&ĐT &gt; Cổng Tuyển sinh Trường &gt; Cơ quan Nhà nước</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetSources}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    title="Khôi phục toàn bộ danh sách đường link cổng tuyển sinh chính thức mới nhất"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Khôi phục Nguồn Chuẩn (Reset)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3.5">Nguồn & Cơ quan ban hành</th>
                      <th className="p-3.5">Phân loại & Mục tiêu</th>
                      <th className="p-3.5">Chu kỳ kiểm tra</th>
                      <th className="p-3.5">Lần kiểm tra cuối</th>
                      <th className="p-3.5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sources.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 space-y-1 max-w-sm">
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-medium break-all"
                          >
                            <span>{s.url}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 text-indigo-500" />
                          </a>
                        </td>
                        <td className="p-3.5 space-y-1">
                          <div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                s.sourceType === 'MINISTRY_OFFICIAL'
                                  ? 'bg-purple-100 text-purple-800'
                                  : s.sourceType === 'UNIVERSITY_OFFICIAL'
                                  ? 'bg-blue-100 text-blue-800'
                                  : s.sourceType === 'GOVERNMENT'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {s.sourceType}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            Mục tiêu: {s.targetEntity}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {s.updateFrequencyDays} ngày/lần
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-500">
                          {s.lastCheckedAt ? new Date(s.lastCheckedAt).toLocaleString('vi-VN') : 'Chưa kiểm tra'}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleToggleSource(s.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              s.enabled
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {s.enabled ? 'Đang bật' : 'Tạm dừng'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONFLICTS & REVIEWS */}
          {activeTab === 'conflicts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Trung tâm Xử lý Xung đột & Phê duyệt (Conflict Review)</h3>
                  <p className="text-xs text-slate-500">
                    Khi điểm chuẩn hoặc thông tin từ các nguồn có sự sai lệch, hệ thống đưa vào danh sách chờ Admin duyệt.
                  </p>
                </div>
              </div>

              {conflicts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-800">Không có xung đột dữ liệu nào</h4>
                  <p className="text-xs text-slate-500">Toàn bộ dữ liệu tuyển sinh đều nhất quán và đã được xác thực hoàn toàn.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conflicts.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              c.status === 'PENDING_REVIEW'
                                ? 'bg-amber-100 text-amber-800'
                                : c.status === 'AUTO_RESOLVED' || c.status === 'MANUALLY_RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {c.status}
                          </span>
                          <span className="font-bold text-xs text-slate-900">Bản ghi: {c.recordId}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{new Date(c.detectedAt).toLocaleString('vi-VN')}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-bold text-slate-500 block uppercase">GIÁ TRỊ HIỆN TẠI (CŨ)</span>
                          <div className="font-extrabold text-slate-800 text-sm">
                            Điểm: {c.oldValue?.score || 'N/A'} (Thang {c.oldValue?.scale || 30})
                          </div>
                          <p className="text-[11px] text-slate-500">Nguồn: {c.oldSource?.publisher || 'Cơ sở dữ liệu gốc'}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                          <span className="text-[11px] font-bold text-indigo-700 block uppercase">GIÁ TRỊ MỚI PHÁT HIỆN</span>
                          <div className="font-extrabold text-indigo-900 text-sm">
                            Điểm: {c.newValue?.score || 'N/A'} (Thang {c.newValue?.scale || 30})
                          </div>
                          <p className="text-[11px] text-indigo-800/80">Nguồn: {c.newSource?.publisher || 'Nguồn mới'}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 italic">{c.resolutionNotes}</p>

                      {c.requiresReview && (
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => handleResolveConflict(c.id, 'ACCEPT_NEW')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Chấp thuận Giá trị Mới
                          </button>
                          <button
                            onClick={() => handleResolveConflict(c.id, 'KEEP_OLD')}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Giữ nguyên Giá trị Cũ
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VERIFIED DATABASE EXPLORER */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên trường, mã trường, ngành, tổ hợp môn..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600">Năm tuyển sinh:</span>
                  {[2026, 2025, 2024].map(y => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedYear === y
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3.5">Trường & Mã trường</th>
                      <th className="p-3.5">Chương trình / Ngành học</th>
                      <th className="p-3.5">Phương thức & Tổ hợp</th>
                      <th className="p-3.5">Điểm chuẩn</th>
                      <th className="p-3.5">Xuất xứ nguồn (Provenance)</th>
                      <th className="p-3.5 text-right">Xác thực</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredScores.map(score => (
                      <tr key={score.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          {score.universityName}
                          <span className="ml-1.5 text-[10px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded-md">
                            {score.universityCode}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-800 font-medium">
                          {score.programName}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-700">{score.method}</span>
                          {score.combination && (
                            <span className="ml-1 text-[11px] text-slate-500">({score.combination})</span>
                          )}
                        </td>
                        <td className="p-3.5 font-extrabold text-indigo-700 text-sm">
                          {score.score} <span className="text-[11px] font-normal text-slate-400">/ {score.scoreScale}đ</span>
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-500">
                          {score.provenance.publisher} (Năm {score.year})
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>VERIFIED</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredScores.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                          Không tìm thấy bản ghi nào khớp với điều kiện tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: VERSIONS & ROLLBACK */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Lịch sử Phiên bản Cơ sở Dữ liệu & Khôi phục (Rollback)</h3>
                <p className="text-xs text-slate-500">
                  Mỗi lần cập nhật thành công, hệ thống tự động lưu bản Snapshot hoàn chỉnh để có thể phục hồi dữ liệu bất kỳ lúc nào.
                </p>
              </div>

              <div className="space-y-3">
                {versions.map((ver, idx) => (
                  <div key={ver.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:border-indigo-200 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-sm">{ver.versionTag}</span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            Đang hoạt động (Active)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{ver.description}</p>
                      <p className="text-[11px] text-slate-400">
                        Tạo lúc: {new Date(ver.createdAt).toLocaleString('vi-VN')} • Số bản ghi: {ver.recordsCount} • Người tạo: {ver.createdBy}
                      </p>
                    </div>

                    {idx > 0 && (
                      <button
                        onClick={() => handleRollback(ver.id)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Rollback về bản này</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LIVE LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">Nhật ký Hệ thống (Real-time Pipeline Terminal)</span>
                <button
                  onClick={() => setRunLogs([])}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Xóa màn hình log
                </button>
              </div>
              <div className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-2xl h-[420px] overflow-y-auto space-y-1 shadow-inner border border-slate-800">
                {runLogs.length === 0 ? (
                  <p className="text-slate-500 italic">Chưa có nhật ký nào. Nhấn "Cập nhật Dữ liệu Ngay" để theo dõi luồng dữ liệu thời gian thực.</p>
                ) : (
                  runLogs.map((l, i) => (
                    <div key={i} className="leading-relaxed">
                      {l.includes('AI') ? (
                        <span className="text-amber-400">{l}</span>
                      ) : l.includes('lỗi') || l.includes('Thất bại') ? (
                        <span className="text-rose-400">{l}</span>
                      ) : l.includes('thành công') || l.includes('Hoàn tất') ? (
                        <span className="text-emerald-400">{l}</span>
                      ) : (
                        <span>{l}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
