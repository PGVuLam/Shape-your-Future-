import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { useLanguage } from '../context/LanguageContext';

interface HomeLandingViewProps {
  onStartExam: () => void;
  onLoadDemoProfile: (profile: UserProfile) => void;
  activeProfile: UserProfile;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onStartExam,
  onLoadDemoProfile,
  activeProfile
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6 sm:py-10">
      {/* Hero Welcome Section - Styled precisely to match image */}
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
        {/* Centered Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50/90 text-indigo-700 border border-indigo-100 text-xs sm:text-sm font-semibold shadow-2xs">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Hệ thống tư vấn hướng nghiệp thông minh</span>
        </div>

        {/* Main 2-Line Headline */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
            Khám phá hiện tại
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-indigo-600 tracking-tight">
            Định hướng tương lai
          </h2>
        </div>

        {/* Subtitle Description */}
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Mô hình kiến trúc thông minh kết hợp Cơ sở tri thức nghề nghiệp, thuật toán đối sánh đa yếu tố (MCDM) và Cố vấn AI cục bộ.
        </p>

        {/* Centered Call-to-action Start Button */}
        <div className="pt-3 flex justify-center items-center">
          <div className="relative group inline-block">
            {/* Ambient subtle glow aura */}
            <div
              className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200"
              aria-hidden="true"
            />

            {/* Main Button */}
            <button
              id="btn-start-examination"
              type="button"
              onClick={onStartExam}
              className="relative px-10 sm:px-12 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center space-x-3 shadow-xl shadow-indigo-600/25 hover:shadow-2xl hover:shadow-indigo-600/35 transition-all duration-300 transform hover:scale-[1.025] active:scale-[0.985] cursor-pointer overflow-hidden"
            >
              {/* Subtle inner sheen light highlight */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <Sparkles className="w-5 h-5 text-indigo-200 group-hover:text-amber-300 transition-colors shrink-0" />
              <span className="tracking-wide">BẮT ĐẦU KHẢO SÁT NGAY</span>
              <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Examination Pipeline Flow Overview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Quy trình kiểm tra 4 bước chuyên nghiệp
          </h2>
          <div className="flex items-center self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/90 shadow-2xs whitespace-nowrap shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bảo mật & Chuẩn hóa</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Thông tin & Năng lực Học tập
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thu thập thông tin cá nhân, tỉnh thành, môn học yêu thích, điểm trung bình, điểm thi ĐGNL (HSA, V-ACT, TSA, Sư phạm, THPT) và kỹ năng sở trường.
            </p>
            <div className="text-[11px] font-semibold text-indigo-600 pt-1 flex items-center gap-1">
              <span>Đầu vào toàn diện</span>
            </div>
          </div>

          {/* Card Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Khảo sát RIASEC Chuẩn form
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bài đánh giá 6 nhóm sở thích nghề nghiệp Holland (R-I-A-S-E-C). Xác lập mã Holland 3 chữ cái và phân tích đặc trưng tâm lý (chưa vội tư vấn nghề).
            </p>
            <div className="text-[11px] font-semibold text-blue-600 pt-1 flex items-center gap-1">
              <span>Mã Holland & Radar</span>
            </div>
          </div>

          {/* Card Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-black flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Đánh giá Tính cách MBTI
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khảo sát 4 cặp đối lập tâm lý (I/E, S/N, T/F, J/P). Định danh 1 trong 16 nhóm tính cách MBTI và phân tích phong cách tư duy làm việc độc lập.
            </p>
            <div className="text-[11px] font-semibold text-purple-600 pt-1 flex items-center gap-1">
              <span>16 Nhóm Tính cách</span>
            </div>
          </div>

          {/* Card Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Tổng hợp, Top Trường & Cố vấn AI
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tổng hòa khoa học kết quả, tính điểm độ phù hợp nghề nghiệp, đề xuất các trường đại học Top & trường đào tạo phù hợp. Hỏi đáp chuyên sâu với Local LLM.
            </p>
            <div className="text-[11px] font-semibold text-emerald-600 pt-1 flex items-center gap-1">
              <span>Top Nghề, Trường & AI Chat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Core Guarantees & Features */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Bám sát Thực tế Tuyển sinh VN</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tích hợp đầy đủ các kỳ thi hiện đại: HSA, V-ACT, TSA, kỳ thi Sư phạm và điểm thi Tốt nghiệp THPT Quốc gia theo các tổ hợp môn.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Lựa chọn Model AI Đa dạng</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Hỗ trợ Local LLM (mô hình cục bộ an toàn, bảo mật dữ liệu học sinh) hoặc Cloud Gemini 3.8 Flash tốc độ cao.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Tính toán Minh bạch & Khách quan</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Thuật toán tính điểm tất định, dẫn chứng cụ thể từ điểm mạnh, khoảng trống kỹ năng đến môi trường làm việc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
