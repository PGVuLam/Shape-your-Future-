import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  Lock,
  RefreshCw,
  Award
} from 'lucide-react';

interface TransparencyData {
  title: string;
  dataYear: number;
  verifiedDate: string;
  verificationStatus: string;
  currentVersion: string;
  officialSourcesCount: number;
  authoritativeSources: Array<{
    name: string;
    url: string;
    sourceType: string;
    targetEntity: string;
    priority: number;
  }>;
  guarantee: string;
}

interface DataTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdminLogin?: () => void;
}

export const DataTransparencyModal: React.FC<DataTransparencyModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAdminLogin
}) => {
  const [data, setData] = useState<TransparencyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    fetch('/api/public/data-transparency')
      .then(res => res.json())
      .then(info => {
        if (isMounted) {
          setData(info);
          setLoading(false);
        }
      })
      .catch(err => {
        console.warn('Failed to load public transparency info:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Minh bạch Dữ liệu Tuyển sinh & Nguồn tin 2026
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
                  Năm 2026
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Cam kết dữ liệu xác thực, đối soát chính thức từ Bộ GD&ĐT và các trường Đại học
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/80 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-slate-700 text-sm">
          {/* Status Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Trạng thái Xác thực
                </span>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                  Đã duyệt bởi Hội đồng Tuyển sinh
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Phiên bản cơ sở dữ liệu: <strong className="text-emerald-700">{data?.currentVersion || '2026.1.0'}</strong>
                </p>
              </div>
            </div>

            <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">
                  Kỳ Tuyển sinh Áp dụng
                </span>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                  Mùa thi & Tuyển sinh 2026
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cập nhật theo đề án thi HSA, TSA & THPT mới
                </p>
              </div>
            </div>

            <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-200 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                  Nguồn Chính Thống
                </span>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                  {data?.officialSourcesCount || 20} Cổng Tuyển sinh & Bộ
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Chỉ lấy từ domain .edu.vn và .gov.vn
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-xs">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>CAM KẾT MINH BẠCH & TRÁCH NHIỆM HỌC THUẬT</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống EduPath AI cung cấp thông tin hướng nghiệp và tư vấn điểm chuẩn hoàn toàn miễn phí cho người học và phụ huynh.
              Dữ liệu được trích xuất trực tiếp từ cổng thông tin của Bộ Giáo dục & Đào tạo, các trường Đại học trọng điểm và được kiểm duyệt bởi Ban Cố vấn Quản trị trước khi ban hành.
            </p>
          </div>

          {/* Official Sources Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Danh mục Nguồn Dữ liệu Chính thức được Giám sát</span>
              </h4>
              <span className="text-[11px] font-semibold text-slate-500">
                Hiển thị {data?.authoritativeSources?.length || 12} nguồn tiêu biểu
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs">Đang tải danh mục nguồn chính thức...</span>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Cơ quan / Cơ sở Đào tạo</th>
                      <th className="p-3 hidden sm:table-cell">Phân loại</th>
                      <th className="p-3 hidden md:table-cell">Đối tượng Thu thập</th>
                      <th className="p-3 text-right">Cổng Chính thức</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data?.authoritativeSources?.map((src, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">
                          {src.name}
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            src.sourceType === 'MINISTRY_OFFICIAL'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : src.sourceType === 'UNIVERSITY_OFFICIAL'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {src.sourceType === 'MINISTRY_OFFICIAL' ? 'Bộ GD&ĐT' : 'Trường ĐH'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 hidden md:table-cell">
                          {src.targetEntity === 'admission_scores' ? 'Điểm sàn & Điểm chuẩn' : 'Ngành & Đề án TS'}
                        </td>
                        <td className="p-3 text-right">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors"
                          >
                            <span>Truy cập</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Access Policy Note */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-950">
              <Lock className="w-3.5 h-3.5" />
              <span>Chính sách Phân quyền & Quản trị Hệ thống:</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Người học và công chúng được tự do trải nghiệm mọi tính năng tư vấn, làm khảo sát và tra cứu mà không cần đăng ký tài khoản.
              Các tác vụ thay đổi dữ liệu, kích hoạt cập nhật (Data Update) hoặc cấu hình mô hình AI chỉ dành riêng cho tài khoản Quản trị viên (ADMIN) đã xác thực ở máy chủ.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          {onNavigateToAdminLogin ? (
            <button
              onClick={() => {
                onClose();
                onNavigateToAdminLogin();
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Dành cho Quản trị viên</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400">EduPath AI Data Verification Engine</span>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
