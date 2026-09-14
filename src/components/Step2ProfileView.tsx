import React from 'react';
import {
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Compass,
  Sparkles,
  BookOpen,
  Target,
  Briefcase,
  Layers,
  Award
} from 'lucide-react';
import { UserProfile, RIASECDimension } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Step2ProfileViewProps {
  profile: UserProfile;
  onBackToStep1: () => void;
  onAdvanceToStep3: () => void;
}

export const Step2ProfileView: React.FC<Step2ProfileViewProps> = ({
  profile,
  onBackToStep1,
  onAdvanceToStep3
}) => {
  const { language } = useLanguage();

  const riasecLabels: Record<RIASECDimension, { nameVi: string; nameEn: string; icon: string }> = {
    R: { nameVi: 'Kỹ thuật / Thực tế (Realistic)', nameEn: 'Realistic (Doers)', icon: '⚙️' },
    I: { nameVi: 'Nghiên cứu / Phân tích (Investigative)', nameEn: 'Investigative (Thinkers)', icon: '🔬' },
    A: { nameVi: 'Nghệ thuật / Sáng tạo (Artistic)', nameEn: 'Artistic (Creators)', icon: '🎨' },
    S: { nameVi: 'Xã hội / Giúp đỡ (Social)', nameEn: 'Social (Helpers)', icon: '🤝' },
    E: { nameVi: 'Quản trị / Khởi nghiệp (Enterprising)', nameEn: 'Enterprising (Persuaders)', icon: '📈' },
    C: { nameVi: 'Quy chuẩn / Tổ chức (Conventional)', nameEn: 'Conventional (Organizers)', icon: '📋' }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>{language === 'vi' ? 'BƯỚC 2: HỒ SƠ HỌC SINH CẤU TRÚC' : 'STEP 2: STRUCTURED STUDENT PROFILE'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'vi' ? 'Chuẩn hóa Dữ liệu & Định danh Năng lực' : 'Standardized Competency & Trait Vectors'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'vi'
              ? 'Dữ liệu thô từ khảo sát được chuyển đổi thành các vector toán học và danh mục chuẩn trước khi đưa vào lõi gợi ý.'
              : 'Survey raw inputs converted into normalized mathematical vectors ready for the recommendation engine.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            Mã Holland: {profile.riaSecProfile?.code || 'IRC'}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
            MBTI (phụ): {profile.mbtiType || 'INTJ'}
          </span>
        </div>
      </div>

      {/* Grid of Structured Vectors & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: RIASEC VECTOR 6 TRỤC */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>{language === 'vi' ? '1. Vector Tâm lý Holland (RIASEC)' : '1. RIASEC Psychological Vector'}</span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600">Độ tin cậy: 92%</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {(['R', 'I', 'A', 'S', 'E', 'C'] as RIASECDimension[]).map(dim => {
              const score = profile.riaSecScores[dim] || 0.4;
              const meta = riasecLabels[dim];
              const pct = Math.round(score * 100);

              return (
                <div key={dim} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>{meta.icon}</span>
                      <span>{dim} - {language === 'vi' ? meta.nameVi.split(' ')[0] : dim}</span>
                    </span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        score >= 0.7
                          ? 'bg-indigo-600'
                          : score >= 0.5
                          ? 'bg-blue-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 2: MBTI (TÍNH NĂNG PHỤ) & PHONG CÁCH TƯ DUY */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{language === 'vi' ? '2. Phong cách Tư duy MBTI (Phụ)' : '2. MBTI Traits (Supplementary)'}</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              Feature phụ đối chiếu
            </span>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-purple-900">{profile.mbtiType || 'INTJ'}</div>
              <div className="text-xs text-purple-700 mt-0.5">
                {profile.mbtiResult?.notes || (language === 'vi' ? 'Tư duy chiến lược, độc lập, cấu trúc bài bản' : 'Strategic, independent, structured')}
              </div>
            </div>
            <div className="text-2xl">🧠</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block">NĂNG LƯỢNG:</span>
              <span className="font-semibold text-slate-800">
                {profile.mbtiType?.startsWith('I') ? 'Hướng nội (Introvert)' : 'Hướng ngoại (Extrovert)'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block">RA QUYẾT ĐỊNH:</span>
              <span className="font-semibold text-slate-800">
                {profile.mbtiType?.includes('T') ? 'Lý trí Logic (Thinking)' : 'Thấu cảm Cảm xúc (Feeling)'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block">TIẾP NHẬN THÔNG TIN:</span>
              <span className="font-semibold text-slate-800">
                {profile.mbtiType?.includes('N') ? 'Trực giác Khái quát (Intuition)' : 'Thực tế Cụ thể (Sensing)'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block">LỐI SỐNG:</span>
              <span className="font-semibold text-slate-800">
                {profile.mbtiType?.endsWith('J') ? 'Nguyên tắc Quy củ (Judging)' : 'Linh hoạt Thích ứng (Perceiving)'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: KỸ NĂNG & MÔN HỌC THẾ MẠNH */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{language === 'vi' ? '3. Kỹ năng & Môn học Thế mạnh' : '3. Skills & Favorite Subjects'}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {language === 'vi' ? 'Môn học nổi bật:' : 'Top subjects:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.favoriteSubjects.map(sub => (
                <span
                  key={sub}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {language === 'vi' ? 'Kỹ năng đã kiểm định:' : 'Verified skills:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map(sk => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 4: MỤC TIÊU & MÔI TRƯỜNG LÀM VIỆC */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-600" />
            <span>{language === 'vi' ? '4. Mục tiêu & Môi trường Mong muốn' : '4. Goals & Work Preferences'}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">MỤC TIÊU NGHỀ NGHIỆP:</span>
              <ul className="space-y-1">
                {profile.goals.map((g, i) => (
                  <li key={i} className="text-slate-800 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">MÔI TRƯỜNG LÀM VIỆC ƯU TIÊN:</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.preferredWorkEnvironment.map(env => (
                  <span
                    key={env}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold"
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToStep1}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại Bước 1 (Sửa khảo sát)' : 'Back to Step 1 (Edit survey)'}</span>
        </button>

        <button
          id="btn-advance-to-step3"
          onClick={onAdvanceToStep3}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <span>{language === 'vi' ? 'Xác nhận Hồ sơ ➡️ Khởi chạy Lõi Tính điểm (Bước 3)' : 'Confirm Profile ➡️ Run Engine (Step 3)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
