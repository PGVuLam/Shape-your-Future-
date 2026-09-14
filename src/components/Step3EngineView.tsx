import React, { useState } from 'react';
import {
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  Database,
  Sliders,
  Sparkles,
  Calculator,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { UserProfile, Career, ScoringWeights, RecommendationScore } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { CAREER_LOCALIZATION } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';

interface Step3EngineViewProps {
  profile: UserProfile;
  scoringWeights: ScoringWeights;
  onUpdateWeights: (weights: ScoringWeights) => void;
  recommendations: RecommendationScore[];
  onBackToStep2: () => void;
  onAdvanceToStep4: () => void;
}

export const Step3EngineView: React.FC<Step3EngineViewProps> = ({
  profile,
  scoringWeights,
  onUpdateWeights,
  recommendations,
  onBackToStep2,
  onAdvanceToStep4
}) => {
  const { language } = useLanguage();
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSimulateEngine = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onAdvanceToStep4();
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>{language === 'vi' ? 'BƯỚC 3: LÕI TÍNH ĐIỂM GỢI Ý & CƠ SỞ TRI THỨC' : 'STEP 3: RECOMMENDATION ENGINE & KB'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'vi' ? 'Mô hình Tính điểm Trọng số Tất định' : 'Deterministic Multi-Criteria Weighted Engine'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'vi'
              ? 'Lõi toán học tính độ tương đồng Cosine vector RIASEC và đối sánh ma trận 16 nghề chuẩn hóa trong Cơ sở tri thức.'
              : 'Mathematical engine computing RIASEC vector cosine similarity matched against 16 standardized careers in Knowledge Base.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            16 Nghề / 8 Nhóm ngành
          </span>
        </div>
      </div>

      {/* Two Columns: Formula & Weights vs Knowledge Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COLUMN 1: CÔNG THỨC TRỌNG SỐ (WEIGHTED SCORE FORMULA) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-purple-600" />
              <span>{language === 'vi' ? 'Công thức Trọng số Điểm số' : 'Scoring Weight Distribution'}</span>
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              Tổng: 100%
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>🎯 Tương đồng Holland (RIASEC Cosine)</span>
                <span className="font-bold text-indigo-600">35%</span>
              </div>
              <p className="text-[11px] text-slate-500">Độ khớp góc cosine giữa vector cá nhân và vector nghề nghiệp</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>🛠️ Độ khớp Kỹ năng (Skill Match)</span>
                <span className="font-bold text-indigo-600">25%</span>
              </div>
              <p className="text-[11px] text-slate-500">Trùng khớp kỹ năng chuyên môn kỹ thuật và kỹ năng cốt lõi</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>❤️ Sở thích Tự nhiên (Interests)</span>
                <span className="font-bold text-indigo-600">15%</span>
              </div>
              <p className="text-[11px] text-slate-500">Đam mê công việc và mức độ thỏa mãn nội tại</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>📖 Môn học Thế mạnh (Subjects)</span>
                <span className="font-bold text-indigo-600">10%</span>
              </div>
              <p className="text-[11px] text-slate-500">Nền tảng học thuật tương thích với chương trình đào tạo</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>🎯 Mục tiêu & Môi trường (Goals & Env)</span>
                <span className="font-bold text-indigo-600">10%</span>
              </div>
              <p className="text-[11px] text-slate-500">Kỳ vọng thu nhập, không gian làm việc và giá trị nghề</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>🧩 MBTI Tương thích (Phụ trợ)</span>
                <span className="font-bold text-indigo-600">5%</span>
              </div>
              <p className="text-[11px] text-slate-500">Feature phụ: Hệ số thưởng nhỏ cho nhóm tính cách làm việc</p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CƠ SỞ TRI THỨC NGHỀ NGHIỆP (CAREER KNOWLEDGE BASE) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>{language === 'vi' ? '4. Cơ sở Tri thức Nghề nghiệp' : '4. Career Knowledge Base'}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Đã đồng bộ
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {language === 'vi'
              ? 'Lõi đối chiếu hồ sơ học sinh với 16 nghề nghiệp chuẩn hóa. Dưới đây là mô phỏng điểm tương thích sơ bộ:'
              : 'Engine evaluates student profile against 16 standardized careers. Preliminary score preview:'}
          </p>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {recommendations.slice(0, 6).map((rec, idx) => {
              const loc = CAREER_LOCALIZATION[rec.career.id];
              const title = loc ? loc.title : rec.career.title;
              const cluster = loc ? loc.cluster : rec.career.careerCluster;

              return (
                <div
                  key={rec.career.id}
                  className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 line-clamp-1">{title}</div>
                      <div className="text-[10px] text-slate-500">{cluster}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-indigo-600 text-sm">
                      {Math.round(rec.overallScore)}%
                    </span>
                    <span className="block text-[9px] text-slate-400">Tương thích</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900 font-medium">
            ✅ Tính toán tất định 100% minh bạch, không thiên vị hay sinh ngẫu nhiên.
          </div>
        </div>
      </div>

      {/* Navigation & Action Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToStep2}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại Bước 2 (Xem hồ sơ)' : 'Back to Step 2 (View profile)'}</span>
        </button>

        <button
          id="btn-advance-to-step4"
          onClick={handleSimulateEngine}
          disabled={isSimulating}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-75"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{language === 'vi' ? 'Đang tổng hợp Báo cáo...' : 'Compiling Output...'}</span>
            </>
          ) : (
            <>
              <span>{language === 'vi' ? 'Hoàn tất Tính toán ➡️ Xuất Báo cáo Kết quả (Bước 4)' : 'Complete Scoring ➡️ View Output (Step 4)'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
