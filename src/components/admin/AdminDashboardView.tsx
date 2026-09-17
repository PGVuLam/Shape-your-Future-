import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Database,
  Cpu,
  History,
  Lock,
  LogOut,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  Sliders,
  Eye,
  KeyRound,
  ShieldCheck,
  Building2,
  Users,
  Award
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DataSource } from '../../services/data/types';

interface PipelineStatus {
  status: string;
  isPipelineRunning: boolean;
  lastUpdateRun: string;
  currentVersion: string;
  totalVersions: number;
  enabledSourcesCount: number;
  totalSourcesCount: number;
  pendingConflictsCount: number;
  dataYear: number;
  verificationStatus: string;
}

interface ConflictItem {
  id: string;
  type: 'SCORE' | 'PROGRAM' | 'TUITION';
  universityId: string;
  universityName: string;
  majorName: string;
  currentValue: string;
  newValue: string;
  sourceUrl: string;
  sourceName: string;
  detectedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface VersionItem {
  versionId: string;
  versionNumber: number;
  publishedAt: string;
  publishedBy: string;
  changeSummary: string;
  totalRecordsCount: number;
}

interface AuditLogItem {
  id: string;
  timestamp: string;
  adminId: string;
  username: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  ip: string;
  details: Record<string, any>;
}

interface ActiveSessionItem {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
  isCurrent: boolean;
}

interface ServerAIConfigState {
  provider: 'gemini' | 'groq' | 'custom' | 'local';
  modelName: string;
  customEndpoint?: string;
  temperature: number;
  systemPromptStyle: 'strategic' | 'empathetic' | 'analytical' | 'balanced';
  safeOutputTokens: number;
  fallbackEnabled: boolean;
}

interface AdminDashboardViewProps {
  onBackToHome: () => void;
  onLogout?: () => void;
  onOpenDebugModal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToHome, onLogout, onOpenDebugModal }) => {
  const { adminUser, logout, fetchWithAuth, changePassword } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'ai' | 'security' | 'profile'>('overview');
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSessionItem[]>([]);
  const [aiConfig, setAIConfig] = useState<ServerAIConfigState | null>(null);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Logout handler that invalidates session and resets immediately back to initial home page
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      if (onLogout) {
        onLogout();
      } else {
        onBackToHome();
      }
    }
  };

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Helper notification
  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Fetch Pipeline Status
  const loadPipelineStatus = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/admin/data/status');
      if (res.ok) {
        const data = await res.json();
        setPipelineStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch status:', err);
    }
  }, [fetchWithAuth]);

  // 2. Fetch Sources
  const loadSources = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/admin/data/sources');
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
      }
    } catch (err) {
      console.warn('Failed to fetch sources:', err);
    }
  }, [fetchWithAuth]);

  // 3. Fetch Conflicts
  const loadConflicts = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/admin/data/conflicts');
      if (res.ok) {
        const data = await res.json();
        setConflicts(data.conflicts || []);
      }
    } catch (err) {
      console.warn('Failed to fetch conflicts:', err);
    }
  }, [fetchWithAuth]);

  // 4. Fetch Versions
  const loadVersions = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/admin/data/versions');
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch versions:', err);
    }
  }, [fetchWithAuth]);

  // 5. Fetch AI Config
  const loadAIConfig = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/admin/ai/config');
      if (res.ok) {
        const data = await res.json();
        setAIConfig(data.config);
      }
    } catch (err) {
      console.warn('Failed to fetch AI config:', err);
    }
  }, [fetchWithAuth]);

  // 6. Fetch Logs & Sessions
  const loadSecurityData = useCallback(async () => {
    try {
      const [logRes, sessRes] = await Promise.all([
        fetchWithAuth('/api/admin/audit-logs'),
        fetchWithAuth('/api/admin/sessions')
      ]);

      if (logRes.ok) {
        const d = await logRes.json();
        setAuditLogs(d.logs || []);
      }
      if (sessRes.ok) {
        const d = await sessRes.json();
        setActiveSessions(d.sessions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch security data:', err);
    }
  }, [fetchWithAuth]);

  // Initial load
  useEffect(() => {
    loadPipelineStatus();
    loadSources();
    loadConflicts();
    loadVersions();
    loadAIConfig();
    loadSecurityData();
  }, [loadPipelineStatus, loadSources, loadConflicts, loadVersions, loadAIConfig, loadSecurityData]);

  // Trigger Live Update Pipeline
  const handleTriggerUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetchWithAuth('/api/admin/data/update', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showNotice(data.summary || 'Đã chạy xong tiến trình quét dữ liệu đối soát.');
        loadPipelineStatus();
        loadConflicts();
        loadSecurityData();
      } else {
        showNotice(data.error || 'Cập nhật thất bại', 'error');
      }
    } catch (err: any) {
      showNotice(err?.message || 'Lỗi mạng khi cập nhật', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Verify conflict
  const handleVerifyConflict = async (conflictId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetchWithAuth('/api/admin/data/verify', {
        method: 'POST',
        body: JSON.stringify({ conflictId, action })
      });
      if (res.ok) {
        showNotice(action === 'APPROVE' ? 'Đã phê duyệt đề án tuyển sinh mới' : 'Đã bác bỏ thay đổi này');
        loadConflicts();
        loadPipelineStatus();
        loadSecurityData();
      }
    } catch (err) {
      showNotice('Không thể cập nhật trạng thái đối soát', 'error');
    }
  };

  // Publish staged changes
  const handlePublish = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/data/publish', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showNotice(`Đã ban hành phiên bản ${data.newVersion} thành công!`);
        loadPipelineStatus();
        loadConflicts();
        loadVersions();
        loadSecurityData();
      } else {
        showNotice(data.error || 'Xuất bản thất bại', 'error');
      }
    } catch (err) {
      showNotice('Lỗi khi xuất bản dữ liệu', 'error');
    }
  };

  // Toggle Source
  const handleToggleSource = async (sourceId: string, enabled: boolean) => {
    try {
      const res = await fetchWithAuth('/api/admin/data/sources/toggle', {
        method: 'POST',
        body: JSON.stringify({ sourceId, enabled })
      });
      if (res.ok) {
        setSources(prev => prev.map(s => (s.id === sourceId ? { ...s, enabled } : s)));
        showNotice(`Đã ${enabled ? 'kích hoạt' : 'tạm dừng'} nguồn ${sourceId}`);
        loadPipelineStatus();
      }
    } catch (err) {
      showNotice('Không thể thay đổi nguồn dữ liệu', 'error');
    }
  };

  // Reset Sources
  const handleResetSources = async () => {
    if (!confirm('Bạn có chắc chắn muốn khôi phục toàn bộ danh sách nguồn chính thức của Bộ GD&ĐT?')) return;
    try {
      const res = await fetchWithAuth('/api/admin/data/sources/reset', { method: 'POST' });
      if (res.ok) {
        showNotice('Đã khôi phục các nguồn chính thống.');
        loadSources();
        loadPipelineStatus();
      }
    } catch (err) {
      showNotice('Khôi phục nguồn thất bại', 'error');
    }
  };

  // Rollback Version
  const handleRollback = async (versionId: string) => {
    if (!confirm(`Xác nhận khôi phục về phiên bản ${versionId}?`)) return;
    try {
      const res = await fetchWithAuth('/api/admin/data/rollback', {
        method: 'POST',
        body: JSON.stringify({ versionId })
      });
      const data = await res.json();
      if (res.ok) {
        showNotice(`Đã khôi phục về phiên bản ${data.restoredVersion}`);
        loadPipelineStatus();
        loadSecurityData();
      } else {
        showNotice(data.error || 'Rollback thất bại', 'error');
      }
    } catch (err) {
      showNotice('Lỗi khi khôi phục phiên bản', 'error');
    }
  };

  // Save AI Config
  const handleSaveAIConfig = async () => {
    if (!aiConfig) return;
    try {
      const res = await fetchWithAuth('/api/admin/ai/config', {
        method: 'POST',
        body: JSON.stringify(aiConfig)
      });
      if (res.ok) {
        showNotice('Đã lưu cấu hình AI Model thành công.');
        loadSecurityData();
      } else {
        showNotice('Lưu cấu hình AI thất bại', 'error');
      }
    } catch (err) {
      showNotice('Lỗi khi lưu cấu hình AI', 'error');
    }
  };

  // Revoke other sessions
  const handleRevokeOtherSessions = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/sessions/revoke-others', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showNotice(data.message || 'Đã hủy các phiên khác.');
        loadSecurityData();
      }
    } catch (err) {
      showNotice('Hủy phiên thất bại', 'error');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      showNotice('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      showNotice('Mật khẩu xác nhận không khớp', 'error');
      return;
    }
    if (newPass.length < 8) {
      showNotice('Mật khẩu mới phải có tối thiểu 8 ký tự', 'error');
      return;
    }

    setPassLoading(true);
    const res = await changePassword(currentPass, newPass);
    setPassLoading(false);

    if (res.success) {
      showNotice('Đổi mật khẩu thành công!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      showNotice(res.error || 'Đổi mật khẩu thất bại', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Shape Your Future! Admin Console
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quản trị Dữ liệu Tuyển sinh 2026 & AI Model
            </p>
          </div>
        </div>

        {/* User Status & Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700 flex items-center space-x-1.5"
            title="Quay lại Trang người học"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trang Người học</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Admin: <strong className="text-white">{adminUser?.username || 'admin'}</strong></span>
          </div>

          <button
            id="btn-admin-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
            title="Đăng xuất khỏi hệ thống và quay lại trang ban đầu"
          >
            {isLoggingOut ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-300" />
                <span>Đang đăng xuất...</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Đăng xuất</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      {message && (
        <div
          className={`fixed top-16 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700'
              : 'bg-rose-950/90 text-rose-200 border-rose-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tổng quan Hệ thống</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Database className="w-4 h-4" />
                <span>Tuyển sinh & Pipeline</span>
              </div>
              {conflicts.filter(c => c.status === 'PENDING').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {conflicts.filter(c => c.status === 'PENDING').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Cấu hình AI Model</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Nhật ký & Bảo mật</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đổi Mật khẩu Admin</span>
            </button>

            {onOpenDebugModal && (
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  id="btn-admin-open-khkt"
                  onClick={onOpenDebugModal}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-300 hover:text-white hover:bg-purple-900/40 border border-purple-800/50 transition-all cursor-pointer shadow-xs"
                  title="Mở Bảng Kiểm định Thuật toán & Vector MCDM cho Ban Giám khảo KHKT"
                >
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Giám khảo KHKT</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick System Badge */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo mật Server-side</span>
            </div>
            <p className="leading-relaxed">
              Tất cả API quản trị được bảo vệ bởi middleware xác thực phiên. Mọi hành động được ghi trong nhật ký kiểm toán.
            </p>
          </div>
        </aside>

        {/* Dynamic Tab Body */}
        <main className="flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Phiên bản Tuyển sinh
                  </span>
                  <div className="text-xl font-black text-white flex items-center space-x-2">
                    <span>{pipelineStatus?.currentVersion || '2026.1.0'}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                      2026
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Đã chuẩn hóa đề án thi mới
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Chờ Phê duyệt
                  </span>
                  <div className="text-xl font-black text-amber-400">
                    {conflicts.filter(c => c.status === 'PENDING').length} mục
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Điểm sàn & ngành cập nhật
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Nguồn Đang Hoạt động
                  </span>
                  <div className="text-xl font-black text-indigo-400">
                    {sources.filter(s => s.enabled).length} / {sources.length}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bộ GD&ĐT và các trường ĐH
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Mô hình AI Active
                  </span>
                  <div className="text-xl font-black text-emerald-400 truncate">
                    {aiConfig?.modelName || 'gemini-3.8-flash'}
                  </div>
                  <p className="text-[11px] text-slate-500 capitalize">
                    Provider: {aiConfig?.provider || 'Gemini'}
                  </p>
                </div>
              </div>

              {/* Action Alert Bar */}
              <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-5 rounded-2xl border border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Quy trình Quản trị Tuyển sinh 2026</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Kích hoạt quét đối soát dữ liệu điểm sàn, xem xét các đề án tuyển sinh mới và xuất bản phiên bản chuẩn hóa cho học sinh tra cứu.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onOpenDebugModal && (
                    <button
                      id="btn-admin-overview-khkt"
                      onClick={onOpenDebugModal}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                      title="Mở Bảng Kiểm định Thuật toán & Vector MCDM cho Ban Giám khảo KHKT"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Giám khảo KHKT</span>
                    </button>
                  )}
                  <button
                    onClick={handleTriggerUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>{isUpdating ? 'Đang cập nhật...' : 'Quét Dữ liệu Mới'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Pending Table */}
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Hàng đợi Đề án & Điểm sàn Chờ Phê duyệt</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                  >
                    <span>Xem toàn bộ ({conflicts.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {conflicts.filter(c => c.status === 'PENDING').length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Hiện không có đề án tuyển sinh nào cần duyệt. Toàn bộ dữ liệu 2026 đã đồng bộ.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {conflicts
                      .filter(c => c.status === 'PENDING')
                      .slice(0, 3)
                      .map(item => (
                        <div key={item.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-bold text-white">{item.universityName}</div>
                            <div className="text-slate-400">{item.majorName}</div>
                            <div className="text-[11px] text-amber-300/90 mt-0.5">
                              Đề xuất: {item.newValue}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => handleVerifyConflict(item.id, 'APPROVE')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleVerifyConflict(item.id, 'REJECT')}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Bỏ qua
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PIPELINE & DATA VERIFICATION */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Quản trị Tiến trình Thu thập & Đối soát Dữ liệu
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tất cả các thay đổi đều nằm trong vùng đệm (Staging) cho đến khi Quản trị viên bấm Xuất bản.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={handleTriggerUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>Quét Cập nhật</span>
                  </button>

                  <button
                    onClick={handlePublish}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Xuất bản Bản mới</span>
                  </button>
                </div>
              </div>

              {/* Pending Verification Table */}
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Các mục cần Kiểm duyệt & Xác thực (Staged Conflicts)</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    {conflicts.filter(c => c.status === 'PENDING').length} đang chờ
                  </span>
                </div>

                {conflicts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Không có đề án tuyển sinh nào đang chờ kiểm duyệt.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold">
                          <th className="py-3 px-2">Cơ sở Đào tạo & Ngành</th>
                          <th className="py-3 px-2">Dữ liệu Hiện tại</th>
                          <th className="py-3 px-2">Dữ liệu Mới Phát hiện</th>
                          <th className="py-3 px-2">Nguồn trích xuất</th>
                          <th className="py-3 px-2 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {conflicts.map(c => (
                          <tr key={c.id} className="hover:bg-slate-900/40">
                            <td className="py-3 px-2">
                              <div className="font-bold text-white">{c.universityName}</div>
                              <div className="text-slate-400">{c.majorName}</div>
                            </td>
                            <td className="py-3 px-2 text-slate-400">{c.currentValue}</td>
                            <td className="py-3 px-2 font-bold text-amber-300">{c.newValue}</td>
                            <td className="py-3 px-2">
                              <a
                                href={c.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline flex items-center space-x-1"
                              >
                                <span>{c.sourceName}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                            <td className="py-3 px-2 text-right">
                              {c.status === 'PENDING' ? (
                                <div className="inline-flex items-center space-x-2">
                                  <button
                                    onClick={() => handleVerifyConflict(c.id, 'APPROVE')}
                                    className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 font-bold cursor-pointer"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleVerifyConflict(c.id, 'REJECT')}
                                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium cursor-pointer"
                                  >
                                    Bỏ qua
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {c.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Source Management Table */}
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Danh mục Nguồn Dữ liệu Chính thống (Bộ & Đại học)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Chỉ thu thập từ các nguồn được kích hoạt (Enabled)
                    </p>
                  </div>

                  <button
                    onClick={handleResetSources}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục Mặc định</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-2.5 px-2">Tên Cổng Thông tin</th>
                        <th className="py-2.5 px-2">Cơ quan</th>
                        <th className="py-2.5 px-2">Chu kỳ quét</th>
                        <th className="py-2.5 px-2 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sources.map(s => (
                        <tr key={s.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-2 font-semibold text-white">
                            <div className="flex items-center space-x-1.5">
                              <span>{s.name}</span>
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-slate-400">
                            {s.sourceType === 'MINISTRY_OFFICIAL' ? 'Bộ GD&ĐT' : 'Trường ĐH'}
                          </td>
                          <td className="py-2.5 px-2 text-slate-400">{s.updateFrequencyDays} ngày/lần</td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              onClick={() => handleToggleSource(s.id, !s.enabled)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                                s.enabled
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {s.enabled ? 'Đang bật' : 'Đã tắt'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Version History & Rollback */}
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-5 space-y-4">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Lịch sử các Phiên bản Dữ liệu Tuyển sinh</span>
                </h4>

                <div className="space-y-3">
                  {versions.map(v => (
                    <div
                      key={v.versionId}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-white">{v.versionId}</span>
                          <span className="text-slate-400">({v.totalRecordsCount} bản ghi)</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(v.publishedAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{v.changeSummary}</p>
                      </div>

                      <button
                        onClick={() => handleRollback(v.versionId)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Khôi phục (Rollback)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CONFIGURATION */}
          {activeTab === 'ai' && (
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Cấu hình Mô hình Trí tuệ Nhân tạo (AI Counselor)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Chỉ Quản trị viên mới có thể điều chỉnh nhà cung cấp mô hình, phong cách tư vấn và giới hạn an toàn.
                  API keys luôn được lưu trữ bảo mật trên máy chủ và không bao giờ gửi về client.
                </p>
              </div>

              {aiConfig && (
                <div className="space-y-5">
                  {/* Provider Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Nhà cung cấp Mô hình (Provider)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setAIConfig({ ...aiConfig, provider: 'gemini', modelName: 'gemini-3.8-flash' })}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          aiConfig.provider === 'gemini'
                            ? 'bg-indigo-950/80 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Google Gemini</div>
                        <div className="text-[11px] text-slate-400 mt-1">Mặc định: gemini-3.8-flash</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAIConfig({ ...aiConfig, provider: 'groq', modelName: 'llama-3.3-70b-versatile' })}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          aiConfig.provider === 'groq'
                            ? 'bg-indigo-950/80 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Groq Cloud (Fast Tier)</div>
                        <div className="text-[11px] text-slate-400 mt-1">Tốc độ siêu nhanh, miễn phí</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAIConfig({ ...aiConfig, provider: 'custom', modelName: 'qwen2.5:7b' })}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          aiConfig.provider === 'custom' || aiConfig.provider === 'local'
                            ? 'bg-indigo-950/80 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Local LLM / Ollama</div>
                        <div className="text-[11px] text-slate-400 mt-1">Chạy riêng tư trên máy chủ nội bộ</div>
                      </button>
                    </div>
                  </div>

                  {/* Model Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Tên Mô hình (Model Name)
                    </label>
                    <input
                      type="text"
                      value={aiConfig.modelName}
                      onChange={e => setAIConfig({ ...aiConfig, modelName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Custom Endpoint if provider === custom */}
                  {(aiConfig.provider === 'custom' || aiConfig.provider === 'local') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Endpoint Local / Ollama (URL)
                      </label>
                      <input
                        type="text"
                        value={aiConfig.customEndpoint || ''}
                        onChange={e => setAIConfig({ ...aiConfig, customEndpoint: e.target.value })}
                        placeholder="http://localhost:11434"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {/* Temperature & Token Limits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        <span>Độ sáng tạo (Temperature)</span>
                        <span className="text-indigo-400">{aiConfig.temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={aiConfig.temperature}
                        onChange={e => setAIConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-500"
                      />
                      <span className="text-[10px] text-slate-500">Khuyên dùng: 0.6 - 0.7 cho tư vấn tuyển sinh</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Phong cách Tư vấn (Prompt Persona)
                      </label>
                      <select
                        value={aiConfig.systemPromptStyle}
                        onChange={e => setAIConfig({ ...aiConfig, systemPromptStyle: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      >
                        <option value="balanced">Cân bằng & Thực tế (Mặc định)</option>
                        <option value="strategic">Chiến lược & Định hướng Dài hạn</option>
                        <option value="empathetic">Thấu hiểu & Khích lệ Tinh thần</option>
                        <option value="analytical">Phân tích Số liệu & Điểm chuẩn</option>
                      </select>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleSaveAIConfig}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-2 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Cấu hình Mô hình</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT LOGS & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Active Sessions Box */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Phiên Đăng nhập Quản trị Đang Hoạt động</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tự động hết hạn sau 30 phút không hoạt động hoặc 8 giờ tối đa.
                    </p>
                  </div>

                  <button
                    onClick={handleRevokeOtherSessions}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy Tất cả Phiên khác
                  </button>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {activeSessions.map(sess => (
                    <div key={sess.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">IP: {sess.ip}</span>
                          {sess.isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                              Phiên hiện tại
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 truncate max-w-md block">
                          Thiết bị: {sess.userAgent}
                        </span>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        Hoạt động: {new Date(sess.lastActivityAt).toLocaleTimeString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Logs Table */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Nhật ký Kiểm toán Hệ thống (Audit Logs)</span>
                  </h4>
                  <span className="text-xs text-slate-400">{auditLogs.length} sự kiện gần nhất</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-2.5 px-2">Thời gian</th>
                        <th className="py-2.5 px-2">Admin</th>
                        <th className="py-2.5 px-2">Hành động</th>
                        <th className="py-2.5 px-2">Đối tượng</th>
                        <th className="py-2.5 px-2">Kết quả</th>
                        <th className="py-2.5 px-2 text-right">IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="py-2 px-2 text-slate-400 text-[11px]">
                            {new Date(log.timestamp).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-2 px-2 text-white font-sans font-bold">{log.username}</td>
                          <td className="py-2 px-2 font-bold text-indigo-300">{log.action}</td>
                          <td className="py-2 px-2 text-slate-400">{log.resource}</td>
                          <td className="py-2 px-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              log.result === 'SUCCESS'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-rose-950 text-rose-300'
                            }`}>
                              {log.result}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right text-slate-400">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN PROFILE & PASSWORD CHANGE */}
          {activeTab === 'profile' && (
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 max-w-xl space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  <span>Đổi Mật khẩu Quản trị viên</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mật khẩu được mã hóa an toàn với thuật toán bcrypt (Salt rounds: 10). Không bao giờ lưu trữ mật khẩu gốc.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mật khẩu Hiện tại
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mật khẩu Mới (Tối thiểu 8 ký tự)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Xác nhận Mật khẩu Mới
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={passLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-2 shadow-md disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{passLoading ? 'Đang cập nhật...' : 'Cập nhật Mật khẩu Mới'}</span>
                  </button>
                </div>
              </form>

              {/* Session Termination & Logout Box */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Phiên làm việc hiện tại</h4>
                    <p className="text-[11px] text-slate-400">
                      Tài khoản: <strong className="text-white">{adminUser?.username}</strong> • Vai trò: <span className="text-indigo-400 font-bold">ADMIN</span>
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang đăng xuất...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất & Về trang chủ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
