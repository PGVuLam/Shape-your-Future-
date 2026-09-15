import { AssessmentQuestion, DisambiguationQuestion } from '../types';

// ==========================================
// 1. RIASEC QUESTION BANK (30 QUESTIONS: 5 per Holland Dimension)
// ==========================================

export interface RIASECQuestion {
  id: string;
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  groupNameVi: string;
  title: string;
  prompt: string;
  detail: string;
  icon: string;
}

export const RIASEC_QUESTION_BANK: Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', RIASECQuestion[]> = {
  // --- NHÓM R: REALISTIC (KỸ THUẬT, THỰC TẾ, CƠ KHÍ, VẬN HÀNH) ---
  R: [
    {
      id: 'riasec_r_1',
      dimension: 'R',
      groupNameVi: 'Thực tế & Kỹ thuật (Realistic)',
      title: 'Sửa chữa và tháo lắp máy móc',
      prompt: 'Tháo lắp đồ gia dụng, linh kiện máy tính hoặc tự tay sửa chữa mạch điện nhỏ trong nhà khi bị hỏng.',
      detail: 'Thích thao tác trực tiếp với tua-vít, kìm, mỏ hàn và tìm hiểu cấu tạo vật lý của các thiết bị.',
      icon: '⚙️'
    },
    {
      id: 'riasec_r_2',
      dimension: 'R',
      groupNameVi: 'Thực tế & Kỹ thuật (Realistic)',
      title: 'Lắp ráp mô hình kỹ thuật & Robot',
      prompt: 'Lắp ráp mô hình cơ khí chuyển động, robot giáo dục, máy bay điều khiển từ xa hoặc bộ xếp hình kỹ thuật (Technic).',
      detail: 'Hào hứng khi nhìn thấy các bánh răng, động cơ và trục khớp phối hợp nhịp nhàng trong thực tế.',
      icon: '🤖'
    },
    {
      id: 'riasec_r_3',
      dimension: 'R',
      groupNameVi: 'Thực tế & Kỹ thuật (Realistic)',
      title: 'Làm việc tại xưởng chế tạo & công trường',
      prompt: 'Trực tiếp làm việc tại xưởng thực hành, công trường xây dựng hoặc phòng máy tính thay vì chỉ ngồi học lý thuyết trong lớp.',
      detail: 'Ưa chuộng môi trường làm việc năng động, có sản phẩm vật lý cụ thể nhìn thấy và chạm vào được.',
      icon: '🏭'
    },
    {
      id: 'riasec_r_4',
      dimension: 'R',
      groupNameVi: 'Thực tế & Kỹ thuật (Realistic)',
      title: 'Hoạt động ngoài trời & Kỹ thuật nông nghiệp',
      prompt: 'Tham gia các hoạt động khảo sát địa hình ngoài trời, trồng cây nông nghiệp công nghệ cao hoặc chăm sóc vật nuôi.',
      detail: 'Yêu thích không gian tự nhiên rộng lớn, làm việc gắn liền với đất đai, cây trồng hoặc máy móc nông nghiệp.',
      icon: '🌱'
    },
    {
      id: 'riasec_r_5',
      dimension: 'R',
      groupNameVi: 'Thực tế & Kỹ thuật (Realistic)',
      title: 'Chế tác mộc, thủ công mỹ nghệ & vật liệu',
      prompt: 'Tự tay cưa cắt, đóng bàn ghế gỗ, hàn gắn kim loại hoặc tạo ra vật dụng hữu ích từ vật liệu tái chế.',
      detail: 'Có tính khéo tay, cẩn thận và kiên nhẫn khi hoàn thiện từng chi tiết cơ học bằng đôi tay.',
      icon: '🔨'
    }
  ],

  // --- NHÓM I: INVESTIGATIVE (NGHIÊN CỨU, TƯ DUY KHOA HỌC, PHÂN TÍCH) ---
  I: [
    {
      id: 'riasec_i_1',
      dimension: 'I',
      groupNameVi: 'Nghiên cứu & Khám phá (Investigative)',
      title: 'Giải toán khó & Câu đố tư duy logic',
      prompt: 'Thử thách bản thân với các bài toán nâng cao, câu đố logic hóc búa hoặc thuật toán lập trình phức tạp.',
      detail: 'Cảm thấy phấn khích tột độ khi tự mình tìm ra lời giải cho một câu hỏi đòi hỏi suy luận nhiều bước.',
      icon: '🧩'
    },
    {
      id: 'riasec_i_2',
      dimension: 'I',
      groupNameVi: 'Nghiên cứu & Khám phá (Investigative)',
      title: 'Đọc tài liệu khoa học & Công nghệ mới',
      prompt: 'Đọc sách khoa học, bài báo nghiên cứu hoặc tìm hiểu nguyên lý vận hành của trí tuệ nhân tạo (AI) và công nghệ vũ trụ.',
      detail: 'Luôn tò mò muốn biết “Tại sao?” và bản chất cơ chế khoa học đứng sau các hiện tượng trong đời sống.',
      icon: '🔬'
    },
    {
      id: 'riasec_i_3',
      dimension: 'I',
      groupNameVi: 'Nghiên cứu & Khám phá (Investigative)',
      title: 'Làm thí nghiệm kiểm chứng giả thuyết',
      prompt: 'Tiến hành các thí nghiệm trong phòng Lab (Vật lý, Hóa học, Sinh học) để quan sát phản ứng và rút ra kết luận.',
      detail: 'Tôn trọng bằng chứng thực nghiệm, quy trình nghiên cứu chuẩn mực và tính chính xác của số liệu.',
      icon: '🧪'
    },
    {
      id: 'riasec_i_4',
      dimension: 'I',
      groupNameVi: 'Nghiên cứu & Khám phá (Investigative)',
      title: 'Phân tích dữ liệu & Tìm quy luật ẩn',
      prompt: 'Khảo sát các biểu đồ thống kê, bảng số liệu lớn để phát hiện xu hướng và dự đoán diễn biến tương lai.',
      detail: 'Thích sử dụng phần mềm, công cụ tính toán để lượng hóa và giải quyết các bài toán thực tiễn.',
      icon: '📊'
    },
    {
      id: 'riasec_i_5',
      dimension: 'I',
      groupNameVi: 'Nghiên cứu & Khám phá (Investigative)',
      title: 'Tìm nguyên nhân gốc rễ của sự cố',
      prompt: 'Dành hàng giờ đào sâu tìm kiếm nguyên nhân cốt lõi khi một chương trình bị lỗi (bug) hoặc một hiện tượng bất thường xảy ra.',
      detail: 'Có khả năng tập trung cao độ, tư duy phản biện sắc bén và không chấp nhận những lời giải thích hời hợt.',
      icon: '🔍'
    }
  ],

  // --- NHÓM A: ARTISTIC (NGHỆ THUẬT, SÁNG TẠO, THẨM MỸ) ---
  A: [
    {
      id: 'riasec_a_1',
      dimension: 'A',
      groupNameVi: 'Nghệ thuật & Sáng tạo (Artistic)',
      title: 'Thiết kế đồ họa & Giao diện thị giác',
      prompt: 'Vẽ tranh, thiết kế banner, phác thảo logo, dựng video clip ngắn hoặc sáng tạo giao diện ứng dụng (UI/UX) đẹp mắt.',
      detail: 'Có cảm nhận tinh tế về màu sắc, bố cục, phông chữ và hình ảnh truyền tải thông điệp.',
      icon: '🎨'
    },
    {
      id: 'riasec_a_2',
      dimension: 'A',
      groupNameVi: 'Nghệ thuật & Sáng tạo (Artistic)',
      title: 'Sáng tác văn học, kịch bản & Nội dung số',
      prompt: 'Viết truyện, sáng tác thơ, viết bài cảm nhận sâu sắc trên mạng xã hội hoặc xây dựng kịch bản video sáng tạo.',
      detail: 'Yêu thích sức mạnh của ngôn từ và khả năng biểu đạt cảm xúc, ý tưởng độc đáo đến người đọc.',
      icon: '✍️'
    },
    {
      id: 'riasec_a_3',
      dimension: 'A',
      groupNameVi: 'Nghệ thuật & Sáng tạo (Artistic)',
      title: 'Âm nhạc, biểu diễn & Âm thanh',
      prompt: 'Chơi một nhạc cụ, ca hát, phối nhạc điện tử (beatmaking) hoặc tham gia câu lạc bộ kịch nghệ sân khấu.',
      detail: 'Tìm thấy niềm vui và sự tự do khi biểu đạt tâm hồn thông qua giai điệu và nghệ thuật trình diễn.',
      icon: '🎵'
    },
    {
      id: 'riasec_a_4',
      dimension: 'A',
      groupNameVi: 'Nghệ thuật & Sáng tạo (Artistic)',
      title: 'Thiết kế thời trang & Không gian sống',
      prompt: 'Phối trang phục thời trang độc đáo, trang trí góc học tập hoặc tự lên ý tưởng cải tạo không gian phòng ốc.',
      detail: 'Thích thể hiện phong cách cá nhân riêng biệt và không muốn rập khuôn theo số đông.',
      icon: '✨'
    },
    {
      id: 'riasec_a_5',
      dimension: 'A',
      groupNameVi: 'Nghệ thuật & Sáng tạo (Artistic)',
      title: 'Tự do sáng tạo, không gò bó quy tắc',
      prompt: 'Làm việc trong môi trường tự do, linh hoạt, được khuyến khích đưa ra các ý tưởng táo bạo chưa từng có.',
      detail: 'Thường cảm thấy ngột ngạt nếu phải lặp đi lặp lại những quy định cứng nhắc hoặc bài tập đơn điệu.',
      icon: '💡'
    }
  ],

  // --- NHÓM S: SOCIAL (XÃ HỘI, GIÁO DỤC, CHĂM SÓC, KẾT NỐI) ---
  S: [
    {
      id: 'riasec_s_1',
      dimension: 'S',
      groupNameVi: 'Xã hội & Giúp đỡ (Social)',
      title: 'Giảng giải bài học & Dìu dắt người khác',
      prompt: 'Kiên nhẫn hướng dẫn, giải thích bài tập cho bạn cùng lớp hoặc dạy dỗ, chia sẻ kỹ năng cho các em nhỏ khóa dưới.',
      detail: 'Cảm thấy hạnh phúc khi thấy người khác hiểu bài, tiến bộ và tự tin hơn nhờ sự hỗ trợ của mình.',
      icon: '📚'
    },
    {
      id: 'riasec_s_2',
      dimension: 'S',
      groupNameVi: 'Xã hội & Giúp đỡ (Social)',
      title: 'Lắng nghe & Tư vấn tâm lý bạn bè',
      prompt: 'Lắng nghe những tâm sự buồn vui của người xung quanh, thấu cảm và đưa ra lời khuyên chân thành giúp họ vượt qua khó khăn.',
      detail: 'Được bạn bè tin cậy tìm đến mỗi khi cần một chỗ dựa tinh thần hoặc người đồng hành tâm lý.',
      icon: '🤝'
    },
    {
      id: 'riasec_s_3',
      dimension: 'S',
      groupNameVi: 'Xã hội & Giúp đỡ (Social)',
      title: 'Hoạt động tình nguyện & Phụng sự cộng đồng',
      prompt: 'Tham gia các chiến dịch tình nguyện Mùa hè xanh, quyên góp sách vở, bảo vệ môi trường hoặc giúp đỡ trẻ em cơ nhỡ.',
      detail: 'Mong muốn đóng góp sức lực tuổi trẻ để xây dựng một xã hội nhân văn, công bằng và ấm áp hơn.',
      icon: '🌱'
    },
    {
      id: 'riasec_s_4',
      dimension: 'S',
      groupNameVi: 'Xã hội & Giúp đỡ (Social)',
      title: 'Chăm sóc sức khỏe & Kỹ năng sơ cấp cứu',
      prompt: 'Tìm hiểu kiến thức y tế, dinh dưỡng, cách sơ cấp cứu ban đầu hoặc chăm sóc người thân khi ốm đau.',
      detail: 'Có tấm lòng trắc ẩn, chu đáo và xem trọng sức khỏe cũng như tính mạng con người.',
      icon: '🩺'
    },
    {
      id: 'riasec_s_5',
      dimension: 'S',
      groupNameVi: 'Xã hội & Giúp đỡ (Social)',
      title: 'Hòa giải mâu thuẫn & Kết nối tập thể',
      prompt: 'Đứng ra làm cầu nối hòa giải, lắng nghe các góc nhìn đa chiều khi các thành viên trong nhóm bất đồng quan điểm.',
      detail: 'Đề cao tinh thần đoàn kết, bầu không khí thân thiện và sự tôn trọng lẫn nhau trong mọi tập thể.',
      icon: '🕊️'
    }
  ],

  // --- NHÓM E: ENTERPRISING (QUẢN TRỊ, LÃNH ĐẠO, KINH DOANH, THUYẾT PHỤC) ---
  E: [
    {
      id: 'riasec_e_1',
      dimension: 'E',
      groupNameVi: 'Quản trị & Khởi nghiệp (Enterprising)',
      title: 'Dẫn dắt đội ngũ & Làm lớp trưởng / Trưởng nhóm',
      prompt: 'Đảm nhận vai trò trưởng nhóm dự án, ban cán sự lớp, phân chia công việc rõ ràng và thúc đẩy mọi người hoàn thành mục tiêu.',
      detail: 'Tự tin ra quyết định, có năng lượng lan tỏa và khả năng tạo động lực cho cả tập thể.',
      icon: '👑'
    },
    {
      id: 'riasec_e_2',
      dimension: 'E',
      groupNameVi: 'Quản trị & Khởi nghiệp (Enterprising)',
      title: 'Ý tưởng kinh doanh & Bán hàng gây quỹ',
      prompt: 'Lên kế hoạch bán quà lưu niệm, đồ uống hội chợ trường học hoặc nảy ra các ý tưởng khởi nghiệp kinh doanh độc đáo.',
      detail: 'Nhạy bén với cơ hội thị trường, thích tính toán lợi nhuận và tìm cách tối ưu hóa doanh thu.',
      icon: '📈'
    },
    {
      id: 'riasec_e_3',
      dimension: 'E',
      groupNameVi: 'Quản trị & Khởi nghiệp (Enterprising)',
      title: 'Thuyết trình, tranh biện & Đàm phán',
      prompt: 'Đứng trước lớp thuyết trình bảo vệ đề án, tham gia câu lạc bộ tranh biện (debate) hoặc thuyết phục bạn bè theo ý kiến của mình.',
      detail: 'Có tài hùng biện, diễn đạt gãy gọn, tự tin trước đám đông và linh hoạt ứng biến trong các cuộc đối thoại.',
      icon: '🎤'
    },
    {
      id: 'riasec_e_4',
      dimension: 'E',
      groupNameVi: 'Quản trị & Khởi nghiệp (Enterprising)',
      title: 'Lập kế hoạch chiến lược & Phân bổ ngân sách',
      prompt: 'Tổ chức sự kiện lớn tại trường, lập ngân sách chi tiêu, mời nhà tài trợ và kiểm soát tiến độ từng khâu chuẩn bị.',
      detail: 'Có tầm nhìn chiến lược, khả năng quản lý nguồn lực hiệu quả để đạt thành công tối ưu.',
      icon: '💼'
    },
    {
      id: 'riasec_e_5',
      dimension: 'E',
      groupNameVi: 'Quản trị & Khởi nghiệp (Enterprising)',
      title: 'Chinh phục mục tiêu lớn & Khát vọng thành công',
      prompt: 'Thích cạnh tranh lành mạnh, dám chấp nhận rủi ro có tính toán và khao khát xây dựng sự nghiệp thành đạt, vị thế xã hội cao.',
      detail: 'Luôn đặt mục tiêu cao hơn giới hạn hiện tại và không ngừng nỗ lực để vươn lên vị trí hàng đầu.',
      icon: '🏆'
    }
  ],

  // --- NHÓM C: CONVENTIONAL (TỔ CHỨC, QUY TRÌNH, CHI TIẾT, KỶ LUẬT) ---
  C: [
    {
      id: 'riasec_c_1',
      dimension: 'C',
      groupNameVi: 'Quy trình & Chi tiết (Conventional)',
      title: 'Lập thời gian biểu & Quản lý lịch trình',
      prompt: 'Tạo thời gian biểu học tập chi tiết theo từng ngày, sử dụng sổ tay/ứng dụng Notion để theo dõi tiến độ công việc.',
      detail: 'Cảm thấy an tâm và làm việc năng suất nhất khi mọi thứ được lên kế hoạch rõ ràng từ trước.',
      icon: '📅'
    },
    {
      id: 'riasec_c_2',
      dimension: 'C',
      groupNameVi: 'Quy trình & Chi tiết (Conventional)',
      title: 'Sắp xếp hồ sơ & Dữ liệu ngăn nắp',
      prompt: 'Sắp xếp tài liệu học tập, phân loại tệp tin trên máy tính theo các thư mục khoa học, đặt tên chuẩn mực dễ tìm kiếm.',
      detail: 'Yêu thích sự trật tự, ngăn nắp, ghét sự bừa bộn và làm việc luôn có hệ thống.',
      icon: '📁'
    },
    {
      id: 'riasec_c_3',
      dimension: 'C',
      groupNameVi: 'Quy trình & Chi tiết (Conventional)',
      title: 'Rà soát lỗi chính tả & Tính toán sổ sách',
      prompt: 'Kiểm tra kỹ lưỡng từng con số trong bảng tính Excel, rà soát lỗi chính tả, câu cú trong văn bản trước khi nộp.',
      detail: 'Có tính cẩn thận, mắt nhìn chi tiết sắc bén và sự kiên nhẫn cao với các công việc đòi hỏi độ chính xác tuyệt đối.',
      icon: '📑'
    },
    {
      id: 'riasec_c_4',
      dimension: 'C',
      groupNameVi: 'Quy trình & Chi tiết (Conventional)',
      title: 'Tuân thủ quy chuẩn & Hướng dẫn từng bước',
      prompt: 'Thực hiện công việc theo đúng quy chuẩn, biểu mẫu và chỉ dẫn từng bước đã được kiểm chứng an toàn.',
      detail: 'Tôn trọng kỷ luật, tính minh bạch và độ tin cậy trong mọi hoạt động học tập và làm việc.',
      icon: '📋'
    },
    {
      id: 'riasec_c_5',
      dimension: 'C',
      groupNameVi: 'Quy trình & Chi tiết (Conventional)',
      title: 'Ghi chép nhật ký chi tiêu & Quản trị tài chính',
      prompt: 'Ghi lại chi tiết từng khoản thu chi cá nhân, lưu giữ hóa đơn và lập ngân sách tiết kiệm hợp lý hàng tháng.',
      detail: 'Quản lý tài chính cá nhân chặt chẽ, biết tính toán chi tiêu bền vững và tránh lãng phí.',
      icon: '💵'
    }
  ]
};

