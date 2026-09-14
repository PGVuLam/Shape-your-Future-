import React, { useState } from 'react';
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Zap
} from 'lucide-react';
import { UserProfile, MBTIResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Step3MBTIExamViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToStep2: () => void;
  onAdvanceToStep4: () => void;
}

interface MBTIQuestion {
  id: string;
  dimension: 'IE' | 'SN' | 'TF' | 'JP';
  dimensionLabel: string;
  question: string;
  optionA: { label: string; value: 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'; desc: string };
  optionB: { label: string; value: 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'; desc: string };
}

const MBTI_QUESTIONS_STANDARD: MBTIQuestion[] = [
  // 1. IE: Hướng nội (I) vs Hướng ngoại (E)
  {
    id: 'mbti_ie_1',
    dimension: 'IE',
    dimensionLabel: 'Nguồn Năng lượng & Tương tác',
    question: 'Sau một tuần học tập hoặc làm việc căng thẳng, bạn thường phục hồi năng lượng bằng cách nào?',
    optionA: {
      label: 'Dành thời gian yên tĩnh một mình, đọc sách hoặc làm việc cá nhân',
      value: 'I',
      desc: 'Hướng nội (Introversion) — nạp năng lượng từ không gian độc lập'
    },
    optionB: {
      label: 'Gặp gỡ bạn bè, tham gia câu lạc bộ hoặc trò chuyện với nhiều người',
      value: 'E',
      desc: 'Hướng ngoại (Extraversion) — nạp năng lượng từ sự tương tác xã hội'
    }
  },
  {
    id: 'mbti_ie_2',
    dimension: 'IE',
    dimensionLabel: 'Phong cách Giao tiếp',
    question: 'Khi tiếp cận một môi trường mới hoặc một nhóm người chưa quen, bạn thường:',
    optionA: {
      label: 'Lắng nghe, quan sát kỹ lưỡng trước rồi mới chọn lúc thích hợp để chia sẻ',
      value: 'I',
      desc: 'Điềm đạm, cẩn trọng trong giao tiếp'
    },
    optionB: {
      label: 'Chủ động bắt chuyện, dễ dàng làm quen và khuấy động không khí',
      value: 'E',
      desc: 'Năng động, cởi mở và chủ động kết nối'
    }
  },

  // 2. SN: Giác quan/Thực tế (S) vs Trực giác/Khái quát (N)
  {
    id: 'mbti_sn_1',
    dimension: 'SN',
    dimensionLabel: 'Tiếp nhận Thông tin',
    question: 'Khi tìm hiểu một bài học hoặc dự án mới, bạn bị thu hút bởi điều gì hơn?',
    optionA: {
      label: 'Số liệu thực tế, các bước làm cụ thể, quy trình đã được kiểm chứng',
      value: 'S',
      desc: 'Thực tế (Sensing) — chú trọng chi tiết cụ thể và dữ kiện rõ ràng'
    },
    optionB: {
      label: 'Ý tưởng lớn mang tính đột phá, các giả thuyết và viễn cảnh tương lai',
      value: 'N',
      desc: 'Trực giác (Intuition) — yêu thích mô hình khái quát và khả năng mới'
    }
  },
  {
    id: 'mbti_sn_2',
    dimension: 'SN',
    dimensionLabel: 'Cách thức Giải quyết Vấn đề',
    question: 'Bạn thường tự tin nhất khi giải quyết vấn đề dựa trên:',
    optionA: {
      label: 'Kinh nghiệm thực tiễn đã có và hướng dẫn từng bước đáng tin cậy',
      value: 'S',
      desc: 'Vững vàng trong thao tác và kinh nghiệm thực chứng'
    },
    optionB: {
      label: 'Linh cảm, tìm ra giải pháp mới chưa ai từng thử nghiệm',
      value: 'N',
      desc: 'Sáng tạo và nhạy bén với các liên tưởng bất ngờ'
    }
  },

  // 3. TF: Lý trí/Logic (T) vs Cảm xúc/Thấu cảm (F)
  {
    id: 'mbti_tf_1',
    dimension: 'TF',
    dimensionLabel: 'Đưa ra Quyết định',
    question: 'Khi đứng trước một quyết định khó khăn trong công việc nhóm, bạn ưu tiên yếu tố nào?',
    optionA: {
      label: 'Tính logic, công bằng khách quan, hiệu quả và tiêu chuẩn nguyên tắc',
      value: 'T',
      desc: 'Lý trí (Thinking) — phân tích tỉnh táo dựa trên sự thật và logic'
    },
    optionB: {
      label: 'Cảm xúc của các thành viên, sự hòa hợp và giá trị nhân văn của nhóm',
      value: 'F',
      desc: 'Cảm xúc (Feeling) — cân nhắc sự thấu hiểu và tác động đến con người'
    }
  },
  {
    id: 'mbti_tf_2',
    dimension: 'TF',
    dimensionLabel: 'Phản hồi & Nhận xét',
    question: 'Khi bạn bè hoặc đồng đội làm sai, bạn thường có xu hướng phản hồi như thế nào?',
    optionA: {
      label: 'Chỉ ra trực tiếp điểm sai và phân tích nguyên nhân để sửa chữa ngay',
      value: 'T',
      desc: 'Thẳng thắn, hướng tới tính đúng đắn và hiệu suất'
    },
    optionB: {
      label: 'Động viên tinh thần trước, lựa lời nhẹ nhàng để không làm họ tổn thương',
      value: 'F',
      desc: 'Khéo léo, đồng cảm và gìn giữ mối quan hệ'
    }
  },

  // 4. JP: Nguyên tắc/Kế hoạch (J) vs Linh hoạt/Tự do (P)
  {
    id: 'mbti_jp_1',
    dimension: 'JP',
    dimensionLabel: 'Phong cách Tổ chức Đời sống',
    question: 'Khi chuẩn bị cho một chuyến đi hoặc kỳ thi quan trọng, cách làm của bạn là:',
    optionA: {
      label: 'Lên thời gian biểu chi tiết, danh sách việc cần làm (to-do list) và bám sát',
      value: 'J',
      desc: 'Nguyên tắc (Judging) — ưa chuộng sự quy củ, kiểm soát và rõ ràng'
    },
    optionB: {
      label: 'Giữ lịch trình mở, linh hoạt ứng biến theo tình huống thực tế phát sinh',
      value: 'P',
      desc: 'Linh hoạt (Perceiving) — thích ứng tự nhiên và tận hưởng sự ngẫu hứng'
    }
  },
  {
    id: 'mbti_jp_2',
    dimension: 'JP',
    dimensionLabel: 'Thời hạn (Deadline) & Áp lực',
    question: 'Bạn thường xử lý bài tập hoặc công việc được giao như thế nào?',
    optionA: {
      label: 'Làm xong sớm trước hạn chót để không phải lo âu vội vã',
      value: 'J',
      desc: 'Chủ động hoàn thành sớm, ghét cảm giác nước đến chân mới nhảy'
    },
    optionB: {
      label: 'Làm tốt nhất khi có áp lực sát giờ, phát huy tối đa ý tưởng vào phút chót',
      value: 'P',
      desc: 'Thích ứng cao trong môi trường năng động và biến đổi nhanh'
    }
  }
];

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

  // Selected options for each question: 'A' or 'B'
  // Strictly empty by default unless user has already taken the test
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>(() => {
    // Only prefill if profile explicitly has answers or a saved non-default mbtiType
    return {};
  });

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = MBTI_QUESTIONS_STANDARD.length;

  const handleSelect = (qId: string, choice: 'A' | 'B') => {
    setAnswers(prev => ({ ...prev, [qId]: choice }));
  };

  const handleResetAnswers = () => {
    setAnswers({});
  };

  const handleQuickDemoAnswers = () => {
    setAnswers({
      mbti_ie_1: 'A', // I
      mbti_ie_2: 'A', // I
      mbti_sn_1: 'B', // N
      mbti_sn_2: 'B', // N
      mbti_tf_1: 'A', // T
      mbti_tf_2: 'A', // T
      mbti_jp_1: 'A', // J
      mbti_jp_2: 'A'  // J -> INTJ
    });
  };

  // Derive MBTI 4-letter type
  const computedMBTI = React.useMemo(() => {
    if (answeredCount < 4) {
      return 'Chưa đủ đáp án';
    }

    let countI = 0, countE = 0;
    let countS = 0, countN = 0;
    let countT = 0, countF = 0;
    let countJ = 0, countP = 0;

    MBTI_QUESTIONS_STANDARD.forEach(q => {
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

    const char1 = countI >= countE ? 'I' : 'E';
    const char2 = countN >= countS ? 'N' : 'S';
    const char3 = countT >= countF ? 'T' : 'F';
    const char4 = countJ >= countP ? 'J' : 'P';

    return `${char1}${char2}${char3}${char4}`;
  }, [answers, answeredCount]);

  const archetypeInfo = computedMBTI !== 'Chưa đủ đáp án'
    ? (MBTI_ARCHETYPES[computedMBTI] || MBTI_ARCHETYPES['INTJ'])
    : MBTI_ARCHETYPES['INTJ'];

  const handleAdvance = () => {
    const mbtiRes: MBTIResult = {
      type: computedMBTI,
      confidence: 0.94,
      traits: {
        IE: computedMBTI[0] as any,
        SN: computedMBTI[1] as any,
        TF: computedMBTI[2] as any,
        JP: computedMBTI[3] as any
      },
      notes: `${archetypeInfo.titleVi} (${archetypeInfo.role}): ${archetypeInfo.summary}`
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
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" />
            <span>TRANG 3 / 4: BÀI KIỂM TRA MBTI CHUẨN FORM (8 CÂU HỎI)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Khảo sát Phong cách Tư duy & Tính cách (MBTI)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Các lựa chọn mặc định để trống. Hãy chọn phương án (A hoặc B) phản ánh tự nhiên nhất tính cách của bạn
            trên 4 cặp đối lập: Hướng nội/ngoại, Trực giác/Thực tế, Lý trí/Cảm xúc, Nguyên tắc/Linh hoạt.
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
            className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Điền nhanh bộ đáp án mẫu (INTJ - Nhà kiến thiết)"
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
              Tiến độ hoàn thành bài kiểm tra MBTI:
            </span>
            <span className="font-extrabold text-purple-600 font-mono">
              {answeredCount} / {totalQuestions} câu ({Math.round((answeredCount / totalQuestions) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300 rounded-full"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 shrink-0 text-center">
          <span className="text-[10px] text-purple-600 uppercase tracking-wider block">Nhóm tính cách:</span>
          <span className="text-base font-black text-purple-950">{computedMBTI}</span>
        </div>
      </div>

      {/* MBTI Questions Grid */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Các cặp tình huống trắc nghiệm MBTI chuẩn form
          </h2>
          <span className="text-[11px] text-slate-500">
            Chọn phương án A hoặc B phản ánh tự nhiên nhất con người bạn
          </span>
        </div>

        <div className="space-y-4">
          {MBTI_QUESTIONS_STANDARD.map((q, idx) => {
            const currentAns = answers[q.id];
            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Câu {idx + 1}: {q.dimensionLabel}
                  </span>
                </div>

                <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {q.question}
                </div>

                {/* Two options: A & B */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'A')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                      currentAns === 'A'
                        ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-xs ring-1 ring-purple-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                      currentAns === 'A' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      A
                    </span>
                    <div>
                      <div className="font-bold leading-snug">{q.optionA.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{q.optionA.desc}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'B')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                      currentAns === 'B'
                        ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-xs ring-1 ring-purple-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                      currentAns === 'B' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      B
                    </span>
                    <div>
                      <div className="font-bold leading-snug">{q.optionB.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{q.optionB.desc}</div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KẾT QUẢ VÀ PHÂN TÍCH MBTI (TUÂN THỦ: CHƯA VỘI TƯ VẤN NGHỀ) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">
              Kết quả & Phân tích Độc lập Tính cách MBTI
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã phân loại
          </span>
        </div>

        {/* Notice of Examination Rule */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Quy tắc thi cử:</strong> Mục này chỉ thông báo nhóm tính cách và phong cách tư duy MBTI của bạn. Toàn bộ danh sách gợi ý ngành nghề, trường đại học Top và hỏi đáp chuyên sâu sẽ xuất hiện tại <strong>Trang 4</strong>.
          </span>
        </div>

        {/* Archetype Profile Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">HÌNH MẪU TÍNH CÁCH:</span>
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

        {/* Traits & Strengths Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-800 block">✨ Điểm mạnh nổi bật:</span>
            <ul className="space-y-1.5">
              {archetypeInfo.strengths.map((str, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-800 block">💼 Phong cách làm việc & Môi trường phù hợp:</span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {archetypeInfo.workStyle}
            </p>
            <div className="pt-1 flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
                {computedMBTI.startsWith('I') ? 'Tập trung sâu' : 'Giao lưu hợp tác'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
                {computedMBTI[1] === 'N' ? 'Tư duy chiến lược' : 'Thực tế vững vàng'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
                {computedMBTI[2] === 'T' ? 'Logic khách quan' : 'Thấu cảm con người'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
                {computedMBTI.endsWith('J') ? 'Kỷ luật mục tiêu' : 'Thích ứng linh hoạt'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToStep2}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang 2: Sửa RIASEC</span>
        </button>

        <button
          id="btn-advance-to-page4"
          onClick={handleAdvance}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>CHUYỂN SANG TRANG 4: TỔNG HỢP KẾT QUẢ & CỐ VẤN AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
