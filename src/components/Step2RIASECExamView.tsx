import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Info,
  RotateCcw,
  Zap
} from 'lucide-react';
import { UserProfile, RIASECScores, RIASECDimension } from '../types';
import { RIASECRadarChart } from './RIASECRadarChart';
import { useLanguage } from '../context/LanguageContext';

interface Step2RIASECExamViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToStep1: () => void;
  onAdvanceToStep3: () => void;
}

interface RIASECQuestion {
  id: string;
  dimension: RIASECDimension;
  dimensionNameVi: string;
  text: string;
  icon: string;
}

const RIASEC_QUESTIONS_STANDARD: RIASECQuestion[] = [
  // R - Realistic
  { id: 'r1', dimension: 'R', dimensionNameVi: 'Kỹ thuật / Thực tế', text: 'Thích lắp ráp, chế tạo máy móc, vi mạch điện tử hoặc sửa chữa thiết bị', icon: '⚙️' },
  { id: 'r2', dimension: 'R', dimensionNameVi: 'Kỹ thuật / Thực tế', text: 'Thích làm việc trực tiếp với công cụ thực tế, ngoài công trường hoặc phòng lab kỹ thuật', icon: '🔧' },

  // I - Investigative
  { id: 'i1', dimension: 'I', dimensionNameVi: 'Nghiên cứu / Khám phá', text: 'Hứng thú với việc giải các bài toán logic hóc búa, phân tích thuật toán hoặc dữ liệu lớn', icon: '🔬' },
  { id: 'i2', dimension: 'I', dimensionNameVi: 'Nghiên cứu / Khám phá', text: 'Thích tìm hiểu bản chất nguyên lý hoạt động của các hiện tượng khoa học và công nghệ', icon: '💡' },

  // A - Artistic
  { id: 'a1', dimension: 'A', dimensionNameVi: 'Nghệ thuật / Sáng tạo', text: 'Thích sáng tạo hình ảnh, thiết kế giao diện đồ họa, viết nội dung hoặc sản xuất video', icon: '🎨' },
  { id: 'a2', dimension: 'A', dimensionNameVi: 'Nghệ thuật / Sáng tạo', text: 'Thích làm việc trong môi trường tự do, đề cao cảm hứng cá nhân và đổi mới ý tưởng', icon: '✨' },

  // S - Social
  { id: 's1', dimension: 'S', dimensionNameVi: 'Xã hội / Giúp đỡ', text: 'Thích chia sẻ kiến thức, hướng dẫn, giảng dạy hoặc tư vấn định hướng cho bạn bè', icon: '🤝' },
  { id: 's2', dimension: 'S', dimensionNameVi: 'Xã hội / Giúp đỡ', text: 'Thích tham gia các hoạt động cộng đồng, chăm sóc và thấu hiểu tâm lý người khác', icon: '❤️' },

  // E - Enterprising
  { id: 'e1', dimension: 'E', dimensionNameVi: 'Quản trị / Khởi nghiệp', text: 'Thích điều phối công việc nhóm, thuyết trình bảo vệ dự án trước đám đông', icon: '📈' },
  { id: 'e2', dimension: 'E', dimensionNameVi: 'Quản trị / Khởi nghiệp', text: 'Hứng thú với kinh doanh, đàm phán, tìm kiếm cơ hội thị trường và khởi nghiệp', icon: '💼' },

  // C - Conventional
  { id: 'c1', dimension: 'C', dimensionNameVi: 'Quy chuẩn / Tổ chức', text: 'Thích tổ chức dữ liệu ngăn nắp, lập bảng biểu Excel chi tiết và lên kế hoạch rõ ràng', icon: '📋' },
  { id: 'c2', dimension: 'C', dimensionNameVi: 'Quy chuẩn / Tổ chức', text: 'Thích làm việc theo quy trình chuẩn hóa, tính toán số liệu chính xác và kiểm toán', icon: '📊' }
];

