import React from 'react';
import { X, Network, CheckCircle2, ArrowDown, ArrowRight, Sparkles, BookOpen, BrainCircuit, BarChart3, Database, ShieldCheck, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  currentStep
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                SƠ ĐỒ KIẾN TRÚC QUY TRÌNH KIỂM TRA 4 BƯỚC TUẦN TỰ
              </h2>
              <p className="text-xs text-slate-300">
                Quy trình thi cử tuần tự chuẩn hóa: Trang 1 (Thông tin & Điểm thi) ➡️ Trang 2 (RIASEC) ➡️ Trang 3 (MBTI) ➡️ Trang 4 (Top Nghề, Top Trường & Cố vấn Local LLM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 text-xs">
          {/* Active Step Indicator Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-200/80 font-semibold text-indigo-900">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              <span>
                Vị trí hiện tại trong quy trình thi cử: TRANG {currentStep}/4
              </span>
            </div>
            <span className="text-[11px] text-indigo-700 font-normal hidden sm:inline">
              Thực hiện tuần tự có quy tắc, không nhảy cóc
            </span>
          </div>

          {/* Sequential 4-Step Diagram */}
          <div className="space-y-4">
            {/* Start Node */}
            <div className="flex justify-center">
              <div className="px-6 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-sm flex items-center space-x-2">
                <span>🏠</span>
                <span>GIAO DIỆN TRANG CHỦ — NÚT BẮT ĐẦU KIỂM TRA</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Step 1 Node */}
            <div className={`p-4 rounded-2xl border transition-all ${
              currentStep === 1
                ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-300'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[10px]">
                  TRANG 1: THU THẬP THÔNG TIN CƠ BẢN & NĂNG LỰC HỌC TẬP
                </span>
                {currentStep > 1 && <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Đã hoàn thành</span>}
              </div>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Thông tin:</strong> Họ tên, tuổi, giới tính, tỉnh thành (63 tỉnh/thành VN), khối lớp.<br/>
                • <strong>Học tập:</strong> Môn yêu thích, môn tự tin điểm cao nhất, học lực trung bình (GPA).<br/>
                • <strong>Kỳ thi:</strong> Đánh giá năng lực HSA (ĐHQG HN), V-ACT (ĐHQG TP.HCM), Đánh giá tư duy TSA (Bách Khoa), Sư phạm, Điểm thi tốt nghiệp THPTQG.<br/>
                • <strong>Kỹ năng & Môi trường:</strong> Kỹ năng sở trường, môi trường làm việc mong muốn, tình trạng định hướng nghề nghiệp.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Step 2 Node */}
            <div className={`p-4 rounded-2xl border transition-all ${
              currentStep === 2
                ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-300'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px]">
                  TRANG 2: BÀI KIỂM TRA RIASEC CHUẨN FORM
                </span>
                {currentStep > 2 && <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Đã hoàn thành</span>}
              </div>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Đánh giá 6 nhóm Holland:</strong> Thực tế (R), Nghiên cứu (I), Nghệ thuật (A), Xã hội (S), Quản lý (E), Quy chuẩn (C).<br/>
                • <strong>Kết quả độc lập:</strong> Mã Holland 3 chữ cái, biểu đồ radar 6 trục, phân tích đặc trưng tâm lý sở thích.<br/>
                • <em>Nguyên tắc nghiêm ngặt:</em> Chưa vội tư vấn nghề nghiệp tại bước này.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Step 3 Node */}
            <div className={`p-4 rounded-2xl border transition-all ${
              currentStep === 3
                ? 'bg-purple-50/90 border-purple-500 shadow-md ring-2 ring-purple-300'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-bold text-[10px]">
                  TRANG 3: BÀI KIỂM TRA MBTI CHUẨN FORM
                </span>
                {currentStep > 3 && <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Đã hoàn thành</span>}
              </div>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Đánh giá 4 cặp đối lập:</strong> Hướng nội/ngoại (I/E), Trực giác/Thực tế (N/S), Lý trí/Cảm xúc (T/F), Nguyên tắc/Linh hoạt (J/P).<br/>
                • <strong>Kết quả độc lập:</strong> Xác định 1 trong 16 hình mẫu tính cách MBTI (VD: INTJ, ENFP...), phân tích phong cách tư duy độc lập.<br/>
                • <em>Nguyên tắc nghiêm ngặt:</em> Chưa vội tư vấn nghề nghiệp tại bước này.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Step 4 Node */}
            <div className={`p-4 rounded-2xl border transition-all ${
              currentStep === 4
                ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                  TRANG 4: TỔNG HỢP TOÀN DIỆN, TOP TRƯỜNG & CỐ VẤN MODEL LLM
                </span>
                {currentStep === 4 && <span className="text-emerald-600 font-bold flex items-center gap-1">★ Giai đoạn hoàn thiện</span>}
              </div>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Thuật toán tính điểm khoa học:</strong> Tổng hòa RIASEC (30%) + Điểm thi HSA/TSA/THPT (25%) + Kỹ năng (20%) + MBTI (15%) + Kỳ vọng (10%).<br/>
                • <strong>Top Ngành nghề:</strong> Điểm số % tương thích, giải thích minh bạch, khoảng trống kỹ năng (Skill Gap).<br/>
                • <strong>Gợi ý Trường Đại học:</strong> Nhóm 1 (Top 1 Trọng điểm: Bách Khoa, ĐHQG HN, ĐHQG TP.HCM, Ngoại thương, Kinh tế Quốc dân...) và Nhóm 2 (Top 2 & Chuyên sâu: PTIT, Sư phạm Kỹ thuật, FPT, Cần Thơ...) đối sánh với điểm thi thực tế.<br/>
                • <strong>Bộ chọn Model LLM:</strong> Local LLM (Chạy trực tiếp trên trình duyệt, bảo mật 100% offline) hoặc Cloud Gemini 3.8 Flash.<br/>
                • <strong>Chatbot Hỏi đáp Chuyên sâu:</strong> Tương tác như ChatGPT, giải đáp mọi thắc mắc về tuyển sinh, cơ hội việc làm, học bổng.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đảm bảo quy tắc thi cử tuần tự nghiêm ngặt — Dữ liệu chuẩn hóa 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng sơ đồ
          </button>
        </div>
      </div>
    </div>
  );
};