// Flattened 30 RIASEC questions array
export const RIASEC_QUESTIONS_30: RIASECQuestion[] = [
  ...RIASEC_QUESTION_BANK.R,
  ...RIASEC_QUESTION_BANK.I,
  ...RIASEC_QUESTION_BANK.A,
  ...RIASEC_QUESTION_BANK.S,
  ...RIASEC_QUESTION_BANK.E,
  ...RIASEC_QUESTION_BANK.C
];

// Alias for standard usage across views
export const RIASEC_QUESTIONS_STANDARD = RIASEC_QUESTIONS_30;

// Standard 5-point Likert scale options
export const RIASEC_SCALE_OPTIONS = [
  { value: 1, label: 'Hoàn toàn không thích', emoji: '😣', desc: 'Rất ghét hoặc không bao giờ muốn làm' },
  { value: 2, label: 'Không thích', emoji: '🙁', desc: 'Hơi ngại, ít hứng thú' },
  { value: 3, label: 'Bình thường', emoji: '😐', desc: 'Trung lập, làm cũng được' },
  { value: 4, label: 'Thích', emoji: '🙂', desc: 'Có hứng thú, sẵn sàng làm' },
  { value: 5, label: 'Rất thích', emoji: '😍', desc: 'Đam mê, cực kỳ hào hứng' }
];

