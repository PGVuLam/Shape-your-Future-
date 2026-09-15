import React, { useState, useMemo } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Info,
  RotateCcw,
  Zap,
  Filter,
  Lock
} from 'lucide-react';
import { UserProfile, RIASECScores, RIASECDimension } from '../types';
import { RIASECRadarChart } from './RIASECRadarChart';
import { useLanguage } from '../context/LanguageContext';
import {
  RIASEC_QUESTIONS_30,
  RIASEC_QUESTION_BANK,
  RIASEC_SCALE_OPTIONS,
  RIASECQuestion
} from '../data/assessmentQuestions';

interface Step2RIASECExamViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToStep1: () => void;
  onAdvanceToStep3: () => void;
}

export const Step2RIASECExamView: React.FC<Step2RIASECExamViewProps> = ({
  profile,
  onUpdateProfile,
  onBackToStep1,
  onAdvanceToStep3
}) => {
  const { language } = useLanguage();

  // Active filter tab: 'ALL' or 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
  const [activeTab, setActiveTab] = useState<'ALL' | RIASECDimension>('ALL');

  // Answers state: mapping question id -> rating value (1 to 5)
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    const hasExistingScores = Object.values(profile.riaSecScores || {}).some(v => typeof v === 'number' && v > 0);
    if (hasExistingScores) {
      RIASEC_QUESTIONS_30.forEach(q => {
        const dimScore = profile.riaSecScores?.[q.dimension] || 0;
        if (dimScore > 0) {
          // Map 0-1 to 1-5 scale
          init[q.id] = Math.max(1, Math.min(5, Math.round(dimScore * 4) + 1));
        }
      });
    }
    return init;
  });

  const totalQuestions = RIASEC_QUESTIONS_30.length; // 30
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleScoreChange = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleResetAnswers = () => {
    setAnswers({});
  };

  const handleQuickDemoAnswers = () => {
    const demoAns: Record<string, number> = {};
    // R: Realistic (High: 4-5)
    demoAns['riasec_r_1'] = 5;
    demoAns['riasec_r_2'] = 5;
    demoAns['riasec_r_3'] = 4;
    demoAns['riasec_r_4'] = 3;
    demoAns['riasec_r_5'] = 4;

    // I: Investigative (High: 4-5)
    demoAns['riasec_i_1'] = 5;
    demoAns['riasec_i_2'] = 5;
    demoAns['riasec_i_3'] = 4;
    demoAns['riasec_i_4'] = 5;
    demoAns['riasec_i_5'] = 4;

    // A: Artistic (Moderate: 3)
    demoAns['riasec_a_1'] = 3;
    demoAns['riasec_a_2'] = 2;
    demoAns['riasec_a_3'] = 3;
    demoAns['riasec_a_4'] = 3;
    demoAns['riasec_a_5'] = 3;

    // S: Social (Moderate: 2-3)
    demoAns['riasec_s_1'] = 3;
    demoAns['riasec_s_2'] = 3;
    demoAns['riasec_s_3'] = 3;
    demoAns['riasec_s_4'] = 2;
    demoAns['riasec_s_5'] = 3;

    // E: Enterprising (Moderate: 3-4)
    demoAns['riasec_e_1'] = 3;
    demoAns['riasec_e_2'] = 3;
    demoAns['riasec_e_3'] = 4;
    demoAns['riasec_e_4'] = 3;
    demoAns['riasec_e_5'] = 3;

    // C: Conventional (Good: 4)
    demoAns['riasec_c_1'] = 4;
    demoAns['riasec_c_2'] = 4;
    demoAns['riasec_c_3'] = 4;
    demoAns['riasec_c_4'] = 4;
    demoAns['riasec_c_5'] = 3;

    setAnswers(demoAns);
  };

  // Compute RIASEC Vector (normalized 0.0 to 1.0 for each dimension)
  const computedScores: RIASECScores = useMemo(() => {
    const rawSums: Record<RIASECDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts: Record<RIASECDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    RIASEC_QUESTIONS_30.forEach(q => {
      const val = answers[q.id];
      if (typeof val === 'number') {
        rawSums[q.dimension] += val;
        counts[q.dimension] += 1;
      }
    });

    // Normalize each dimension to 0.0 - 1.0 based on 5-point Likert scale
    // Min sum = count * 1, Max sum = count * 5. Normalized = (sum - count) / (count * 4)
    const normalize = (dim: RIASECDimension): number => {
      const count = counts[dim];
      if (count === 0) return 0;
      const raw = rawSums[dim];
      const norm = (raw - count) / (count * 4);
      return Math.round(Math.max(0, Math.min(1, norm)) * 100) / 100;
    };

    return {
      R: normalize('R'),
      I: normalize('I'),
      A: normalize('A'),
      S: normalize('S'),
      E: normalize('E'),
      C: normalize('C')
    };
  }, [answers]);

  const sortedDims = useMemo(() => {
    return (['R', 'I', 'A', 'S', 'E', 'C'] as RIASECDimension[])
      .map(dim => ({ dim, score: computedScores[dim] }))
      .sort((a, b) => b.score - a.score);
  }, [computedScores]);

  const hollandCode = answeredCount >= 6
    ? `${sortedDims[0].dim}${sortedDims[1].dim}${sortedDims[2].dim}`
    : 'Chưa đủ dữ liệu';

  const dimDescriptions: Record<RIASECDimension, { title: string; desc: string; icon: string }> = {
    R: { title: 'Thực tế & Kỹ thuật (Realistic)', desc: 'Thích hành động, cơ khí, máy móc, sửa chữa thiết bị, tư duy vật lý và kỹ thuật công nghệ.', icon: '⚙️' },
    I: { title: 'Nghiên cứu & Khám phá (Investigative)', desc: 'Nổi bật ở khả năng tư duy trừu tượng, giải toán khó, phân tích số liệu, khoa học và AI.', icon: '🔬' },
    A: { title: 'Nghệ thuật & Sáng tạo (Artistic)', desc: 'Giàu trí tưởng tượng, cảm nhận thẩm mỹ, thiết kế đồ họa, sáng tác nội dung và phong cách tự do.', icon: '🎨' },
    S: { title: 'Xã hội & Giáo dục (Social)', desc: 'Giao tiếp thấu cảm, giàu lòng trắc ẩn, thích giảng dạy, tư vấn tâm lý và phụng sự cộng đồng.', icon: '🤝' },
    E: { title: 'Quản trị & Khởi nghiệp (Enterprising)', desc: 'Năng động, có tài thuyết phục, đàm phán, quản lý đội ngũ, đam mê kinh doanh và vị trí dẫn dắt.', icon: '📈' },
    C: { title: 'Quy trình & Chi tiết (Conventional)', desc: 'Kỷ luật, cẩn trọng, kiểm soát dữ liệu, quản lý lịch trình chuẩn mực và làm việc có hệ thống.', icon: '📋' }
  };

  const filteredQuestions = useMemo(() => {
    if (activeTab === 'ALL') return RIASEC_QUESTIONS_30;
    return RIASEC_QUESTION_BANK[activeTab];
  }, [activeTab]);

  const handleAdvance = () => {
    if (!isComplete) return;

    const updated: UserProfile = {
      ...profile,
      riaSecScores: computedScores,
      riaSecProfile: {
        scores: computedScores,
        primary: sortedDims[0].dim,
        secondary: sortedDims[1].dim,
        tertiary: sortedDims[2].dim,
        code: hollandCode,
        confidence: 0.95,
        description: `Mã Holland ${hollandCode}: Xu hướng nổi trội nhất ở ${dimDescriptions[sortedDims[0].dim]?.title} và ${dimDescriptions[sortedDims[1].dim]?.title}.`
      }
    };
    onUpdateProfile(updated);
    onAdvanceToStep3();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>BƯỚC 2 / 4: BÀI TEST RIASEC HOLLAND (30 CÂU HỎI TIÊU CHUẨN)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Khảo sát Sở thích & Xu hướng Nghề nghiệp Holland (RIASEC)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Bộ câu hỏi gồm 30 câu (phân bố đều 5 câu cho mỗi nhóm R, I, A, S, E, C). Vui lòng chọn mức độ yêu thích từ 1 (Hoàn toàn không thích) đến 5 (Rất thích).
            <strong> Bạn cần hoàn thành đủ 30 câu để mở khóa Bước 3 (MBTI).</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetAnswers}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Bỏ chọn tất cả câu trả lời"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Để trống</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemoAnswers}
            className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Điền nhanh bộ 30 đáp án mẫu (IRC - Kỹ thuật/Nghiên cứu)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Điền mẫu 30 câu</span>
          </button>
        </div>
      </div>

      {/* Progress & Holland Code Summary Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800">
              Tiến độ hoàn thành bài test RIASEC:
            </span>
            <span className="font-extrabold text-indigo-600 font-mono">
              {answeredCount} / {totalQuestions} câu ({Math.round((answeredCount / totalQuestions) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-[10px] text-indigo-600 uppercase tracking-wider block font-semibold">
              Mã Holland dự kiến:
            </span>
            <span className="text-base font-black text-indigo-950">{hollandCode}</span>
          </div>
          <div className={`px-3 py-2 rounded-2xl text-xs font-bold border ${
            isComplete
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {isComplete ? '✅ Đủ 30/30 câu' : `⏳ Còn thiếu ${totalQuestions - answeredCount} câu`}
          </div>
        </div>
      </div>

      {/* Dimension Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
            activeTab === 'ALL'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả 30 câu ({answeredCount}/30)
        </button>

        {(['R', 'I', 'A', 'S', 'E', 'C'] as RIASECDimension[]).map(dim => {
          const dimQuestions = RIASEC_QUESTION_BANK[dim];
          const dimAnswered = dimQuestions.filter(q => typeof answers[q.id] === 'number').length;
          const isDimDone = dimAnswered === 5;

          return (
            <button
              key={dim}
              type="button"
              onClick={() => setActiveTab(dim)}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                activeTab === dim
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{dimDescriptions[dim].icon}</span>
              <span>{dim} ({dimAnswered}/5)</span>
              {isDimDone && <span className="text-[10px] text-emerald-500">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {activeTab === 'ALL'
                ? 'Danh Sách 30 Câu Hỏi (5 Câu Mỗi Nhóm Holland)'
                : `Nhóm ${activeTab}: ${dimDescriptions[activeTab].title} (5 câu)`}
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Thang điểm 1 (Hoàn toàn không thích) đến 5 (Rất thích)
          </span>
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const currentVal = answers[q.id];
            const isAnswered = typeof currentVal === 'number';
            const globalIndex = RIASEC_QUESTIONS_30.findIndex(item => item.id === q.id) + 1;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                  isAnswered
                    ? 'bg-white border-slate-200/90 shadow-2xs'
                    : 'bg-slate-50/70 border-dashed border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3 max-w-xl">
                  <span className="text-2xl shrink-0 mt-0.5">{q.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                        Câu {globalIndex}: Nhóm {q.dimension} — {q.groupNameVi}
                      </span>
                      {isAnswered && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Đã chọn mức {currentVal}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {q.prompt}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {q.detail}
                    </p>
                  </div>
                </div>

                {/* 5-Level Rating Buttons */}
                <div className="flex items-center space-x-1 shrink-0 self-end md:self-center">
                  {RIASEC_SCALE_OPTIONS.map(opt => {
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleScoreChange(q.id, opt.value)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex flex-col items-center min-w-[54px] sm:min-w-[62px] ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold ring-2 ring-indigo-200 scale-105'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                        title={opt.desc}
                      >
                        <span className="text-sm">{opt.emoji}</span>
                        <span className="text-[10px] mt-0.5 line-clamp-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar Chart & Holland Analysis */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Kết Quả & Biểu Đồ 6 Nhóm Holland Chuẩn Hóa
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {answeredCount >= 6 ? 'Đã có dữ liệu tính toán' : 'Chờ hoàn thành bài test'}
          </span>
        </div>

        {answeredCount === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-1">
            <Compass className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="font-semibold text-slate-600">Chưa có câu trả lời nào được chọn.</p>
            <p>Hãy chọn mức độ yêu thích cho các câu hỏi ở trên để xem biểu đồ Radar và phân tích mã Holland!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="flex justify-center">
              <RIASECRadarChart userScores={computedScores} width={320} height={250} />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">
                  MÃ HOLLAND TỔNG HỢP:
                </span>
                <div className="text-2xl font-black text-indigo-950">{hollandCode}</div>
                <p className="text-slate-600 text-xs mt-0.5">
                  Ba nhóm nổi trội nhất: <strong>{sortedDims[0].dim}</strong> ({Math.round(sortedDims[0].score * 100)}%),{' '}
                  <strong>{sortedDims[1].dim}</strong> ({Math.round(sortedDims[1].score * 100)}%),{' '}
                  <strong>{sortedDims[2].dim}</strong> ({Math.round(sortedDims[2].score * 100)}%).
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {sortedDims.slice(0, 3).map((item, idx) => {
                  const info = dimDescriptions[item.dim];
                  return (
                    <div key={item.dim} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="font-bold text-slate-900 block">
                        #{idx + 1} {info.title} — Điểm chuẩn hóa: {Math.round(item.score * 100)}/100
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{info.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToStep1}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 1: Khảo sát thông tin</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleAdvance}
            disabled={!isComplete}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer group ${
              isComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isComplete ? (
              <>
                <span>Lưu Kết Quả RIASEC & Sang Bước 3 (Bài Test MBTI)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Hoàn thành đủ 30/30 câu để tiếp tục ({answeredCount}/30)</span>
              </>
            )}
          </button>

          {!isComplete && (
            <span className="text-[11px] text-amber-700 font-medium">
              * Quy trình bắt buộc: Cần trả lời đủ 30 câu RIASEC trước khi sang Bước 3.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