export const Step2RIASECExamView: React.FC<Step2RIASECExamViewProps> = ({
  profile,
  onUpdateProfile,
  onBackToStep1,
  onAdvanceToStep3
}) => {
  const { language } = useLanguage();

  // Answer values: 1 (Không thích), 2 (Bình thường), 3 (Thích), 4 (Rất thích)
  // Strictly empty by default unless user has already selected answers in current profile
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    // Only pre-fill if profile already has non-zero scores
    const hasExistingScores = Object.values(profile.riaSecScores || {}).some(v => typeof v === 'number' && v > 0);
    if (hasExistingScores) {
      RIASEC_QUESTIONS_STANDARD.forEach(q => {
        const dimScore = profile.riaSecScores?.[q.dimension] || 0;
        if (dimScore > 0) {
          init[q.id] = dimScore >= 0.75 ? 4 : dimScore >= 0.5 ? 3 : 2;
        }
      });
    }
    return init;
  });

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = RIASEC_QUESTIONS_STANDARD.length;
  const isComplete = answeredCount === totalQuestions;

  const handleScoreChange = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleResetAnswers = () => {
    setAnswers({});
  };

  const handleQuickDemoAnswers = () => {
    const demoAns: Record<string, number> = {
      r1: 4, r2: 3,
      i1: 4, i2: 4,
      a1: 2, a2: 2,
      s1: 2, s2: 1,
      e1: 3, e2: 2,
      c1: 3, c2: 3
    };
    setAnswers(demoAns);
  };

  // Compute RIASEC Vector & Holland Code
  const computedScores: RIASECScores = React.useMemo(() => {
    const rawSums: Record<RIASECDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts: Record<RIASECDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    RIASEC_QUESTIONS_STANDARD.forEach(q => {
      const val = answers[q.id] || 0;
      if (val > 0) {
        rawSums[q.dimension] += val;
        counts[q.dimension] += 1;
      }
    });

    const scores: RIASECScores = {
      R: counts.R > 0 ? Math.round((rawSums.R / (counts.R * 4)) * 100) / 100 : 0,
      I: counts.I > 0 ? Math.round((rawSums.I / (counts.I * 4)) * 100) / 100 : 0,
      A: counts.A > 0 ? Math.round((rawSums.A / (counts.A * 4)) * 100) / 100 : 0,
      S: counts.S > 0 ? Math.round((rawSums.S / (counts.S * 4)) * 100) / 100 : 0,
      E: counts.E > 0 ? Math.round((rawSums.E / (counts.E * 4)) * 100) / 100 : 0,
      C: counts.C > 0 ? Math.round((rawSums.C / (counts.C * 4)) * 100) / 100 : 0
    };

    return scores;
  }, [answers]);

  const sortedDims = React.useMemo(() => {
    return (['R', 'I', 'A', 'S', 'E', 'C'] as RIASECDimension[])
      .map(dim => ({ dim, score: computedScores[dim] }))
      .sort((a, b) => b.score - a.score);
  }, [computedScores]);

  const hollandCode = answeredCount >= 3
    ? `${sortedDims[0].dim}${sortedDims[1].dim}${sortedDims[2].dim}`
    : 'Chưa đủ câu trả lời';

  const dimDescriptions: Record<RIASECDimension, { title: string; desc: string }> = {
    R: { title: 'Thực tế / Kỹ thuật (Realistic)', desc: 'Thích hành động, thao tác máy móc thiết bị, tư duy vật lý và kết quả thực tiễn có thể chạm thấy.' },
    I: { title: 'Nghiên cứu / Khám phá (Investigative)', desc: 'Nổi bật ở khả năng quan sát, tư duy phản biện, giải bài toán phức tạp và nghiên cứu khoa học.' },
    A: { title: 'Nghệ thuật / Sáng tạo (Artistic)', desc: 'Giàu trí tưởng tượng, thích thẩm mỹ, đổi mới ý tưởng và phong cách biểu đạt tự do không gò bó.' },
    S: { title: 'Xã hội / Hỗ trợ (Social)', desc: 'Giao tiếp thấu cảm, giàu lòng trắc ẩn, thích giảng dạy, kết nối con người và đóng góp cộng đồng.' },
    E: { title: 'Quản trị / Khởi nghiệp (Enterprising)', desc: 'Năng động, có tài thuyết phục, dám nghĩ dám làm, yêu thích kinh doanh và vai trò lãnh đạo.' },
    C: { title: 'Quy chuẩn / Tổ chức (Conventional)', desc: 'Kỷ luật, cẩn trọng, tổ chức thông tin ngăn nắp, làm việc chuẩn chỉ theo kế hoạch và quy chuẩn.' }
  };

  const handleAdvance = () => {
    // If not completed, fill remaining unselected with neutral baseline 2
    const finalAnswers = { ...answers };
    RIASEC_QUESTIONS_STANDARD.forEach(q => {
      if (!finalAnswers[q.id]) finalAnswers[q.id] = 2;
    });

    const updated: UserProfile = {
      ...profile,
      riaSecScores: computedScores,
      riaSecProfile: {
        scores: computedScores,
        primary: sortedDims[0].dim,
        secondary: sortedDims[1].dim,
        tertiary: sortedDims[2].dim,
        code: hollandCode !== 'Chưa đủ câu trả lời' ? hollandCode : 'IRC',
        confidence: isComplete ? 0.95 : 0.7,
        description: `Mã Holland ${hollandCode}: Xu hướng nổi trội nhất ở ${dimDescriptions[sortedDims[0].dim]?.title || 'Nghiên cứu'} và ${dimDescriptions[sortedDims[1].dim]?.title || 'Kỹ thuật'}.`
      }
    };
    onUpdateProfile(updated);
    onAdvanceToStep3();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Step Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>TRANG 2 / 4: BÀI KIỂM TRA RIASEC CHUẨN FORM (12 CÂU HỎI)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Khảo sát Sở thích & Thiên hướng Nghề nghiệp Holland (RIASEC)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Các lựa chọn mặc định để trống. Bạn hãy chọn mức độ yêu thích cho từng câu hỏi bên dưới.
            Hệ thống sẽ tổng hợp mã Holland và phân tích tâm lý độc lập (chưa vội tư vấn nghề ở bước này).
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
            title="Điền nhanh bộ đáp án mẫu (IRC - Kỹ thuật/Nghiên cứu)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Điền mẫu nhanh</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800">
              Tiến độ hoàn thành bài kiểm tra:
            </span>
            <span className="font-extrabold text-indigo-600 font-mono">
              {answeredCount} / {totalQuestions} câu ({Math.round((answeredCount / totalQuestions) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 shrink-0 text-center">
          <span className="text-[10px] text-indigo-600 uppercase tracking-wider block">Mã Holland tạm tính:</span>
          <span className="text-base font-black text-indigo-950">{hollandCode}</span>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Danh sách 12 Câu Hỏi Đánh Giá Hành Vi & Sở Thích
          </h2>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Chọn 1 trong 4 mức độ cho từng câu
          </span>
        </div>

        <div className="space-y-3">
          {RIASEC_QUESTIONS_STANDARD.map((q, idx) => {
            const currentVal = answers[q.id];
            const isAnswered = typeof currentVal === 'number';

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  isAnswered
                    ? 'bg-white border-slate-200/90 shadow-2xs'
                    : 'bg-slate-50/70 border-dashed border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl shrink-0 mt-0.5">{q.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        Câu {idx + 1}: Nhóm {q.dimension} — {q.dimensionNameVi}
                      </span>
                      {isAnswered && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Đã trả lời
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-800 text-xs leading-relaxed block">
                      {q.text}
                    </span>
                  </div>
                </div>

                {/* Rating Pills (Unselected by default!) */}
                <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                  {[
                    { val: 1, label: 'Không thích' },
                    { val: 2, label: 'Bình thường' },
                    { val: 3, label: 'Thích' },
                    { val: 4, label: 'Rất thích' }
                  ].map(lvl => {
                    const isSelected = currentVal === lvl.val;
                    return (
                      <button
                        key={lvl.val}
                        type="button"
                        onClick={() => handleScoreChange(q.id, lvl.val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold ring-2 ring-indigo-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KẾT QUẢ VÀ PHÂN TÍCH RIASEC */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Kết quả & Phân tích Độc lập Chỉ số RIASEC
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {answeredCount >= 3 ? 'Đã có dữ liệu tính toán' : 'Chờ hoàn thành bài test'}
          </span>
        </div>

        {/* Notice of Examination Rule */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Quy tắc thi cử nghiêm ngặt:</strong> Mục này chỉ tính toán đặc điểm tâm lý và phân tích sở thích Holland của bạn. Toàn bộ danh sách gợi ý ngành nghề, điểm chuẩn và trường đại học sẽ được tổng hòa khoa học tại <strong>Trang 4</strong>.
          </span>
        </div>

        {answeredCount === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-1">
            <Compass className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="font-semibold text-slate-600">Chưa có câu trả lời nào được chọn.</p>
            <p>Hãy chọn các mức độ yêu thích ở trên để xem biểu đồ Radar và phân tích mã Holland!</p>
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
                  Ba nhóm trội nhất: <strong>{sortedDims[0].dim}</strong> ({Math.round(sortedDims[0].score * 100)}%),{' '}
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
                        #{idx + 1} {info.title} — {Math.round(item.score * 100)}%
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
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBackToStep1}
          className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang 1: Sửa thông tin</span>
        </button>

        <button
          type="button"
          onClick={handleAdvance}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer group"
        >
          <span>Lưu Kết Quả RIASEC & Sang Trang 3 (Bài Test MBTI)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
