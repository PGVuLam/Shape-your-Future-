import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginViewProps {
  onBackToHome: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onBackToHome,
  onLoginSuccess
}) => {
  const { login, isLoading: isAuthLoading } = useAdminAuth();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(username.trim(), password);

      if (res.success) {
        setIsSuccess(true);
        // Display reassuring confirmation frame and transition into admin console
        setTimeout(() => {
          onLoginSuccess();
        }, 400);
      } else {
        setErrorMessage(res.error || 'Thông tin đăng nhập không hợp lệ.');
        if (res.locked) {
          setIsLocked(true);
        }
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage('Không thể kết nối đến máy chủ xác thực.');
      setIsSubmitting(false);
    }
  };

  const isPending = isSubmitting || isAuthLoading;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang người học</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-lg mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Cổng Quản trị Hệ thống
          </h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Xác thực tài khoản có thẩm quyền Quản trị viên (ADMIN) để quản lý tuyển sinh, dữ liệu và AI model.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-700/80">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error Message */}
            {errorMessage && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-start space-x-3 border ${
                  isLocked
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    {isLocked ? 'Tài khoản bị tạm khóa' : 'Đăng nhập thất bại'}
                  </span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Tên Quản trị viên (Username)
              </label>
              <div className="relative rounded-2xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Mật khẩu (Password)
              </label>
              <div className="relative rounded-2xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 flex items-start space-x-2.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Máy chủ kích hoạt bảo vệ chống Brute-force: Tự động khóa 15 phút nếu sai liên tiếp 5 lần và ghi nhận IP trong Audit Log.
              </span>
            </div>

            {/* Success Confirmation Frame */}
            {isSuccess && (
              <div className="p-4 rounded-2xl text-xs flex items-center space-x-3 bg-emerald-950/70 text-emerald-200 border border-emerald-600/80 shadow-lg shadow-emerald-950/50 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-white text-sm block">
                    Xác thực Quản trị viên thành công!
                  </span>
                  <p className="text-emerald-300 text-[11px]">
                    Khởi tạo phiên bảo mật và chuyển hướng đến Bảng điều khiển...
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                id="btn-admin-submit-login"
                type="submit"
                disabled={isPending || isSuccess}
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-extrabold text-white transition-all cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-600 shadow-emerald-900/50'
                    : 'bg-indigo-600 hover:bg-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed'
                }`}
              >
                {isSuccess ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Đã xác thực • Đang vào hệ thống...</span>
                  </div>
                ) : isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang xác thực an toàn...</span>
                  </div>
                ) : (
                  'Đăng nhập Quyền Quản trị'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Disclaimer */}
        <p className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>Shape Your Future! Security & RBAC Enforcement Layer</span>
        </p>
      </div>
    </div>
  );
};
