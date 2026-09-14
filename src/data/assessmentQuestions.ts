import { AssessmentQuestion, DisambiguationQuestion } from '../types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ==========================================
  // 1. RIASEC - Khám phá Đặc trưng Tâm lý Holland
  // ==========================================
  {
    id: 'q-riasec-core',
    module: 'riasec',
    ageGroups: ['7-10', '11-14', '15-18', '19-24', '25+'],
    prompt: 'Hoạt động nào sau đây khiến bạn hứng thú nhất?',
    description: 'Chọn phương án phản ánh đúng sở thích tự nhiên của bạn',
    type: 'single-choice',
    options: [
      {
        label: 'Khám phá máy móc, mạch điện, dụng cụ cơ khí & kỹ thuật',
        value: 'R',
        emoji: '⚙️',
        riasecWeight: { R: 1.0 },
        interestTags: ['Robot & Cơ điện tử', 'Chế tạo mạch điện tử', 'Kỹ thuật cơ khí'],
        skillTags: ['Thiết kế mạch & Vi điều khiển (Arduino/ESP32)', 'Lắp ráp cơ điện']
      },
      {
        label: 'Giải quyết bài toán khó, nghiên cứu khoa học & phân tích dữ liệu',
        value: 'I',
        emoji: '🔬',
        riasecWeight: { I: 1.0 },
        interestTags: ['Giải quyết bài toán khó', 'Trí tuệ nhân tạo (AI)', 'Phân tích dữ liệu lớn'],
        skillTags: ['Toán học & Tư duy logic', 'Cấu trúc dữ liệu & Thuật toán', 'Phân tích dữ liệu']
      },
      {
        label: 'Thiết kế đồ họa, sáng tạo nội dung, mỹ thuật & ý tưởng mới',
        value: 'A',
        emoji: '🎨',
        riasecWeight: { A: 1.0 },
        interestTags: ['Thiết kế trải nghiệm người dùng (UX/UI)', 'Vẽ tranh & Nghệ thuật thị giác', 'Sáng tạo câu chuyện'],
        skillTags: ['Công cụ thiết kế Figma / UI', 'Cảm nhận thẩm mỹ màu sắc', 'Trí tưởng tượng sáng tạo']
      },
      {
        label: 'Tư vấn, giảng dạy, chăm sóc sức khỏe & hỗ trợ cộng đồng',
        value: 'S',
        emoji: '🤝',
        riasecWeight: { S: 1.0 },
        interestTags: ['Giúp đỡ bạn bè', 'Tâm lý học Người dùng', 'Y tế & Chăm sóc'],
        skillTags: ['Thuyết trình trước đám đông', 'Lắng nghe & Giúp đỡ bạn bè', 'Giao tiếp & Làm việc nhóm']
      },
      {
        label: 'Dẫn dắt đội ngũ, quản trị kinh doanh, đàm phán & khởi nghiệp',
        value: 'E',
        emoji: '📈',
        riasecWeight: { E: 1.0 },
        interestTags: ['Kinh doanh & Khởi nghiệp', 'Quản trị sản phẩm số', 'Nghiên cứu thị trường'],
        skillTags: ['Quản lý dự án', 'Phân tích nghiệp vụ kinh doanh', 'Giao tiếp & Đàm phán']
      },
      {
        label: 'Tổ chức dữ liệu, quản lý quy trình, lập kế hoạch chi tiết & kiểm toán',
        value: 'C',
        emoji: '📋',
        riasecWeight: { C: 1.0 },
        interestTags: ['Tổ chức hệ thống', 'Quản lý tài chính', 'Kiểm thử quy trình'],
        skillTags: ['Quản lý mã nguồn Git', 'Quy hoạch công việc', 'Cơ sở dữ liệu SQL']
      }
    ]
  },

  // ==========================================
  // 2. MBTI - Xu hướng Tính cách làm việc (Phụ trợ)
  // ==========================================
  {
    id: 'q-mbti-energy',
    module: 'mbti',
    ageGroups: ['7-10', '11-14', '15-18', '19-24', '25+'],
    prompt: 'Xu hướng nạp năng lượng và phong cách làm việc của bạn?',
    description: 'Đối chiếu chỉ số hướng nội (I) hoặc hướng ngoại (E)',
    type: 'single-choice',
    options: [
      {
        label: 'Hướng nội (I): Tập trung sâu độc lập, suy ngẫm kỹ lưỡng',
        value: 'I',
        emoji: '🧘',
        mbtiWeight: { dimension: 'IE', value: 'I' },
        riasecWeight: { I: 0.6, R: 0.4 }
      },
      {
        label: 'Hướng ngoại (E): Năng động khi trao đổi, thảo luận nhóm',
        value: 'E',
        emoji: '🗣️',
        mbtiWeight: { dimension: 'IE', value: 'E' },
        riasecWeight: { S: 0.6, E: 0.6 }
      }
    ]
  },
  {
    id: 'q-mbti-decision',
    module: 'mbti',
    ageGroups: ['11-14', '15-18', '19-24', '25+'],
    prompt: 'Khi đứng trước quyết định lớn, bạn ưu tiên yếu tố nào?',
    description: 'Đối chiếu chỉ số lý trí (T) hoặc cảm xúc (F)',
    type: 'single-choice',
    options: [
      {
        label: 'Lý trí & Logic (T): Dựa trên dữ liệu, nguyên lý khách quan',
        value: 'T',
        emoji: '⚖️',
        mbtiWeight: { dimension: 'TF', value: 'T' },
        riasecWeight: { I: 0.7, C: 0.5 }
      },
      {
        label: 'Cảm xúc & Giá trị (F): Thấu cảm, hòa hợp và tác động con người',
        value: 'F',
        emoji: '❤️',
        mbtiWeight: { dimension: 'TF', value: 'F' },
        riasecWeight: { S: 0.8, A: 0.5 }
      }
    ]
  },

  // ==========================================
  // 3. MÔN HỌC THẾ MẠNH & NĂNG LỰC
  // ==========================================
  {
    id: 'q-subjects-strength',
    module: 'subjects',
    ageGroups: ['7-10', '11-14', '15-18', '19-24', '25+'],
    prompt: 'Những lĩnh vực học tập / môn học bạn tự tin và yêu thích nhất?',
    description: 'Có thể chọn nhiều môn bạn đạt kết quả tốt',
    type: 'multi-choice',
    options: [
      { label: 'Tin học & Lập trình ứng dụng', value: 'Tin học & Lập trình', emoji: '💻', subjectTags: ['Tin học & Lập trình', 'Khoa học Máy tính'], riasecWeight: { I: 0.8, R: 0.5 } },
      { label: 'Toán học & Tư duy logic số học', value: 'Toán học', emoji: '📐', subjectTags: ['Toán học', 'Toán học Ứng dụng', 'Xác suất Thống kê'], riasecWeight: { I: 0.8, C: 0.5 } },
      { label: 'Vật lý & Cơ kỹ thuật', value: 'Vật lý', emoji: '⚡', subjectTags: ['Vật lý'], riasecWeight: { I: 0.8, R: 0.7 } },
      { label: 'Sinh học & Khoa học sức khỏe', value: 'Sinh học', emoji: '🧬', subjectTags: ['Sinh học', 'Khoa học Tự nhiên'], riasecWeight: { I: 0.8, S: 0.6 } },
      { label: 'Mỹ thuật, Thiết kế & Đồ họa', value: 'Mỹ thuật & Thiết kế', emoji: '🎨', subjectTags: ['Mỹ thuật & Thiết kế'], riasecWeight: { A: 0.95 } },
      { label: 'Ngoại ngữ & Văn học / Truyền thông', value: 'Ngoại ngữ', emoji: '📚', subjectTags: ['Tiếng Việt / Tập làm văn', 'Ngoại ngữ'], riasecWeight: { A: 0.7, S: 0.6 } },
      { label: 'Kinh tế & Quản trị kinh doanh', value: 'Kinh tế', emoji: '📊', subjectTags: ['Kinh tế & Khởi nghiệp'], riasecWeight: { E: 0.8, C: 0.6 } },
      { label: 'Tâm lý & Khoa học xã hội', value: 'Tâm lý học', emoji: '🧠', subjectTags: ['Tâm lý học Người dùng'], riasecWeight: { S: 0.85, I: 0.6 } }
    ]
  },

  // ==========================================
  // 4. KỸ NĂNG & NĂNG LỰC HIỆN CÓ
  // ==========================================
  {
    id: 'q-skills-self',
    module: 'skills',
    ageGroups: ['7-10', '11-14', '15-18', '19-24', '25+'],
    prompt: 'Kỹ năng nào bạn đang sở hữu hoặc tự tin rèn luyện?',
    description: 'Chọn các kỹ năng phù hợp với năng lực của bạn',
    type: 'multi-choice',
    options: [
      { label: 'Lập trình máy tính (Python, C++, JS, HTML/CSS)', value: 'Lập trình', emoji: '⌨️', skillTags: ['Lập trình (Python, C++, JS)', 'Lập trình Python & Thư viện Data Science'], riasecWeight: { I: 0.7, R: 0.5 } },
      { label: 'Phân tích dữ liệu & Thống kê định lượng', value: 'Dữ liệu', emoji: '📊', skillTags: ['Cấu trúc dữ liệu & Thuật toán', 'Phân tích thống kê & Toán mô hình'], riasecWeight: { I: 0.8, C: 0.6 } },
      { label: 'Thiết kế đồ họa, UI/UX (Figma, Canva, Photoshop)', value: 'Thiết kế', emoji: '🖌️', skillTags: ['Công cụ thiết kế Figma / UI', 'Vẽ tranh & Phác họa'], riasecWeight: { A: 0.9 } },
      { label: 'Chế tạo phần cứng, mạch điện tử (Arduino, hàn vi mạch)', value: 'Phần cứng', emoji: '🔌', skillTags: ['Thiết kế mạch & Vi điều khiển (Arduino/ESP32)', 'C++ & Vi điều khiển Arduino'], riasecWeight: { R: 0.9 } },
      { label: 'Giao tiếp, thuyết trình & làm việc nhóm', value: 'Giao tiếp', emoji: '👥', skillTags: ['Giao tiếp & Làm việc nhóm', 'Thuyết trình trước đám đông'], riasecWeight: { S: 0.8, E: 0.6 } },
      { label: 'Lập kế hoạch, quản lý thời gian & dự án', value: 'Quản lý', emoji: '📅', skillTags: ['Quản lý dự án', 'Quản lý mã nguồn Git'], riasecWeight: { C: 0.8, E: 0.6 } }
    ]
  },

  // ==========================================
  // 5. MỤC TIÊU & MÔI TRƯỜNG LÀM VIỆC
  // ==========================================
  {
    id: 'q-work-environment',
    module: 'workStyle',
    ageGroups: ['11-14', '15-18', '19-24', '25+'],
    prompt: 'Môi trường làm việc mong muốn trong tương lai của bạn?',
    description: 'Chọn môi trường giúp bạn phát huy tối đa năng lực',
    type: 'single-choice',
    options: [
      { label: 'Văn phòng công nghệ hiện đại / Làm việc linh hoạt Hybrid', value: 'Văn phòng công nghệ hiện đại', emoji: '🏢', riasecWeight: { I: 0.6, C: 0.5 } },
      { label: 'Phòng Lab nghiên cứu khoa học / Xưởng chế tạo kỹ thuật', value: 'Phòng lab nghiên cứu / Xưởng chế tạo', emoji: '🧪', riasecWeight: { R: 0.9, I: 0.7 } },
      { label: 'Bệnh viện, trường học, môi trường cộng đồng tương tác trực tiếp', value: 'Y tế / Giáo dục', emoji: '🏥', riasecWeight: { S: 0.9 } },
      { label: 'Studio thiết kế sáng tạo / Không gian tự do linh hoạt', value: 'Xưởng vẽ sáng tạo hoặc văn phòng thiết kế', emoji: '🎨', riasecWeight: { A: 0.9 } },
      { label: 'Doanh nghiệp năng động, giao tiếp khách hàng & đàm phán', value: 'Doanh nghiệp thương mại', emoji: '💼', riasecWeight: { E: 0.85, C: 0.5 } }
    ]
  },
  {
    id: 'q-career-priority',
    module: 'goals',
    ageGroups: ['11-14', '15-18', '19-24', '25+'],
    prompt: 'Ưu tiên lớn nhất của bạn trong sự nghiệp là gì?',
    description: 'Yếu tố cốt lõi dẫn đường cho các quyết định tương lai',
    type: 'single-choice',
    options: [
      { label: 'Tạo giá trị tri thức & giải quyết bài toán lớn', value: 'Tạo giá trị tri thức', emoji: '💡', riasecWeight: { I: 0.8 } },
      { label: 'Thu nhập tốt & lộ trình thăng tiến rõ ràng', value: 'Thu nhập tốt', emoji: '💰', riasecWeight: { E: 0.8, C: 0.6 } },
      { label: 'Tự do sáng tạo nghệ thuật & thể hiện bản thân', value: 'Tự do sáng tạo', emoji: '✨', riasecWeight: { A: 0.9 } },
      { label: 'Đóng góp xã hội & giúp đỡ con người', value: 'Đóng góp xã hội', emoji: '🌱', riasecWeight: { S: 0.9 } },
      { label: 'Công việc ổn định & cân bằng cuộc sống gia đình', value: 'Cân bằng cuộc sống', emoji: '⚖️', riasecWeight: { C: 0.7, S: 0.5 } }
    ]
  }
];

export const DISAMBIGUATION_QUESTIONS: Record<string, DisambiguationQuestion> = {
  'swe-vs-ds': {
    careerA: { id: 'software-engineer', title: 'Kỹ sư Phần mềm' },
    careerB: { id: 'ai-data-scientist', title: 'Nhà khoa học Dữ liệu & AI' },
    question: 'Bạn hứng thú hơn với việc xây dựng hệ thống phần mềm hoàn chỉnh hay khám phá quy luật toán học từ dữ liệu?',
    options: [
      {
        label: 'Xây dựng kiến trúc hệ thống, tối ưu hiệu năng và phát triển ứng dụng thực tế',
        favorsCareerId: 'software-engineer',
        impactDescription: 'Tăng trọng số Kỹ nghệ Phần mềm và Cấu trúc Hệ thống'
      },
      {
        label: 'Huấn luyện mô hình học máy, nghiên cứu thuật toán xác suất và tìm insight dữ liệu',
        favorsCareerId: 'ai-data-scientist',
        impactDescription: 'Tăng trọng số Nghiên cứu Toán học Ứng dụng và Trí tuệ Nhân tạo'
      }
    ]
  }
};
