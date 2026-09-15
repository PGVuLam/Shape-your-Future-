import React, { useState, useMemo } from 'react';
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Zap,
  Lock,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { UserProfile, MBTIResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  MBTI_QUESTIONS_16,
  MBTI_QUESTION_BANK,
  MBTIQuestion
} from '../data/assessmentQuestions';

interface Step3MBTIExamViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToStep2: () => void;
  onAdvanceToStep4: () => void;
}

const MBTI_ARCHETYPES: Record<string, { titleVi: string; role: string; summary: string; strengths: string[]; workStyle: string }> = {
  INTJ: {
    titleVi: 'Nhà Kiến thiết Chiến lược',
    role: 'Architect / Strategist',
    summary: 'Tư duy chiến lược sắc bén, độc lập, có tầm nhìn dài hạn và tiêu chuẩn học thuật rất cao.',
    strengths: ['Tư duy hệ thống logic', 'Ý chí tự học và quyết tâm cao', 'Nhìn xa trông rộng', 'Tối ưu hóa quy trình'],
    workStyle: 'Thích làm việc độc lập hoặc với đội ngũ tinh nhuệ, cần không gian tập trung sâu để nghiên cứu.'
  },
  INTP: {
    titleVi: 'Nhà Tư duy Logic',
    role: 'Logician / Thinker',
    summary: 'Đam mê khám phá lý thuyết, thuật toán, tìm tòi câu trả lời cho các hiện tượng phức tạp.',
    strengths: ['Tư duy phản biện xuất sắc', 'Đổi mới sáng tạo', 'Ham học hỏi tri thức mới', 'Phân tích đa chiều'],
    workStyle: 'Phát huy cao nhất ở phòng thí nghiệm, công ty công nghệ cao nơi cho phép tự do thử nghiệm.'
  },
  ENTJ: {
    titleVi: 'Nhà Lãnh đạo Chỉ huy',
    role: 'Commander',
    summary: 'Quyết đoán, có tài tổ chức, luôn hướng tới hiệu suất tối đa và các mục tiêu lớn lao.',
    strengths: ['Khả năng lãnh đạo tự nhiên', 'Quyết đoán', 'Tổ chức nhân sự hiệu quả', 'Tập trung vào kết quả'],
    workStyle: 'Thích hợp với vai trò trưởng nhóm, điều hành dự án và môi trường cạnh tranh cao.'
  },
  ENTP: {
    titleVi: 'Nhà Đổi mới Sáng tạo',
    role: 'Debater / Innovator',
    summary: 'Nhanh trí, thích tranh biện trí tuệ, luôn tìm ra các giải pháp khác biệt phá vỡ lối mòn.',
    strengths: ['Tư duy phản biện nhanh nhạy', 'Nhiều ý tưởng độc đáo', 'Thích nghi tốt', 'Khả năng truyền cảm hứng'],
    workStyle: 'Yêu thích các thử thách mới, môi trường startup công nghệ và giải quyết bài toán hóc búa.'
  },
  INFJ: {
    titleVi: 'Người Cố vấn Lý tưởng',
    role: 'Advocate / Counselor',
    summary: 'Sâu sắc, thấu cảm cao, luôn kiên định với các giá trị nhân văn và mong muốn tạo ảnh hưởng tốt đẹp.',
    strengths: ['Trực giác tâm lý sâu sắc', 'Liêm chính và tận tụy', 'Khả năng viết và biểu đạt tốt', 'Truyền cảm hứng'],
    workStyle: 'Phù hợp với môi trường giáo dục, tâm lý, nghiên cứu y sinh và các dự án vì cộng đồng.'
  },
  INFP: {
    titleVi: 'Người Khởi xướng Lý tưởng',
    role: 'Mediator',
    summary: 'Giàu lòng trắc ẩn, tâm hồn sáng tạo, luôn trung thành với niềm tin nội tâm của chính mình.',
    strengths: ['Đồng cảm cao', 'Tư duy nghệ thuật độc đáo', 'Linh hoạt', 'Tận tâm với lý tưởng'],
    workStyle: 'Cần môi trường làm việc thoải mái, cởi mở, không bị gò bó bởi quy chế quan liêu.'
  },
  ENFJ: {
    titleVi: 'Người Truyền cảm hứng',
    role: 'Protagonist',
    summary: 'Nhiệt tình, cuốn hút, có tài kết nối và dẫn dắt người khác phát triển tiềm năng tối đa.',
    strengths: ['Giao tiếp thuyết phục', 'Lãnh đạo bằng sự thấu cảm', 'Đáng tin cậy', 'Tổ chức sự kiện tốt'],
    workStyle: 'Xuất sắc trong vai trò giảng viên, quản lý nhân sự, tư vấn tâm lý và điều phối cộng đồng.'
  },
  ENFP: {
    titleVi: 'Người Truyền lửa Nhiệt huyết',
    role: 'Campaigner',
    summary: 'Năng động, sáng tạo, luôn tràn đầy năng lượng tích cực và dễ dàng kết nối mọi người.',
    strengths: ['Trí tưởng tượng phong phú', 'Kỹ năng xã hội tuyệt vời', 'Nhiệt huyết', 'Dễ thích ứng'],
    workStyle: 'Phát huy cao ở các vị trí sáng tạo nội dung, truyền thông, marketing và tổ chức sự kiện.'
  },
  ISTJ: {
    titleVi: 'Nhà Quản trị Trách nhiệm',
    role: 'Logistician',
    summary: 'Thực tế, trung thực, tôn trọng quy tắc và luôn hoàn thành nhiệm vụ với sự chuẩn xác tuyệt đối.',
    strengths: ['Kỷ luật và trách nhiệm', 'Tỉ mỉ với số liệu', 'Bình tĩnh', 'Đáng tin cậy'],
    workStyle: 'Cực kỳ phù hợp với tài chính, kế toán, kiểm toán, luật pháp và quản trị hệ thống.'
  },
  ISFJ: {
    titleVi: 'Người Bảo trợ Tận tâm',
    role: 'Defender',
    summary: 'Ân cần, cẩn thận, luôn sẵn sàng hỗ trợ người khác và bảo đảm mọi thứ vận hành êm đẹp.',
    strengths: ['Chu đáo và tỉ mỉ', 'Đáng tin cậy', 'Trung thành', 'Kỹ năng thực hành tốt'],
    workStyle: 'Phát huy ở ngành y tế, chăm sóc sức khỏe, giáo dục tiểu học và quản trị hành chính.'
  },
  ESTJ: {
    titleVi: 'Nhà Quản lý Thực thi',
    role: 'Executive',
    summary: 'Nguyên tắc, giỏi quản lý dự án, giữ gìn trật tự và đưa mọi việc vào đúng khuôn khổ quy củ.',
    strengths: ['Kỹ năng tổ chức xuất sắc', 'Ý chí mạnh mẽ', 'Trung thực', 'Đáng tin cậy'],
    workStyle: 'Thích hợp với quản trị doanh nghiệp, chỉ huy kỹ thuật, logistic và cơ quan nhà nước.'
  },
  ESFJ: {
    titleVi: 'Người Chăm sóc Hòa đồng',
    role: 'Consul',
    summary: 'Chu đáo, ấm áp, luôn quan tâm đến sự hòa hợp của tập thể và rất được mọi người quý mến.',
    strengths: ['Kỹ năng quan hệ xã hội tốt', 'Ấm áp', 'Có tinh thần trách nhiệm', 'Thực tế'],
    workStyle: 'Thành công trong chăm sóc khách hàng, quản trị nhân sự, điều dưỡng và dịch vụ khách sạn.'
  },
  ISTP: {
    titleVi: 'Thợ Cơ khí Khéo léo',
    role: 'Virtuoso',
    summary: 'Thực tế, tò mò cơ học, thích tháo lắp máy móc và xử lý tình huống khẩn cấp bằng hành động.',
    strengths: ['Thực hành cơ khí giỏi', 'Bình tĩnh trước khủng hoảng', 'Tư duy logic thực chứng', 'Linh hoạt'],
    workStyle: 'Rất hợp với kỹ sư phần cứng, kỹ thuật viên tự động hóa, phi công và vận động viên.'
  },
  ISFP: {
    titleVi: 'Nghệ sĩ Phiêu lãng',
    role: 'Adventurer',
    summary: 'Tinh tế, có gu thẩm mỹ cao, thích khám phá trải nghiệm cuộc sống bằng các giác quan.',
    strengths: ['Cảm thụ nghệ thuật sâu sắc', 'Khiêm tốn', 'Linh hoạt', 'Giàu tình cảm'],
    workStyle: 'Phù hợp với thiết kế thời trang, mỹ thuật số, kiến trúc nội thất và nhiếp ảnh.'
  },
  ESTP: {
    titleVi: 'Người Tiên phong Năng động',
    role: 'Entrepreneur',
    summary: 'Nhanh nhẹn, thực tế, thích hành động ngay lập tức và tận hưởng cảm giác chinh phục mục tiêu.',
    strengths: ['Phản ứng nhanh', 'Táo bạo và tự tin', 'Giao tiếp sắc sảo', 'Quan sát thực tế tốt'],
    workStyle: 'Phù hợp với kinh doanh bất động sản, môi giới tài chính, kỹ sư công trường và thể thao.'
  },
  ESFP: {
    titleVi: 'Người Trình diễn Cuốn hút',
    role: 'Entertainer',
    summary: 'Sôi nổi, hoạt bát, mang lại niềm vui cho mọi người xung quanh và thích cuộc sống giàu trải nghiệm.',
    strengths: ['Duyên dáng', 'Lạc quan', 'Kỹ năng xã hội xuất sắc', 'Thực tế'],
    workStyle: 'Phát huy ở ngành truyền thông giải trí, du lịch lữ hành, quan hệ công chúng (PR) và sự kiện.'
  }
};

