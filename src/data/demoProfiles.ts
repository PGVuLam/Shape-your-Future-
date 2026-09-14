import { UserProfile } from '../types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  'demo-hs-tech': {
    id: 'demo-hs-tech',
    name: 'Minh Tuấn (Học sinh THPT - Định hướng KHKT)',
    age: 16,
    ageGroup: '15-18',
    educationLevel: 'Trung học Phổ thông',
    grade: 'Lớp 11 (Ban Tự nhiên - STEM)',
    location: 'Hà Nội, Việt Nam',
    favoriteSubjects: ['Tin học & Lập trình', 'Toán học', 'Vật lý'],
    interests: ['Lập trình phần mềm', 'Robot & Cơ điện tử', 'Giải quyết bài toán khó', 'Chế tạo mạch điện tử'],
    skills: ['Lập trình (Python, C++, JS)', 'Cấu trúc dữ liệu & Thuật toán', 'Thiết kế mạch & Vi điều khiển (Arduino/ESP32)'],
    selfRatedSkills: [
      { skill: 'Lập trình Python', level: 'Strong', category: 'Technical' },
      { skill: 'Toán học & Tư duy logic', level: 'Strong', category: 'Technical' },
      { skill: 'C++ & Vi điều khiển Arduino', level: 'Developing', category: 'Technical' },
      { skill: 'Quản lý mã nguồn Git', level: 'Developing', category: 'Technical' },
      { skill: 'Thuyết trình trước đám đông', level: 'Beginner', category: 'Soft' }
    ],
    goals: ['Tham gia cuộc thi KHKT Quốc gia về Robot', 'Theo học ngành Khoa học Máy tính hoặc Kỹ thuật Robot'],
    preferredWorkEnvironment: ['Văn phòng công nghệ hiện đại', 'Phòng lab nghiên cứu / Xưởng chế tạo', 'Làm việc linh hoạt Hybrid'],
    preferredActivities: ['Xây dựng ứng dụng phần mềm', 'Hàn mạch cảm biến vi điều khiển', 'Giải đề lập trình thuật toán'],
    workPreferences: {
      teamworkVsSolo: 'Balanced',
      handsOnVsAbstract: 'Hands-on',
      remotePreference: 'Hybrid',
      creativityVsStructure: 'Structured'
    },
    constraints: ['Mong muốn học bổng hoặc học phí trường đại học công lập hợp lý'],
    educationPreferences: ['Đại học chính quy', 'Chứng chỉ quốc tế'],
    financialConsiderations: 'Kỳ vọng việc làm ổn định, thu nhập tốt tương xứng với năng lực',
    careerPriorities: ['Tạo giá trị tri thức', 'Thu nhập tốt', 'Cân bằng cuộc sống'],
    riaSecScores: {
      R: 0.72,
      I: 0.88,
      A: 0.41,
      S: 0.35,
      E: 0.52,
      C: 0.60
    },
    riaSecProfile: {
      scores: { R: 0.72, I: 0.88, A: 0.41, S: 0.35, E: 0.52, C: 0.60 },
      primary: 'I',
      secondary: 'R',
      tertiary: 'C',
      code: 'IRC',
      confidence: 0.92,
      description: 'Nghiên cứu - Kỹ thuật - Quy chuẩn: Tư duy phân tích logic cao, đam mê kết hợp thuật toán phần mềm với phần cứng cơ điện tử thực tế.'
    },
    mbtiType: 'INTJ',
    mbtiResult: {
      type: 'INTJ',
      confidence: 0.85,
      traits: { IE: 'I', SN: 'N', TF: 'T', JP: 'J' },
      notes: 'Tư duy chiến lược, độc lập, thích cấu trúc hệ thống mạch lạc và chiều sâu chuyên môn.'
    },
    assessmentConfidence: 0.92,
    completenessPercentage: 100,
    previousExperience: ['Chủ nhiệm CLB Robotics trường', 'Tự chế tạo hệ thống giám sát nhiệt độ nhà kính bằng Arduino'],
    availableStudyTimeHoursPerWeek: 12,
    learningStyle: 'Hands-on',
    assessmentTimestamp: Date.now() - 86400000 * 2,
    version: '2.4'
  },

  'demo-kid-explorer': {
    id: 'demo-kid-explorer',
    name: 'Bảo An (Khám phá Tuổi thơ)',
    age: 10,
    ageGroup: '7-10',
    educationLevel: 'Tiểu học',
    grade: 'Lớp 4',
    location: 'Đà Nẵng, Việt Nam',
    favoriteSubjects: ['Mỹ thuật & Thiết kế', 'Khoa học Tự nhiên', 'Tiếng Việt / Tập làm văn'],
    interests: ['Vẽ tranh & Nghệ thuật thị giác', 'Sáng tạo câu chuyện', 'Giúp đỡ bạn bè', 'Khám phá thiên nhiên', 'Thí nghiệm vui'],
    skills: ['Trí tưởng tượng sáng tạo', 'Cảm nhận thẩm mỹ màu sắc', 'Quan sát tinh tế'],
    selfRatedSkills: [
      { skill: 'Vẽ tranh & Phác họa', level: 'Strong', category: 'Technical' },
      { skill: 'Kể chuyện truyền cảm', level: 'Strong', category: 'Soft' },
      { skill: 'Lắng nghe & Giúp đỡ bạn bè', level: 'Strong', category: 'Soft' },
      { skill: 'Lập trình Scratch cơ bản', level: 'Developing', category: 'Technical' }
    ],
    goals: ['Tự vẽ và xuất bản truyện tranh thiếu nhi', 'Học làm phim hoạt hình ngắn và game vui'],
    preferredWorkEnvironment: ['Xưởng vẽ sáng tạo hoặc văn phòng thiết kế', 'Không gian mở ngoài trời'],
    preferredActivities: ['Vẽ nhân vật hoạt hình', 'Viết truyện cổ tích tưởng tượng', 'Chăm sóc thú cưng'],
    workPreferences: {
      teamworkVsSolo: 'Team',
      handsOnVsAbstract: 'Hands-on',
      remotePreference: 'Any',
      creativityVsStructure: 'Creative'
    },
    constraints: [],
    educationPreferences: ['CLB Sáng tạo', 'Xưởng thực hành ngoại khóa'],
    careerPriorities: ['Sáng tạo nghệ thuật', 'Lan tỏa niềm vui cho cộng đồng'],
    riaSecScores: {
      R: 0.40,
      I: 0.65,
      A: 0.92,
      S: 0.85,
      E: 0.40,
      C: 0.30
    },
    riaSecProfile: {
      scores: { R: 0.40, I: 0.65, A: 0.92, S: 0.85, E: 0.40, C: 0.30 },
      primary: 'A',
      secondary: 'S',
      tertiary: 'I',
      code: 'ASI',
      confidence: 0.88,
      description: 'Nghệ thuật - Xã hội - Nghiên cứu: Tràn đầy cảm hứng thị giác, thích kể chuyện và hỗ trợ bạn bè khám phá thế giới.'
    },
    mbtiType: 'ENFP',
    mbtiResult: {
      type: 'ENFP',
      confidence: 0.78,
      traits: { IE: 'E', SN: 'N', TF: 'F', JP: 'P' },
      notes: 'Nhiệt tình, giàu năng lượng tích cực và luôn tò mò học hỏi cái mới.'
    },
    assessmentConfidence: 0.88,
    completenessPercentage: 100,
    previousExperience: ['Đoạt giải vẽ tranh cấp trường', 'Tham gia khóa học lập trình Scratch cho trẻ em'],
    availableStudyTimeHoursPerWeek: 6,
    learningStyle: 'Visual',
    assessmentTimestamp: Date.now() - 86400000 * 5,
    version: '2.4'
  },

  'demo-college-cs': {
    id: 'demo-college-cs',
    name: 'Khánh Linh (Sinh viên Đại học Năm cuối)',
    age: 22,
    ageGroup: '19-24',
    educationLevel: 'Đại học',
    grade: 'Năm thứ 4 - Ngành Khoa học Máy tính',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    favoriteSubjects: ['Khoa học Máy tính', 'Toán học Ứng dụng', 'Xác suất Thống kê'],
    interests: ['Trí tuệ nhân tạo (AI)', 'Phân tích dữ liệu lớn', 'Kỹ nghệ phần mềm', 'Mô hình học máy'],
    skills: ['Python, Pandas, Scikit-Learn', 'Thống kê ứng dụng & Đại số tuyến tính', 'Cơ sở dữ liệu SQL', 'Cấu trúc dữ liệu & Thuật toán'],
    selfRatedSkills: [
      { skill: 'Lập trình Python & Thư viện Data Science', level: 'Strong', category: 'Technical' },
      { skill: 'Phân tích thống kê & Toán mô hình', level: 'Strong', category: 'Technical' },
      { skill: 'Hệ quản trị CSDL SQL', level: 'Strong', category: 'Technical' },
      { skill: 'Xây dựng mô hình Machine Learning', level: 'Developing', category: 'Technical' },
      { skill: 'Thuyết trình kết quả kỹ thuật', level: 'Developing', category: 'Soft' }
    ],
    goals: ['Trở thành Chuyên viên Khoa học Dữ liệu (Data Scientist)', 'Đạt chứng chỉ Cloud AI hoặc ứng tuyển vị trí thực tập AI'],
    preferredWorkEnvironment: ['Công ty công nghệ cao hoặc trung tâm nghiên cứu AI', 'Chế độ làm việc linh hoạt Remote/Hybrid'],
    preferredActivities: ['Làm sạch và khai phá dữ liệu', 'Huấn luyện và đánh giá mô hình học máy', 'Trực quan hóa insight dữ liệu'],
    workPreferences: {
      teamworkVsSolo: 'Balanced',
      handsOnVsAbstract: 'Theoretical',
      remotePreference: 'Hybrid',
      creativityVsStructure: 'Structured'
    },
    constraints: ['Chuẩn bị làm khóa luận tốt nghiệp'],
    educationPreferences: ['Đại học chính quy', 'Chứng chỉ Chuyên môn Quốc tế'],
    financialConsiderations: 'Mục tiêu mức lương khởi điểm cạnh tranh trong ngành AI/Data',
    careerPriorities: ['Cơ hội phát triển chuyên môn', 'Thu nhập cạnh tranh', 'Môi trường đổi mới'],
    riaSecScores: {
      R: 0.45,
      I: 0.95,
      A: 0.40,
      S: 0.35,
      E: 0.55,
      C: 0.75
    },
    riaSecProfile: {
      scores: { R: 0.45, I: 0.95, A: 0.40, S: 0.35, E: 0.55, C: 0.75 },
      primary: 'I',
      secondary: 'C',
      tertiary: 'E',
      code: 'ICE',
      confidence: 0.94,
      description: 'Nghiên cứu - Quy chuẩn - Quản trị: Năng lực phân tích dữ liệu chuyên sâu, ưa chuộng sự chính xác toán học và tính ứng dụng thực tiễn.'
    },
    mbtiType: 'INTJ',
    mbtiResult: {
      type: 'INTJ',
      confidence: 0.88,
      traits: { IE: 'I', SN: 'N', TF: 'T', JP: 'J' },
      notes: 'Tư duy logic hệ thống, làm việc bài bản và định hướng mục tiêu sắc bén.'
    },
    assessmentConfidence: 0.94,
    completenessPercentage: 100,
    previousExperience: ['Thực tập sinh phân tích dữ liệu 6 tháng', 'Tham gia dự án phân loại văn bản tiếng Việt'],
    availableStudyTimeHoursPerWeek: 15,
    learningStyle: 'Reading',
    assessmentTimestamp: Date.now() - 86400000 * 1,
    version: '2.4'
  },

  'demo-adult-changer': {
    id: 'demo-adult-changer',
    name: 'Hoàng Nam (Chuyển đổi Hướng nghiệp)',
    age: 29,
    ageGroup: '25+',
    educationLevel: 'Đã tốt nghiệp Đại học (Kinh tế)',
    grade: 'Đã đi làm 5 năm',
    location: 'Đà Nẵng, Việt Nam',
    favoriteSubjects: ['Kinh doanh & Khởi nghiệp', 'Tâm lý học Người dùng', 'Công nghệ Số'],
    interests: ['Thiết kế trải nghiệm người dùng (UX/UI)', 'Quản trị sản phẩm số', 'Nghiên cứu thị trường'],
    skills: ['Giao tiếp & Đàm phán', 'Hiểu biết kinh doanh & Thị trường', 'Phác thảo wireframe cơ bản', 'Quản lý dự án'],
    selfRatedSkills: [
      { skill: 'Thấu cảm người dùng & Nghiên cứu hành vi', level: 'Developing', category: 'Domain' },
      { skill: 'Công cụ thiết kế Figma / UI', level: 'Developing', category: 'Technical' },
      { skill: 'Giao tiếp & Làm việc nhóm', level: 'Expert', category: 'Soft' },
      { skill: 'Phân tích nghiệp vụ kinh doanh', level: 'Strong', category: 'Domain' }
    ],
    goals: ['Chuyển từ kinh doanh truyền thống sang vị trí Thiết kế UX/UI hoặc Product Management', 'Xây dựng danh mục dự án (Portfolio) chuyên nghiệp'],
    preferredWorkEnvironment: ['Công ty công nghệ đổi mới sáng tạo', 'Làm việc từ xa linh hoạt'],
    preferredActivities: ['Phỏng vấn người dùng', 'Thiết kế luồng trải nghiệm ứng dụng', 'Họp chiến lược tính năng sản phẩm'],
    workPreferences: {
      teamworkVsSolo: 'Team',
      handsOnVsAbstract: 'Balanced',
      remotePreference: 'Remote',
      creativityVsStructure: 'Creative'
    },
    constraints: ['Không thể học lại đại học 4 năm, ưu tiên học thực chiến qua dự án và chứng chỉ 6-9 tháng'],
    educationPreferences: ['Khóa đào tạo chuyên sâu (Bootcamp)', 'Chứng chỉ Chuyên nghiệp', 'Tự học theo dự án (Portfolio)'],
    financialConsiderations: 'Cần duy trì thu nhập hiện tại trong quá trình học chuyển nghề',
    careerPriorities: ['Tự do sáng tạo', 'Cân bằng cuộc sống', 'Cơ hội phát triển dài hạn'],
    riaSecScores: {
      R: 0.30,
      I: 0.65,
      A: 0.85,
      S: 0.75,
      E: 0.70,
      C: 0.45
    },
    riaSecProfile: {
      scores: { R: 0.30, I: 0.65, A: 0.85, S: 0.75, E: 0.70, C: 0.45 },
      primary: 'A',
      secondary: 'S',
      tertiary: 'E',
      code: 'ASE',
      confidence: 0.90,
      description: 'Nghệ thuật - Xã hội - Quản trị: Kết hợp sự thấu cảm người dùng sâu sắc, tư duy thẩm mỹ sáng tạo và kỹ năng giao tiếp thuyết phục.'
    },
    mbtiType: 'ENFJ',
    mbtiResult: {
      type: 'ENFJ',
      confidence: 0.82,
      traits: { IE: 'E', SN: 'N', TF: 'F', JP: 'J' },
      notes: 'Thấu hiểu con người, tổ chức nhóm tốt và truyền cảm hứng tích cực.'
    },
    assessmentConfidence: 0.90,
    completenessPercentage: 100,
    previousExperience: ['5 năm kinh nghiệm quản lý quan hệ khách hàng và phân tích thị trường'],
    availableStudyTimeHoursPerWeek: 10,
    learningStyle: 'Hands-on',
    assessmentTimestamp: Date.now() - 86400000 * 3,
    version: '2.4'
  }
};