// ==========================================
// 2. MBTI QUESTION BANK (16 QUESTIONS: 4 per Dimension)
// ==========================================

export interface MBTIOption {
  text: string;
  value: 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  description: string;
  label?: string;
  desc?: string;
  trait?: 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export interface MBTIQuestion {
  id: string;
  dimension: 'IE' | 'SN' | 'TF' | 'JP';
  dimensionLabelVi: string;
  dimensionLabel?: string;
  title: string;
  prompt: string;
  question?: string;
  optionA: MBTIOption;
  optionB: MBTIOption;
}

export const MBTI_QUESTION_BANK: Record<'IE' | 'SN' | 'TF' | 'JP', MBTIQuestion[]> = {
  // --- CẶP 1: HƯỚNG NGOẠI (E) vs HƯỚNG NỘI (I) ---
  IE: [
    {
      id: 'mbti_ie_1',
      dimension: 'IE',
      dimensionLabelVi: 'Nạp năng lượng: Hướng nội (I) vs Hướng ngoại (E)',
      title: 'Cách bạn hồi phục năng lượng sau tuần học căng thẳng',
      prompt: 'Sau một tuần học tập hoặc làm việc căng thẳng, hoạt động nào giúp bạn sạc lại năng lượng tốt nhất?',
      optionA: {
        value: 'I',
        text: 'Nghỉ ngơi yên tĩnh một mình (đọc sách, nghe nhạc, chơi game hoặc ở trong phòng riêng)',
        description: 'Tái tạo năng lượng từ bên trong thế giới nội tâm tĩnh lặng.'
      },
      optionB: {
        value: 'E',
        text: 'Gặp gỡ bạn bè, đi cafe, dạo phố hoặc tham gia các hoạt động tập thể sôi nổi ngoài trời',
        description: 'Được tiếp thêm sinh khí và phấn chấn khi tương tác với mọi người.'
      }
    },
    {
      id: 'mbti_ie_2',
      dimension: 'IE',
      dimensionLabelVi: 'Nạp năng lượng: Hướng nội (I) vs Hướng ngoại (E)',
      title: 'Phản xạ khi bước vào một môi trường tập thể mới',
      prompt: 'Khi tham gia một lớp học mới, câu lạc bộ mới hoặc bữa tiệc đông người lạ, bạn thường:',
      optionA: {
        value: 'I',
        text: 'Quan sát xung quanh trước, chỉ mở lời khi cảm thấy an tâm và thường gắn bó với 1-2 người bạn thân',
        description: 'Thận trọng, giữ khoảng cách quan sát trước khi hòa nhập sâu.'
      },
      optionB: {
        value: 'E',
        text: 'Chủ động chào hỏi, bắt chuyện làm quen với nhiều bạn mới và dễ dàng hòa vào không khí chung',
        description: 'Cởi mở, nhiệt tình kết nối và tạo thiện cảm tức thì.'
      }
    },
    {
      id: 'mbti_ie_3',
      dimension: 'IE',
      dimensionLabelVi: 'Nạp năng lượng: Hướng nội (I) vs Hướng ngoại (E)',
      title: 'Không gian làm việc và học tập yêu thích',
      prompt: 'Bạn cảm thấy tập trung và đạt năng suất học tập cao nhất khi:',
      optionA: {
        value: 'I',
        text: 'Làm việc độc lập trong góc học tập riêng tư, yên tĩnh và không bị ai làm gián đoạn dòng suy nghĩ',
        description: 'Tư duy sâu sắc và tập trung liên tục khi không gian tĩnh lặng.'
      },
      optionB: {
        value: 'E',
        text: 'Học nhóm, cùng trao đổi ý kiến liên tục và có bạn bè xung quanh để cùng thảo luận',
        description: 'Ý tưởng nảy nở nhanh chóng khi cùng trao đổi qua lại với đồng đội.'
      }
    },
    {
      id: 'mbti_ie_4',
      dimension: 'IE',
      dimensionLabelVi: 'Nạp năng lượng: Hướng nội (I) vs Hướng ngoại (E)',
      title: 'Thói quen bày tỏ suy nghĩ trong các cuộc thảo luận',
      prompt: 'Khi được hỏi ý kiến trong một cuộc thảo luận nhóm, bạn thường:',
      optionA: {
        value: 'I',
        text: 'Suy nghĩ, cân nhắc thật kỹ trong đầu câu từ trước khi phát biểu ra bằng lời',
        description: 'Chỉ phát biểu khi ý tưởng đã chín muồi và có lập luận rõ ràng.'
      },
      optionB: {
        value: 'E',
        text: 'Nói ngay những gì đang nảy ra trong đầu và vừa nói vừa hoàn thiện dần suy nghĩ',
        description: 'Thoải mái thử nghiệm ý tưởng bằng cách nói ra trực tiếp để mọi người góp ý.'
      }
    }
  ],

  // --- CẶP 2: THỰC TẾ (S) vs TRỰC GIÁC (N) ---
  SN: [
    {
      id: 'mbti_sn_1',
      dimension: 'SN',
      dimensionLabelVi: 'Tiếp nhận thông tin: Thực tế (S) vs Trực giác (N)',
      title: 'Góc nhìn trọng tâm khi tiếp cận một vấn đề',
      prompt: 'Khi bắt đầu nghiên cứu một chủ đề hoặc dự án, bạn thường chú ý nhất đến:',
      optionA: {
        value: 'S',
        text: 'Các sự thật cụ thể, số liệu thực tế trước mắt và những điều mắt thấy tai nghe rõ ràng',
        description: 'Tập trung vào thực tế khách quan, độ chính xác của từng chi tiết.'
      },
      optionB: {
        value: 'N',
        text: 'Bức tranh toàn cảnh, ý nghĩa tiềm ẩn, xu hướng phát triển và các khả năng mới trong tương lai',
        description: 'Nhìn xa trông rộng, thích liên tưởng và tưởng tượng các viễn cảnh.'
      }
    },
    {
      id: 'mbti_sn_2',
      dimension: 'SN',
      dimensionLabelVi: 'Tiếp nhận thông tin: Thực tế (S) vs Trực giác (N)',
      title: 'Cách bạn tiếp thu kiến thức bài học mới',
      prompt: 'Khi học một bài học hoặc kỹ năng mới, bạn tiếp thu dễ dàng nhất bằng cách nào?',
      optionA: {
        value: 'S',
        text: 'Có ví dụ minh họa thực tế, bài tập mẫu cụ thể và hướng dẫn từng bước một',
        description: 'Thích ứng dụng thực hành ngay với các hướng dẫn rõ ràng.'
      },
      optionB: {
        value: 'N',
        text: 'Hiểu được nguyên lý bao quát, bản chất triết lý và mối liên hệ giữa các khái niệm với nhau',
        description: 'Hứng thú với mô hình lý thuyết và sự liên kết trừu tượng.'
      }
    },
    {
      id: 'mbti_sn_3',
      dimension: 'SN',
      dimensionLabelVi: 'Tiếp nhận thông tin: Thực tế (S) vs Trực giác (N)',
      title: 'Sự tin tưởng vào kinh nghiệm so với cái mới',
      prompt: 'Khi giải quyết một công việc, bạn có xu hướng:',
      optionA: {
        value: 'S',
        text: 'Áp dụng các phương pháp truyền thống đã được chứng minh hiệu quả và tin vào kinh nghiệm thực tế',
        description: 'Đảm bảo tính chắc chắn, hạn chế tối đa rủi ro không cần thiết.'
      },
      optionB: {
        value: 'N',
        text: 'Thử nghiệm phương pháp hoàn toàn mới, sáng tạo cách làm khác biệt dù chưa ai từng thử',
        description: 'Thích đổi mới sáng tạo và tìm tòi con đường đột phá.'
      }
    },
    {
      id: 'mbti_sn_4',
      dimension: 'SN',
      dimensionLabelVi: 'Tiếp nhận thông tin: Thực tế (S) vs Trực giác (N)',
      title: 'Phong cách miêu tả hoặc kể lại câu chuyện',
      prompt: 'Khi kể lại một chuyến đi hoặc một sự kiện cho người khác nghe, bạn thường:',
      optionA: {
        value: 'S',
        text: 'Kể tuần tự theo thời gian, chi tiết từng sự việc xảy ra, người tham gia và địa điểm cụ thể',
        description: 'Chân thực, mạch lạc và bám sát diễn biến thực tế.'
      },
      optionB: {
        value: 'N',
        text: 'Nhấn mạnh vào cảm xúc chung, thông điệp nổi bật, ấn tượng sâu sắc và những điều liên tưởng',
        description: 'Truyền cảm hứng, tập trung vào ý nghĩa và góc nhìn độc đáo.'
      }
    }
  ],

  // --- CẶP 3: LÝ TRÍ (T) vs CẢM XÚC (F) ---
  TF: [
    {
      id: 'mbti_tf_1',
      dimension: 'TF',
      dimensionLabelVi: 'Đưa ra quyết định: Lý trí (T) vs Cảm xúc (F)',
      title: 'Nguyên tắc chủ đạo khi đưa ra quyết định quan trọng',
      prompt: 'Khi đứng trước một quyết định lớn (chọn ngành, chọn trường, đánh giá một việc), bạn ưu tiên:',
      optionA: {
        value: 'T',
        text: 'Phân tích logic khách quan, cân nhắc ưu - nhược điểm rõ ràng và tôn trọng sự thật công bằng',
        description: 'Tách rời cảm xúc cá nhân để đảm bảo tính đúng đắn và chuẩn xác.'
      },
      optionB: {
        value: 'F',
        text: 'Cân nhắc tác động đến con người, lắng nghe cảm xúc con tim và gìn giữ sự hòa thuận, đồng cảm',
        description: 'Đề cao giá trị nhân văn và hạnh phúc của những người liên quan.'
      }
    },
    {
      id: 'mbti_tf_2',
      dimension: 'TF',
      dimensionLabelVi: 'Đưa ra quyết định: Lý trí (T) vs Cảm xúc (F)',
      title: 'Cách bạn phản ứng khi bạn bè gặp chuyện buồn',
      prompt: 'Khi một người bạn thân gặp chuyện buồn và tìm đến bạn tâm sự, phản xạ đầu tiên của bạn là:',
      optionA: {
        value: 'T',
        text: 'Phân tích nguyên nhân vấn đề và gợi ý các giải pháp thực tế để bạn mình khắc phục sự cố ngay',
        description: 'Giúp đỡ bằng hành động cụ thể và tư duy giải quyết vấn đề.'
      },
      optionB: {
        value: 'F',
        text: 'Lắng nghe, ôm bạn an ủi, chia sẻ nỗi buồn để bạn cảm nhận được tình thương và sự đồng cảm',
        description: 'Chữa lành bằng sự lắng nghe ấm áp và thấu cảm cảm xúc trước tiên.'
      }
    },
    {
      id: 'mbti_tf_3',
      dimension: 'TF',
      dimensionLabelVi: 'Đưa ra quyết định: Lý trí (T) vs Cảm xúc (F)',
      title: 'Thái độ trong các cuộc tranh luận quan điểm',
      prompt: 'Trong một cuộc tranh luận sôi nổi về một vấn đề học tập hoặc xã hội, bạn coi trọng nhất:',
      optionA: {
        value: 'T',
        text: 'Sự thật công tâm và tính chính xác của lập luận, dù đôi khi điều đó có thể làm người khác phật ý',
        description: 'Tôn trọng sự thật khách quan và tính logic của vấn đề.'
      },
      optionB: {
        value: 'F',
        text: 'Cách cư xử tế nhị, giữ gìn sự hòa khí trong nhóm và tránh làm tổn thương tự ái của người đối diện',
        description: 'Bảo vệ mối quan hệ tốt đẹp và xây dựng sự thấu hiểu chân thành.'
      }
    },
    {
      id: 'mbti_tf_4',
      dimension: 'TF',
      dimensionLabelVi: 'Đưa ra quyết định: Lý trí (T) vs Cảm xúc (F)',
      title: 'Lời khen khiến bạn cảm thấy tự hào nhất',
      prompt: 'Bạn cảm thấy tự hào và được công nhận nhiều hơn khi được ai đó khen là:',
      optionA: {
        value: 'T',
        text: '“Bạn là người rất thông minh, tư duy sắc bén, công bằng và có năng lực giải quyết vấn đề xuất sắc!”',
        description: 'Tự hào về năng lực trí tuệ và sự chuẩn mực logic.'
      },
      optionB: {
        value: 'F',
        text: '“Bạn là người vô cùng ấm áp, biết quan tâm, thấu hiểu và luôn mang lại niềm vui cho mọi người!”',
        description: 'Tự hào về tấm lòng nhân ái và sự kết nối yêu thương.'
      }
    }
  ],

  // --- CẶP 4: NGUYÊN TẮC (J) vs LINH HOẠT (P) ---
  JP: [
    {
      id: 'mbti_jp_1',
      dimension: 'JP',
      dimensionLabelVi: 'Phong cách tổ chức: Nguyên tắc (J) vs Linh hoạt (P)',
      title: 'Kế hoạch học tập và thời gian biểu mỗi ngày',
      prompt: 'Trước khi bắt đầu một tuần học tập mới hoặc một chuyến dã ngoại, bạn thường:',
      optionA: {
        value: 'J',
        text: 'Lên lịch trình cụ thể từng việc, chuẩn bị sẵn danh sách việc cần làm (to-do list) và bám sát kế hoạch',
        description: 'Cảm thấy yên tâm và kiểm soát tốt khi mọi thứ diễn ra đúng lịch.'
      },
      optionB: {
        value: 'P',
        text: 'Để mọi việc diễn ra tự nhiên, tùy cơ ứng biến theo cảm hứng và không thích bị ràng buộc bởi lịch cứng',
        description: 'Yêu thích sự tự do, ngẫu hứng và khả năng xoay xở linh hoạt.'
      }
    },
    {
      id: 'mbti_jp_2',
      dimension: 'JP',
      dimensionLabelVi: 'Phong cách tổ chức: Nguyên tắc (J) vs Linh hoạt (P)',
      title: 'Thói quen xử lý bài tập và hạn chót (Deadline)',
      prompt: 'Khi được thầy cô giao một bài tập lớn hoặc dự án có hạn nộp xa (1 tháng), bạn thường:',
      optionA: {
        value: 'J',
        text: 'Làm ngay từ sớm, hoàn thành trước hạn vài ngày để tránh cảm giác bị dồn việc hoặc lo lắng phút cuối',
        description: 'Ưu tiên sự an toàn, giải quyết sớm để đầu óc thanh thản.'
      },
      optionB: {
        value: 'P',
        text: 'Thường tìm thấy cảm hứng và năng lượng sáng tạo bùng nổ nhất khi gần sát đến hạn chót (deadline)',
        description: 'Làm việc bứt phá dưới áp lực thời gian và giàu tính thích nghi.'
      }
    },
    {
      id: 'mbti_jp_3',
      dimension: 'JP',
      dimensionLabelVi: 'Phong cách tổ chức: Nguyên tắc (J) vs Linh hoạt (P)',
      title: 'Bàn học và không gian sống xung quanh',
      prompt: 'Không gian góc học tập hoặc đồ đạc cá nhân của bạn thường ở trong trạng thái:',
      optionA: {
        value: 'J',
        text: 'Ngăn nắp, gọn gàng, đồ vật nào ở vị trí nấy để khi cần là tìm thấy ngay lập tức',
        description: 'Trật tự không gian giúp tâm trí tập trung và minh mẫn.'
      },
      optionB: {
        value: 'P',
        text: 'Hơi bừa bộn một chút nhưng là “sự bừa bộn có tổ chức riêng”, bạn vẫn nhớ vị trí đồ khi cần',
        description: 'Không quá câu nệ hình thức, ưu tiên sự thoải mái và tự do sáng tạo.'
      }
    },
    {
      id: 'mbti_jp_4',
      dimension: 'JP',
      dimensionLabelVi: 'Phong cách tổ chức: Nguyên tắc (J) vs Linh hoạt (P)',
      title: 'Thái độ sau khi đã đưa ra một lựa chọn',
      prompt: 'Sau khi bạn đã thống nhất đưa ra một quyết định (ví dụ: chọn đề tài thuyết trình), bạn thường:',
      optionA: {
        value: 'J',
        text: 'Kiên định thực hiện đến cùng kế hoạch đã định và không muốn thay đổi trừ khi thực sự bắt buộc',
        description: 'Tập trung hoàn thành dứt điểm mục tiêu đã đề ra.'
      },
      optionB: {
        value: 'P',
        text: 'Sẵn sàng thay đổi linh hoạt nếu phát hiện thêm thông tin mới hay ho hơn hoặc thấy hướng đi thú vị hơn',
        description: 'Luôn giữ các phương án mở để đón nhận cơ hội bất ngờ.'
      }
    }
  ]
};

// Helper to ensure full compatibility for any access style
const normalizeMBTIQuestion = (q: MBTIQuestion): MBTIQuestion => ({
  ...q,
  dimensionLabel: q.dimensionLabelVi,
  question: q.prompt,
  optionA: {
    ...q.optionA,
    label: q.optionA.text,
    desc: q.optionA.description,
    trait: q.optionA.value
  },
  optionB: {
    ...q.optionB,
    label: q.optionB.text,
    desc: q.optionB.description,
    trait: q.optionB.value
  }
});

// Normalize all questions in bank
Object.keys(MBTI_QUESTION_BANK).forEach(key => {
  const k = key as 'IE' | 'SN' | 'TF' | 'JP';
  MBTI_QUESTION_BANK[k] = MBTI_QUESTION_BANK[k].map(normalizeMBTIQuestion);
});

// Flattened 16 MBTI questions array
export const MBTI_QUESTIONS_16: MBTIQuestion[] = [
  ...MBTI_QUESTION_BANK.IE,
  ...MBTI_QUESTION_BANK.SN,
  ...MBTI_QUESTION_BANK.TF,
  ...MBTI_QUESTION_BANK.JP
];

// Alias for standard usage across views
export const MBTI_QUESTIONS_STANDARD = MBTI_QUESTIONS_16;

// ==========================================
// 3. LEGACY GENERAL ASSESSMENT QUESTIONS (Preserved for backwards compatibility)
// ==========================================

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
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