export const Step3MBTIExamView: React.FC<Step3MBTIExamViewProps> = ({
  profile,
  onUpdateProfile,
  onBackToStep2,
  onAdvanceToStep4
}) => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'ALL' | 'IE' | 'SN' | 'TF' | 'JP'>('ALL');

  // Selected options for each question: 'A' or 'B'
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>(() => {
    // Initial empty state
    return {};
  });

  const totalQuestions = MBTI_QUESTIONS_16.length; // 16
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelect = (qId: string, choice: 'A' | 'B') => {
    setAnswers(prev => ({ ...prev, [qId]: choice }));
  };

  const handleResetAnswers = () => {
    setAnswers({});
  };

  const handleQuickDemoAnswers = () => {
    // Fill realistic INTJ profile for demo/testing
    const demo: Record<string, 'A' | 'B'> = {
      mbti_ie_1: 'A', // I
      mbti_ie_2: 'A', // I
      mbti_ie_3: 'A', // I
      mbti_ie_4: 'B', // E (slight mix)
      mbti_sn_1: 'B', // N
      mbti_sn_2: 'B', // N
      mbti_sn_3: 'B', // N
      mbti_sn_4: 'A', // S (slight mix)
      mbti_tf_1: 'A', // T
      mbti_tf_2: 'A', // T
      mbti_tf_3: 'A', // T
      mbti_tf_4: 'A', // T
      mbti_jp_1: 'A', // J
      mbti_jp_2: 'A', // J
      mbti_jp_3: 'A', // J
      mbti_jp_4: 'B'  // P (slight mix) -> Result INTJ
    };
    setAnswers(demo);
  };

  // Derive MBTI 4-letter type
  const { computedMBTI, traitCounts } = useMemo(() => {
    let countI = 0, countE = 0;
    let countS = 0, countN = 0;
    let countT = 0, countF = 0;
    let countJ = 0, countP = 0;

    MBTI_QUESTIONS_16.forEach(q => {
      const ans = answers[q.id];
      if (!ans) return;
      const val = ans === 'A' ? q.optionA.value : q.optionB.value;
      if (val === 'I') countI++;
      if (val === 'E') countE++;
      if (val === 'S') countS++;
      if (val === 'N') countN++;
      if (val === 'T') countT++;
      if (val === 'F') countF++;
      if (val === 'J') countJ++;
      if (val === 'P') countP++;
    });

    if (answeredCount < 4) {
      return {
        computedMBTI: 'Chưa đủ dữ liệu',
        traitCounts: { I: countI, E: countE, S: countS, N: countN, T: countT, F: countF, J: countJ, P: countP }
      };
    }

    const char1 = countI >= countE ? 'I' : 'E';
    const char2 = countN >= countS ? 'N' : 'S';
    const char3 = countT >= countF ? 'T' : 'F';
    const char4 = countJ >= countP ? 'J' : 'P';

    return {
      computedMBTI: `${char1}${char2}${char3}${char4}`,
      traitCounts: { I: countI, E: countE, S: countS, N: countN, T: countT, F: countF, J: countJ, P: countP }
    };
  }, [answers, answeredCount]);

  const archetypeInfo = computedMBTI !== 'Chưa đủ dữ liệu'
    ? (MBTI_ARCHETYPES[computedMBTI] || MBTI_ARCHETYPES['INTJ'])
    : MBTI_ARCHETYPES['INTJ'];

  const filteredQuestions = useMemo(() => {
    if (activeTab === 'ALL') return MBTI_QUESTIONS_16;
    return MBTI_QUESTION_BANK[activeTab];
  }, [activeTab]);

  const dimensionTabs: Array<{ key: 'ALL' | 'IE' | 'SN' | 'TF' | 'JP'; label: string; count: number }> = [
    { key: 'ALL', label: 'Tất cả 16 câu', count: answeredCount },
    { key: 'IE', label: 'Năng lượng: Hướng nội (I) / Hướng ngoại (E)', count: MBTI_QUESTION_BANK.IE.filter(q => !!answers[q.id]).length },
    { key: 'SN', label: 'Tiếp nhận: Thực tế (S) / Trực giác (N)', count: MBTI_QUESTION_BANK.SN.filter(q => !!answers[q.id]).length },
    { key: 'TF', label: 'Quyết định: Lý trí (T) / Cảm xúc (F)', count: MBTI_QUESTION_BANK.TF.filter(q => !!answers[q.id]).length },
    { key: 'JP', label: 'Lối sống: Kế hoạch (J) / Linh hoạt (P)', count: MBTI_QUESTION_BANK.JP.filter(q => !!answers[q.id]).length }
  ];

  const handleAdvance = () => {
    if (!isComplete) return;

    const mbtiRes: MBTIResult = {
      type: computedMBTI,
      confidence: 0.95,
      traits: {
        IE: computedMBTI[0] as 'I' | 'E',
        SN: computedMBTI[1] as 'S' | 'N',
        TF: computedMBTI[2] as 'T' | 'F',
        JP: computedMBTI[3] as 'J' | 'P'
      },
      notes: `${archetypeInfo.titleVi} (${archetypeInfo.role}): ${archetypeInfo.summary}. MBTI là yếu tố bổ trợ phong cách làm việc (chiếm 5% trọng số gợi ý).`
    };

    const updated: UserProfile = {
      ...profile,
      mbtiType: computedMBTI,
      mbtiResult: mbtiRes
    };

    onUpdateProfile(updated);
    onAdvanceToStep4();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Step Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" />
            <span>BƯỚC 3 / 4: KHẢO SÁT PHONG CÁCH TÍNH CÁCH MBTI (16 CÂU HỎI)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Khảo sát Phong cách Làm việc & Giao tiếp (MBTI)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Gồm 16 câu hỏi tình huống đối lập phân bố đều 4 câu cho mỗi cặp xu hướng (E/I, S/N, T/F, J/P).
            Vui lòng chọn phương án phản ánh tự nhiên nhất thói quen của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetAnswers}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Bỏ chọn tất cả đáp án"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Để trống</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemoAnswers}
            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Điền nhanh bộ 16 đáp án mẫu (INTJ - Nhà kiến thiết)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Điền mẫu 16 câu</span>
          </button>
        </div>
      </div>

      {/* Prominent Scientific Disclaimer Banner (Mandatory Requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-900 block text-xs sm:text-sm">
            Khuyến cáo khoa học & Giới hạn vai trò của MBTI:
          </span>
          <p className="leading-relaxed text-amber-800 text-xs">
            MBTI là công cụ bổ trợ nhận diện phong cách tư duy, giao tiếp và môi trường làm việc ưa thích. Trong hệ thống định hướng nghề nghiệp của chúng tôi, <strong>MBTI chỉ chiếm 5% trọng số gợi ý</strong> và <strong>KHÔNG</strong> được sử dụng để phán quyết tuyệt đối năng lực hay giới hạn ngành nghề của bạn. Hãy xem đây là lăng kính tham khảo để thấu hiểu bản thân tốt hơn.
          </p>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800">
              Tiến độ hoàn thành bài test MBTI:
            </span>
            <span className="font-extrabold text-purple-600 font-mono">
              {answeredCount} / {totalQuestions} câu ({Math.round((answeredCount / totalQuestions) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isComplete ? 'bg-emerald-500' : 'bg-purple-600'
              }`}
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[10px] text-purple-600 uppercase tracking-wider block font-semibold">
              Nhóm tính cách:
            </span>
            <span className="text-base font-black text-purple-950">{computedMBTI}</span>
          </div>
          <div className={`px-3 py-2 rounded-2xl text-xs font-bold border ${
            isComplete
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {isComplete ? '✅ Đủ 16/16 câu' : `⏳ Còn thiếu ${totalQuestions - answeredCount} câu`}
          </div>
        </div>
      </div>

      {/* Dimension Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {dimensionTabs.map(tab => {
          const isDone = tab.key === 'ALL' ? isComplete : tab.count === 4;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label} ({tab.count}/{tab.key === 'ALL' ? 16 : 4})</span>
              {isDone && <span className="text-[10px] text-emerald-400">✓</span>}
            </button>
          );
        })}
      </div>

      {/* MBTI Questions Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {activeTab === 'ALL'
              ? 'Danh Sách 16 Câu Hỏi Tình Huống MBTI'
              : `Nhóm tình huống ${activeTab} (4 câu)`}
          </h2>
          <span className="text-[11px] text-slate-500">
            Chọn phương án A hoặc B phù hợp nhất
          </span>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const currentAns = answers[q.id];
            const globalIndex = MBTI_QUESTIONS_16.findIndex(item => item.id === q.id) + 1;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                  currentAns
                    ? 'bg-white border-slate-200/90 shadow-2xs'
                    : 'bg-slate-50/70 border-dashed border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                    Câu {globalIndex}: {q.dimensionLabel}
                  </span>
                  {currentAns && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã chọn đáp án {currentAns} ({currentAns === 'A' ? q.optionA.trait : q.optionB.trait})
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                  {q.question}
                </div>

                {/* Two options: A & B */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'A')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                      currentAns === 'A'
                        ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-xs ring-2 ring-purple-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                      currentAns === 'A' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      A
                    </span>
                    <div>
                      <div className="font-bold leading-snug text-slate-900">{q.optionA.label}</div>
                      <div className="text-[10px] text-purple-700 font-medium mt-1">
                        → {q.optionA.desc}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'B')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                      currentAns === 'B'
                        ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-xs ring-2 ring-purple-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                      currentAns === 'B' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      B
                    </span>
                    <div>
                      <div className="font-bold leading-snug text-slate-900">{q.optionB.label}</div>
                      <div className="text-[10px] text-purple-700 font-medium mt-1">
                        → {q.optionB.desc}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MBTI Results & Archetype Analysis */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Kết Quả & Phân Tích Tính Cách MBTI (Yếu Tố Bổ Trợ)
            </h2>
          </div>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${
            isComplete
              ? 'bg-purple-50 text-purple-800 border-purple-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isComplete ? 'Đã hoàn thành 16/16 câu' : 'Chờ hoàn thành bài test'}
          </span>
        </div>

        {answeredCount === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-1">
            <Brain className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="font-semibold text-slate-600">Chưa có câu trả lời nào được chọn.</p>
            <p>Hãy trả lời các câu hỏi tình huống ở trên để hệ thống phân tích hình mẫu tính cách của bạn!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Archetype Profile Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                    HÌNH MẪU TÍNH CÁCH XÁC ĐỊNH:
                  </span>
                  <div className="text-2xl font-black text-purple-950">
                    {computedMBTI} — {archetypeInfo.titleVi} ({archetypeInfo.role})
                  </div>
                </div>
                <div className="text-3xl">🧠</div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {archetypeInfo.summary}
              </p>
            </div>

            {/* Traits breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Năng lượng (E/I)</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  I: {traitCounts.I}/4 | E: {traitCounts.E}/4
                </span>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                  → Xu hướng: {computedMBTI[0] === 'I' ? 'Hướng nội (I)' : 'Hướng ngoại (E)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Tiếp nhận (S/N)</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  S: {traitCounts.S}/4 | N: {traitCounts.N}/4
                </span>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                  → Xu hướng: {computedMBTI[1] === 'N' ? 'Trực giác (N)' : 'Thực tế (S)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Quyết định (T/F)</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  T: {traitCounts.T}/4 | F: {traitCounts.F}/4
                </span>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                  → Xu hướng: {computedMBTI[2] === 'T' ? 'Lý trí (T)' : 'Thấu cảm (F)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Lối sống (J/P)</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  J: {traitCounts.J}/4 | P: {traitCounts.P}/4
                </span>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                  → Xu hướng: {computedMBTI[3] === 'J' ? 'Kế hoạch (J)' : 'Linh hoạt (P)'}
                </span>
              </div>
            </div>

            {/* Traits & Strengths Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 block">✨ Điểm mạnh nổi bật trong làm việc:</span>
                <ul className="space-y-1.5">
                  {archetypeInfo.strengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 block">💼 Phong cách làm việc & Môi trường phù hợp:</span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {archetypeInfo.workStyle}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToStep2}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 2: Sửa RIASEC</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col items-end gap-1">
          <button
            id="btn-advance-to-page4"
            type="button"
            onClick={handleAdvance}
            disabled={!isComplete}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer group ${
              isComplete
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isComplete ? (
              <>
                <span>Xác nhận MBTI & Sang Bước 4 (Báo Cáo & Cố Vấn AI)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Hoàn thành đủ 16/16 câu để tiếp tục ({answeredCount}/16)</span>
              </>
            )}
          </button>

          {!isComplete && (
            <span className="text-[11px] text-amber-700 font-medium">
              * Quy trình bắt buộc: Cần trả lời đủ 16 câu MBTI trước khi sang Bước 4.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
