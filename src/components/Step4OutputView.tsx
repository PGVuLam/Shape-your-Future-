import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  BookOpen,
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { UserProfile, Career, RecommendationScore } from '../types';
import { CAREER_LOCALIZATION } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';

interface Step4OutputViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
  onBackToStep3: () => void;
  onAdvanceToStep5: () => void;
}

export const Step4OutputView: React.FC<Step4OutputViewProps> = ({
  profile,
  recommendations,
  onSelectCareer,
  onBackToStep3,
  onAdvanceToStep5
}) => {
  const { language } = useLanguage();
  const top5 = recommendations.slice(0, 5);
  const [activeCareerIndex, setActiveCareerIndex] = useState<number>(0);

  const selectedRec = top5[activeCareerIndex] || top5[0];
  const selectedCareer = selectedRec?.career;
  const selectedLoc = selectedCareer ? CAREER_LOCALIZATION[selectedCareer.id] : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{'BƯỚC 4: BÁO CÁO KẾT QUẢ ĐẦU RA'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {'Top 5 Nghề nghiệp Phù hợp & Phân tích Độc lập'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {true
              ? 'Đầu ra chuẩn xác từ Lõi tính điểm: Chỉ số tương thích, lý do phù hợp, khoảng trống kỹ năng và ngành học.'
              : 'Direct output from Recommendation Engine: Compatibility score, rationale, skill gap and related majors.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            Hạng 1: {selectedLoc ? selectedLoc.title.split('(')[0] : 'Kỹ sư'}
          </span>
        </div>
      </div>

      {/* Top 5 Careers Carousel / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {top5.map((rec, idx) => {
          const loc = CAREER_LOCALIZATION[rec.career.id];
          const title = loc ? loc.title.split('(')[0] : rec.career.title;
          const isSelected = idx === activeCareerIndex;

          return (
            <button
              key={rec.career.id}
              onClick={() => setActiveCareerIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  #{idx + 1}
                </span>
                <span className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-emerald-700'}`}>
                  {Math.round(rec.overallScore)}%
                </span>
              </div>

              <div className="font-bold text-xs line-clamp-2 leading-tight">
                {title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Detail Card for Selected Career in Top 5 */}
      {selectedRec && selectedCareer && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          {/* Career Title & Summary Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
                <span>{selectedLoc ? selectedLoc.cluster : selectedCareer.careerCluster}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">
                  {'Mã Holland:'} {selectedCareer.hollandCode}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedLoc ? selectedLoc.title : selectedCareer.title}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {selectedLoc ? selectedLoc.desc : selectedCareer.description}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600">
                  {Math.round(selectedRec.overallScore)}%
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {'Độ tương thích tổng hòa'}
                </div>
              </div>

              <button
                onClick={() => onSelectCareer(selectedCareer)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{'Xem Hồ sơ Nghề'}</span>
              </button>
            </div>
          </div>

          {/* 3 Core Output Blocks matching Image Schema: Lý do phù hợp, Skill Gap, Ngành học */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* KHỐI 1: LÝ DO VÌ SAO PHÙ HỢP */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{'💡 Lý do vì sao phù hợp'}</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>RIASEC {selectedCareer.hollandCode}:</strong> Khớp rất cao với đặc trưng tư duy phân tích và kỹ thuật của bạn.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Môn học thế mạnh:</strong> Nền tảng {profile.favoriteSubjects.slice(0, 2).join(', ')} đáp ứng trực tiếp yêu cầu nghề.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Môi trường:</strong> Phù hợp với mong muốn {profile.preferredWorkEnvironment[0] || 'làm việc hiện đại'}.
                  </span>
                </li>
              </ul>
            </div>

            {/* KHỐI 2: ĐIỂM CHƯA PHÙ HỢP / SKILL GAP */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{'⚠️ Khoảng trống Kỹ năng'}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">KỸ NĂNG ĐÃ CÓ:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedRec.matchedSkills.slice(0, 3).map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-md text-[11px] font-medium">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">CẦN TRAU DỒI THÊM:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedRec.missingSkills.length > 0 ? (
                      selectedRec.missingSkills.slice(0, 3).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[11px] font-medium">
                          + {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-semibold">Đã đáp ứng đầy đủ kỹ năng cơ bản!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* KHỐI 3: NGÀNH HỌC LIÊN QUAN & LỘ TRÌNH HỌC VẤN */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{'🎓 Ngành học Liên quan'}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">NGÀNH ĐÀO TẠO PHỔ BIẾN:</span>
                  <ul className="space-y-1">
                    {selectedCareer.educationPaths.slice(0, 2).map((path, i) => (
                      <li key={i} className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{path.duration.split('(')[0]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-1 text-[11px] text-slate-500">
                  Lộ trình chi tiết theo từng năm sẽ được phân tích ở Bước 5.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToStep3}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{'Quay lại Bước 3 (Xem lõi tính điểm)'}</span>
        </button>

        <button
          id="btn-advance-to-step5"
          onClick={onAdvanceToStep5}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <span>{'Tiến hành Bước 5: Phân tích Chuyên sâu & Kế hoạch Phát triển'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
