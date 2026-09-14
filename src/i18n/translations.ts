export type Language = 'vi' | 'en';

export interface Translations {
  // Navigation & General
  appName: string;
  appSubtitle: string;
  tabDashboard: string;
  tabAssessment: string;
  tabExplorer: string;
  tabSkillGap: string;
  tabRoadmap: string;
  tabCompare: string;
  tabSimulate: string;
  tabCounselor: string;
  tabParentTeacher: string;
  juryMode: string;
  switchProfile: string;
  ageGroup: string;
  allAges: string;
  
  // Dashboard
  topRecommendations: string;
  topRecommendationsDesc: string;
  overallMatch: string;
  riasecBreakdown: string;
  riasecRadarTitle: string;
  riasecRadarDesc: string;
  matchBreakdown: string;
  positiveFactors: string;
  considerations: string;
  exploreCareerDetail: string;
  startSkillAudit: string;
  viewRoadmap: string;
  disambiguationNotice: string;
  disambiguationPrompt: string;
  quickActions: string;
  retakeAssessment: string;
  exploreAllCareers: string;
  
  // Assessment
  assessmentTitle: string;
  assessmentDesc: string;
  questionProgress: string;
  previous: string;
  next: string;
  submitAssessment: string;
  restartAssessment: string;
  answeredCount: string;
  selectOptionPrompt: string;

  // Explorer
  explorerTitle: string;
  explorerDesc: string;
  searchPlaceholder: string;
  filterCluster: string;
  filterHolland: string;
  allClusters: string;
  allHolland: string;
  sortByFit: string;
  sortByName: string;
  noCareersFound: string;
  resetFilters: string;
  detailsButton: string;

  // Skill Gap
  skillGapTitle: string;
  skillGapDesc: string;
  targetCareer: string;
  readinessTitle: string;
  readinessHigh: string;
  readinessMedium: string;
  readinessLow: string;
  missingSkills: string;
  developingSkills: string;
  strongSkills: string;
  actionRequired: string;
  inProgress: string;
  mastered: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  
  // Roadmap
  roadmapTitle: string;
  roadmapDesc: string;
  studyPace: string;
  hoursPerWeek: string;
  lightPace: string;
  standardPace: string;
  intensivePace: string;
  phase: string;
  duration: string;
  objectives: string;
  skillsToLearn: string;
  concreteProjects: string;
  milestone: string;

  // Compare
  compareTitle: string;
  compareDesc: string;
  addCareerToCompare: string;
  quickComparisons: string;
  dimension: string;
  hollandPsychometrics: string;
  skillReadinessGap: string;
  coreDailyTasks: string;
  requiredCompetencies: string;
  educationPaths: string;
  compensationMarket: string;
  discoveryExperiment: string;
  viewFullProfile: string;

  // What-If Simulator
  simulatorTitle: string;
  simulatorDesc: string;
  resetVariables: string;
  controlVariables: string;
  boostProgramming: string;
  boostProgrammingDesc: string;
  focusPhysics: string;
  focusPhysicsDesc: string;
  remoteOnly: string;
  remoteOnlyDesc: string;
  highSocial: string;
  highSocialDesc: string;
  vocationalOnly: string;
  vocationalOnlyDesc: string;
  maxIncome: string;
  maxIncomeDesc: string;
  baselineBefore: string;
  recalculatedAfter: string;
  originalProfile: string;
  dynamicSensitivity: string;
  whyRankingsShifted: string;

  // AI Counselor
  counselorTitle: string;
  counselorDesc: string;
  careerFocus: string;
  ragNotice: string;
  groundedInProfile: string;
  quickQuestions: string;
  inspectGroundedContext: string;
  hideGroundedContext: string;
  askPlaceholder: string;
  sendQuestion: string;
  counselorWelcome: string;
  consultingKnowledgeBase: string;
  poweredBy: string;

  // Parent & Teacher
  parentTeacherTitle: string;
  parentTeacherDesc: string;
  explorationPrinciple: string;
  growthStageTitle: string;
  observedStrengths: string;
  suggestedDirections: string;
  homeSchoolActivities: string;
  conversationStarters: string;

  // Detail Modal
  modalClose: string;
  exploreDetail: string;
  hollandCode: string;
  salaryTier: string;
  salaryDisclaimer: string;
  coreTasks: string;
  workEnvironment: string;
  educationAndTraining: string;
  progressionLadder: string;
  microExperiments: string;
  tryBeforeDecide: string;
  askAICounselor: string;
  addToCompare: string;
  removeFromCompare: string;

  // Jury & Science Research Modal
  juryModalTitle: string;
  juryModalSubtitle: string;
  tabFormula: string;
  tabWeights: string;
  tabEmpirical: string;
  tabJson: string;
  copyJson: string;
  copied: string;
  downloadJson: string;
  resetWeights: string;
  deterministicCoreTitle: string;
  mbtiNoticeTitle: string;
  empiricalTitle: string;

  // RIASEC Dimension names & short desc
  riasecR: string;
  riasecI: string;
  riasecA: string;
  riasecS: string;
  riasecE: string;
  riasecC: string;
  riasecRDesc: string;
  riasecIDesc: string;
  riasecADesc: string;
  riasecSDesc: string;
  riasecEDesc: string;
  riasecCDesc: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  vi: {
    appName: 'EduPath AI',
    appSubtitle: 'Hệ thống Định hướng Nghề nghiệp & Lộ trình Học tập Toàn diện',
    tabDashboard: 'Tổng quan & Khuyến nghị',
    tabAssessment: 'Đánh giá RIASEC',
    tabExplorer: 'Kho Nghề nghiệp (16)',
    tabSkillGap: 'Kiểm toán Kỹ năng',
    tabRoadmap: 'Lộ trình Cá nhân hóa',
    tabCompare: 'So sánh Đa nghề',
    tabSimulate: 'Mô phỏng "What-If"',
    tabCounselor: 'Cố vấn Trí tuệ Nhân tạo',
    tabParentTeacher: 'Góc Phụ huynh & Giáo viên',
    juryMode: 'Chế độ Giám khảo KHKT',
    switchProfile: 'Hồ sơ thử nghiệm:',
    ageGroup: 'Độ tuổi:',
    allAges: 'Tất cả lứa tuổi',

    topRecommendations: 'Bảng xếp hạng Nghề nghiệp Tương thích',
    topRecommendationsDesc: 'Được tính toán hoàn toàn tất định qua độ tương đồng cosine vector RIASEC, giao thoa kỹ năng, sở thích và định hướng phát triển.',
    overallMatch: 'Mức độ phù hợp:',
    riasecBreakdown: 'Phân tích đa chiều Holland RIASEC',
    riasecRadarTitle: 'Biểu đồ Radar Năng lực Holland RIASEC',
    riasecRadarDesc: 'Thể hiện 6 trục tâm lý hướng nghiệp: Thực tế (R), Nghiên cứu (I), Nghệ thuật (A), Xã hội (S), Khởi nghiệp (E), và Quy củ (C).',
    matchBreakdown: 'Điểm thành phần chi tiết:',
    positiveFactors: 'Yếu tố tương thích nổi bật:',
    considerations: 'Lưu ý & Điểm cần bổ trợ:',
    exploreCareerDetail: 'Xem chi tiết nghề',
    startSkillAudit: 'Kiểm toán kỹ năng cần bù đắp',
    viewRoadmap: 'Xem lộ trình học tập',
    disambiguationNotice: 'Phát hiện Điểm số Tương đương (Cần Phân giải)',
    disambiguationPrompt: 'Hai nghề nghiệp hàng đầu có điểm số rất sát nhau. Hãy trả lời câu hỏi ngắn để thuật toán hiệu chỉnh trọng số:',
    quickActions: 'Truy cập nhanh các công cụ',
    retakeAssessment: 'Làm lại bài trắc nghiệm',
    exploreAllCareers: 'Khám phá tất cả 16 nghề',

    assessmentTitle: 'Trắc nghiệm Hướng nghiệp Holland RIASEC Thích ứng',
    assessmentDesc: 'Bộ câu hỏi tự động điều chỉnh ngôn ngữ và bối cảnh phù hợp với từng độ tuổi (Học sinh tiểu học, THCS, THPT, Sinh viên, Người đi làm).',
    questionProgress: 'Tiến độ câu hỏi',
    previous: 'Quay lại',
    next: 'Tiếp theo',
    submitAssessment: 'Hoàn thành & Phân tích Kết quả',
    restartAssessment: 'Làm lại từ đầu',
    answeredCount: 'Đã trả lời',
    selectOptionPrompt: 'Vui lòng chọn một phương án phù hợp nhất với bạn:',

    explorerTitle: 'Kho Dữ liệu 16 Nghề nghiệp Trọng điểm',
    explorerDesc: 'Tra cứu, lọc và phân tích chi tiết các ngành nghề chuẩn hóa theo 8 nhóm ngành kinh tế - kỹ thuật hiện đại.',
    searchPlaceholder: 'Tìm kiếm theo tên nghề, kỹ năng, môn học liên quan...',
    filterCluster: 'Nhóm ngành:',
    filterHolland: 'Loại hình Holland:',
    allClusters: 'Tất cả các nhóm ngành (8)',
    allHolland: 'Tất cả các loại hình Holland (R-I-A-S-E-C)',
    sortByFit: 'Sắp xếp theo độ phù hợp',
    sortByName: 'Sắp xếp theo tên A-Z',
    noCareersFound: 'Không tìm thấy nghề nghiệp phù hợp với bộ lọc.',
    resetFilters: 'Đặt lại bộ lọc',
    detailsButton: 'Xem hồ sơ nghề',

    skillGapTitle: 'Kiểm toán Năng lực & Khoảng trống Kỹ năng',
    skillGapDesc: 'Đối chiếu năng lực hiện tại của bạn với các yêu cầu thực tế của nghề nghiệp mục tiêu và nhận hướng dẫn bồi dưỡng cụ thể.',
    targetCareer: 'Nghề nghiệp mục tiêu:',
    readinessTitle: 'Chỉ số Sẵn sàng',
    readinessHigh: 'Mức độ sẵn sàng cao. Hãy tập trung làm các dự án capstone và thi đấu cọ xát chuyên sâu.',
    readinessMedium: 'Mức độ sẵn sàng trung bình. Bạn có nền tảng tư duy tốt, cần bổ sung công cụ thực hành chuyên môn.',
    readinessLow: 'Giai đoạn khởi đầu. Hãy bắt đầu từ Giai đoạn 0 & 1 trong Lộ trình để làm quen và trải nghiệm.',
    missingSkills: 'Kỹ năng cần bồi dưỡng',
    developingSkills: 'Kỹ năng đang phát triển',
    strongSkills: 'Kỹ năng thế mạnh đã có',
    actionRequired: 'Cần hành động',
    inProgress: 'Đang trau dồi',
    mastered: 'Đã thuần thục',
    priorityHigh: 'Ưu tiên Cao',
    priorityMedium: 'Ưu tiên Vừa',
    priorityLow: 'Ưu tiên Bổ trợ',

    roadmapTitle: 'Lộ trình Học tập & Rèn luyện Thích ứng theo Độ tuổi',
    roadmapDesc: 'Lộ trình chia theo 4 giai đoạn rõ ràng, tự động tính toán thời gian dựa trên quỹ thời gian học tập hàng tuần của bạn.',
    studyPace: 'Cường độ học tập:',
    hoursPerWeek: 'giờ/tuần',
    lightPace: '5 giờ/tuần (Nhẹ nhàng)',
    standardPace: '10 giờ/tuần (Tiêu chuẩn)',
    intensivePace: '20 giờ/tuần (Chuyên sâu)',
    phase: 'Giai đoạn',
    duration: 'Thời lượng dự kiến:',
    objectives: 'Mục tiêu trọng tâm',
    skillsToLearn: 'Kỹ năng cốt lõi cần đạt',
    concreteProjects: 'Dự án thực tế & Hoạt động rèn luyện',
    milestone: 'Cột mốc hoàn thành đánh giá',

    compareTitle: 'Ma trận So sánh Đa nghề nghiệp Trực quan',
    compareDesc: 'Đặt từ 2 đến 4 nghề nghiệp cạnh nhau để phân tích sự khác biệt về nhiệm vụ hàng ngày, lộ trình đào tạo, thu nhập và thử nghiệm thực tế.',
    addCareerToCompare: '+ Thêm nghề vào bảng so sánh (Tối đa 4)',
    quickComparisons: 'So sánh nhanh mẫu:',
    dimension: 'Tiêu chí so sánh',
    hollandPsychometrics: 'Đặc tính Tâm lý Holland',
    skillReadinessGap: 'Khoảng trống Kỹ năng',
    coreDailyTasks: 'Nhiệm vụ hàng ngày cốt lõi',
    requiredCompetencies: 'Năng lực chuyên môn yêu cầu',
    educationPaths: 'Các hướng học tập & Đào tạo',
    compensationMarket: 'Mức thu nhập & Thị trường',
    discoveryExperiment: 'Thử nghiệm trước khi quyết định',
    viewFullProfile: 'Xem hồ sơ đầy đủ',

    simulatorTitle: 'Mô phỏng Độ nhạy "What-If" (Nếu như...)',
    simulatorDesc: 'Khám phá xem nếu bạn thay đổi môn học, nâng cao kỹ năng lập trình, hoặc ưu tiên làm việc từ xa, thứ hạng nghề nghiệp sẽ thay đổi như thế nào.',
    resetVariables: 'Đặt lại thông số',
    controlVariables: 'Các biến số mô phỏng giả định',
    boostProgramming: 'Nâng cao Kỹ năng Lập trình & Logic',
    boostProgrammingDesc: 'Giả định bạn thành thạo Python/JS và tư duy giải thuật.',
    focusPhysics: 'Tập trung Vật lý hơn Sinh học',
    focusPhysicsDesc: 'Chuyển hướng từ khoa học sự sống sang cơ kỹ thuật và điện tử.',
    remoteOnly: 'Ưu tiên Làm việc từ xa (Remote)',
    remoteOnlyDesc: 'Tăng trọng số cho các nghề kỹ thuật số và văn phòng linh hoạt.',
    highSocial: 'Tăng yếu tố Giao tiếp & Xã hội',
    highSocialDesc: 'Nâng cao trọng số Holland S (Xã hội) và E (Quản lý).',
    vocationalOnly: 'Hướng Thực hành / Trường nghề / Portfolio',
    vocationalOnlyDesc: 'Ưu tiên nghề có thể đi làm nhanh qua chứng chỉ và dự án thực tế.',
    maxIncome: 'Ưu tiên Thu nhập Cao',
    maxIncomeDesc: 'Ưu tiên các lĩnh vực có biên độ lương thương mại cao.',
    baselineBefore: 'Thứ hạng Ban đầu (Trước mô phỏng)',
    recalculatedAfter: 'Thứ hạng Tính lại (Sau mô phỏng)',
    originalProfile: 'Hồ sơ gốc',
    dynamicSensitivity: 'Độ nhạy thời gian thực',
    whyRankingsShifted: 'Giải trình Thuật toán: Tại sao thứ hạng thay đổi?',

    counselorTitle: 'Cố vấn Trí tuệ Nhân tạo Hướng nghiệp (AI Counselor)',
    counselorDesc: 'Tư vấn đối thoại chuyên sâu, tuân thủ nghiêm ngặt dữ liệu kiến thức nghề nghiệp chuẩn hóa (RAG), không ảo tưởng thông tin.',
    careerFocus: 'Nghề đang thảo luận:',
    ragNotice: 'Bảo chứng RAG: Dữ liệu được neo chặn thực tế, không bịa đặt chỉ tiêu tuyển sinh hay cam kết lương.',
    groundedInProfile: 'Dữ liệu được neo chặn vào Hồ sơ & RAG Chuẩn hóa',
    quickQuestions: 'Câu hỏi gợi ý nhanh:',
    inspectGroundedContext: 'Kiểm tra dữ liệu nguồn gửi tới AI',
    hideGroundedContext: 'Ẩn dữ liệu nguồn',
    askPlaceholder: 'Đặt câu hỏi về nghề nghiệp, môn học, cơ hội thử sức...',
    sendQuestion: 'Gửi câu hỏi',
    counselorWelcome: 'Chào bạn! Tôi là Cố vấn Hướng nghiệp AI của EduPath. Hãy hỏi tôi bất cứ điều gì về nghề nghiệp bạn quan tâm!',
    consultingKnowledgeBase: 'Đang tra cứu kho tri thức nghề nghiệp và tổng hợp lời khuyên...',
    poweredBy: 'Vận hành bởi',

    parentTeacherTitle: 'Góc Dành cho Cha Mẹ & Thầy Cô',
    parentTeacherDesc: 'Bản tóm tắt đồng hành tích cực, phi áp đặt, giúp phụ huynh và giáo viên nuôi dưỡng sự tò mò nghề nghiệp lành mạnh cho học sinh.',
    explorationPrinciple: 'Triết lý Đồng hành Giáo dục',
    growthStageTitle: 'Giai đoạn Phát triển & Thế mạnh Nổi trội',
    observedStrengths: 'Các thế mạnh đã bộc lộ:',
    suggestedDirections: 'Định hướng khám phá gợi ý',
    homeSchoolActivities: 'Hoạt động khuyến khích tại Gia đình & Nhà trường',
    conversationStarters: 'Gợi ý mở đầu cuộc trò chuyện thân mật trên bàn ăn',

    modalClose: 'Đóng',
    exploreDetail: 'Chi tiết Toàn diện Nghề nghiệp',
    hollandCode: 'Mã Holland:',
    salaryTier: 'Mức lương tham chiếu:',
    salaryDisclaimer: 'Lưu ý: Mức lương chỉ mang tính chất tham khảo, biến thiên theo năng lực cá nhân và thị trường lao động tại từng địa phương.',
    coreTasks: 'Nhiệm vụ & Trách nhiệm Hàng ngày',
    workEnvironment: 'Môi trường làm việc thực tế',
    educationAndTraining: 'Các hướng học tập & Đào tạo khả thi',
    progressionLadder: 'Lộ trình thăng tiến nghề nghiệp',
    microExperiments: 'Thử nghiệm vi mô: "Thử trước khi quyết định"',
    tryBeforeDecide: 'Dự án trải nghiệm thực tế',
    askAICounselor: 'Hỏi Cố vấn AI về nghề này',
    addToCompare: 'Thêm vào so sánh',
    removeFromCompare: 'Đã trong so sánh',

    juryModalTitle: 'Thanh tra Khoa học & Đánh giá của Ban Giám khảo',
    juryModalSubtitle: 'Dành riêng cho Hội đồng Đánh giá Cuộc thi KHKT: Minh bạch công thức toán học, nghiên cứu thực nghiệm và kiến trúc RAG an toàn.',
    tabFormula: 'Công thức Toán học Tất định',
    tabWeights: 'Hiệu chuẩn Trọng số',
    tabEmpirical: 'Nghiên cứu Thực nghiệm (320 HS)',
    tabJson: 'Xuất Dữ liệu JSON Thô',
    copyJson: 'Sao chép JSON',
    copied: 'Đã sao chép!',
    downloadJson: 'Tải tệp JSON',
    resetWeights: 'Đặt lại trọng số mặc định (35-25-15-10-5-5-5)',
    deterministicCoreTitle: 'Bảo chứng Lõi Tính toán Tất định (Deterministic Core)',
    mbtiNoticeTitle: 'Vị trí của Chỉ số MBTI trong Hệ thống',
    empiricalTitle: 'Kết quả Khảo sát Thực nghiệm trên 320 Học sinh THPT',

    riasecR: 'Thực tế (Realistic)',
    riasecI: 'Nghiên cứu (Investigative)',
    riasecA: 'Nghệ thuật (Artistic)',
    riasecS: 'Xã hội (Social)',
    riasecE: 'Quản lý / Khởi nghiệp (Enterprising)',
    riasecC: 'Quy củ / Nề nếp (Conventional)',
    riasecRDesc: 'Thích thao tác với máy móc, dụng cụ, công nghệ phần cứng, hoạt động ngoài trời và chế tạo vật thể.',
    riasecIDesc: 'Thích tư duy logic, phân tích dữ liệu, khám phá khoa học tự nhiên và giải quyết bài toán phức tạp.',
    riasecADesc: 'Thích sáng tạo, thiết kế thị giác, nghệ thuật, viết lách và tự do thể hiện phong cách cá nhân.',
    riasecSDesc: 'Thích giúp đỡ mọi người, giảng dạy, chăm sóc sức khỏe, tham vấn tâm lý và hoạt động cộng đồng.',
    riasecEDesc: 'Thích lãnh đạo, kinh doanh, thuyết phục, đàm phán, hoạch định chiến lược và khởi nghiệp.',
    riasecCDesc: 'Thích hệ thống ngăn nắp, quy trình chuẩn mực, kiểm soát dữ liệu, thống kê và kế hoạch rõ ràng.'
  },
  en: {
    appName: 'EduPath AI',
    appSubtitle: 'Comprehensive Career Exploration & Adaptive Learning Platform',
    tabDashboard: 'Overview & Recommendations',
    tabAssessment: 'RIASEC Assessment',
    tabExplorer: 'Career Database (16)',
    tabSkillGap: 'Skill Gap Audit',
    tabRoadmap: 'Personalized Roadmap',
    tabCompare: 'Multi-Career Matrix',
    tabSimulate: 'What-If Simulation',
    tabCounselor: 'AI Counselor',
    tabParentTeacher: 'Parent & Educator View',
    juryMode: 'Jury Evaluation Mode',
    switchProfile: 'Test Cohort:',
    ageGroup: 'Age Group:',
    allAges: 'All Ages',

    topRecommendations: 'Compatible Career Rankings',
    topRecommendationsDesc: 'Calculated deterministically via RIASEC cosine similarity, skill set intersections, interests, and career priorities.',
    overallMatch: 'Match Score:',
    riasecBreakdown: 'Holland RIASEC Multi-axial Breakdown',
    riasecRadarTitle: 'Holland RIASEC Competency Radar',
    riasecRadarDesc: 'Displays the 6 psychological vocational dimensions: Realistic (R), Investigative (I), Artistic (A), Social (S), Enterprising (E), and Conventional (C).',
    matchBreakdown: 'Detailed Score Composition:',
    positiveFactors: 'Prominent Compatibility Factors:',
    considerations: 'Considerations & Gap Areas:',
    exploreCareerDetail: 'Inspect Career Profile',
    startSkillAudit: 'Audit Skill Gaps',
    viewRoadmap: 'View Learning Roadmap',
    disambiguationNotice: 'Tie-Breaking Trigger Detected',
    disambiguationPrompt: 'Your top two career matches have very close scores. Answer this quick preference question to calibrate:',
    quickActions: 'Quick Tool Access',
    retakeAssessment: 'Retake Assessment',
    exploreAllCareers: 'Explore all 16 Careers',

    assessmentTitle: 'Adaptive Holland RIASEC Assessment',
    assessmentDesc: 'Questionnaire automatically adapts phrasing and depth for your age group (Elementary, Middle School, High School, College, Adult Pivot).',
    questionProgress: 'Question Progress',
    previous: 'Previous',
    next: 'Next',
    submitAssessment: 'Submit & Analyze Profile',
    restartAssessment: 'Restart Assessment',
    answeredCount: 'Answered',
    selectOptionPrompt: 'Please select the option that best reflects your preference:',

    explorerTitle: 'Curated 16 Core Career Database',
    explorerDesc: 'Search, filter, and inspect standardized career pathways mapped across 8 modern economic and technical clusters.',
    searchPlaceholder: 'Search by title, technical skills, relevant subjects...',
    filterCluster: 'Cluster:',
    filterHolland: 'Holland Type:',
    allClusters: 'All Career Clusters (8)',
    allHolland: 'All Holland Types (R-I-A-S-E-C)',
    sortByFit: 'Sort by Compatibility Match',
    sortByName: 'Sort by Title A-Z',
    noCareersFound: 'No careers found matching your search criteria.',
    resetFilters: 'Reset Filters',
    detailsButton: 'View Profile',

    skillGapTitle: 'Interactive Skill Gap & Competency Audit',
    skillGapDesc: 'Evaluate your verified competencies against industry prerequisites and discover targeted learning actions.',
    targetCareer: 'Target Career:',
    readinessTitle: 'Readiness Index',
    readinessHigh: 'Strong foundational readiness. Focus on bridging critical high-priority gaps to prepare for capstone projects.',
    readinessMedium: 'Moderate readiness. You have good logical or academic transferability, but specific technical tooling requires structured practice.',
    readinessLow: 'Early stage readiness. Ideal opportunity to follow Phase 0 & Phase 1 foundational learning modules.',
    missingSkills: 'Skills to Bridge',
    developingSkills: 'Developing Skills',
    strongSkills: 'Demonstrated Strengths',
    actionRequired: 'Action Required',
    inProgress: 'In Progress',
    mastered: 'Mastered',
    priorityHigh: 'High Priority',
    priorityMedium: 'Medium Priority',
    priorityLow: 'Supportive Priority',

    roadmapTitle: 'Personalized Adaptive Learning Roadmap',
    roadmapDesc: 'Phased roadmap calibrated for your age group, available study time, and current skill gaps.',
    studyPace: 'Study Pace:',
    hoursPerWeek: 'hrs/week',
    lightPace: '5 hrs/week (Light)',
    standardPace: '10 hrs/week (Standard)',
    intensivePace: '20 hrs/week (Intensive)',
    phase: 'Phase',
    duration: 'Estimated Duration:',
    objectives: 'Key Phase Objectives',
    skillsToLearn: 'Competencies to Build',
    concreteProjects: 'Concrete Projects & Activities',
    milestone: 'Completion Milestone',

    compareTitle: 'Multi-Career Comparison Matrix',
    compareDesc: 'Compare 2 to 4 career pathways side-by-side across tasks, skill readiness, salary tiers, and education.',
    addCareerToCompare: '+ Add Career to Compare (Max 4)',
    quickComparisons: 'Quick Comparisons:',
    dimension: 'Dimension',
    hollandPsychometrics: 'Holland Psychometrics',
    skillReadinessGap: 'Current Readiness Gap',
    coreDailyTasks: 'Core Daily Tasks',
    requiredCompetencies: 'Required Competencies',
    educationPaths: 'Educational Paths',
    compensationMarket: 'Compensation & Market',
    discoveryExperiment: 'Discovery Experiment',
    viewFullProfile: 'View Full Profile',

    simulatorTitle: 'Interactive "What-If" Sensitivity Simulator',
    simulatorDesc: 'Simulate how strategic decisions (such as learning programming, switching subjects, or seeking remote roles) dynamically reshape your career rankings.',
    resetVariables: 'Reset Variables',
    controlVariables: 'Simulation Control Variables',
    boostProgramming: 'Improve Programming & Logic',
    boostProgrammingDesc: 'Simulates mastering Python/JS and algorithmic problem solving.',
    focusPhysics: 'Focus Physics Over Biology',
    focusPhysicsDesc: 'Simulates pivoting academic focus to engineering mechanics and electronics.',
    remoteOnly: 'Strict Remote Work Only',
    remoteOnlyDesc: 'Penalizes physical-onsite positions and prioritizes digital-first occupations.',
    highSocial: 'High Social / People Orientation',
    highSocialDesc: 'Boosts Holland Social (S) and Enterprising (E) leadership weighting.',
    vocationalOnly: 'Vocational & Portfolio Paths Only',
    vocationalOnlyDesc: 'Favors skills-first trades, automation technicians, and web development.',
    maxIncome: 'Prioritize Earning Potential',
    maxIncomeDesc: 'Places heavy bonus on high-margin commercial and quantitative sectors.',
    baselineBefore: 'Baseline (Before Simulation)',
    recalculatedAfter: 'Recalculated (After Simulation)',
    originalProfile: 'Original Profile',
    dynamicSensitivity: 'Dynamic Sensitivity',
    whyRankingsShifted: 'Why Did the Rankings Shift? (Algorithmic Attribution)',

    counselorTitle: 'AI Career Exploration Counselor',
    counselorDesc: 'Conversational guidance strictly grounded in verified career data and your psychometric profile.',
    careerFocus: 'Career Focus:',
    ragNotice: 'RAG Grounded: No hallucinated salary or admission guarantees.',
    groundedInProfile: 'Scientifically Grounded in Verified RAG Profile',
    quickQuestions: 'Quick Questions:',
    inspectGroundedContext: 'Inspect Grounded Context',
    hideGroundedContext: 'Hide Grounded Context',
    askPlaceholder: 'Ask a question about careers, subjects, or pathways...',
    sendQuestion: 'Ask',
    counselorWelcome: 'Hello! I am your EduPath Career Exploration Counselor. Feel free to ask me anything!',
    consultingKnowledgeBase: 'Consulting career knowledge base and formulating grounded advice...',
    poweredBy: 'Powered by',

    parentTeacherTitle: 'Parent & Educator Guidance Overview',
    parentTeacherDesc: 'A supportive, non-coercive summary designed to help parents and teachers facilitate open career exploration without premature pressure.',
    explorationPrinciple: 'Exploration Principle',
    growthStageTitle: 'Development Stage & Key Strengths',
    observedStrengths: 'Observed Strengths:',
    suggestedDirections: 'Suggested Exploration Directions',
    homeSchoolActivities: 'Recommended Supportive Activities for Home & School',
    conversationStarters: 'Constructive Conversation Starters at the Dinner Table',

    modalClose: 'Close',
    exploreDetail: 'Comprehensive Career Profile',
    hollandCode: 'Holland Code:',
    salaryTier: 'Salary Tier:',
    salaryDisclaimer: 'Example / illustrative information - requires local verification by region and experience.',
    coreTasks: 'Core Daily Responsibilities',
    workEnvironment: 'Work Environment & Culture',
    educationAndTraining: 'Educational & Training Pathways',
    progressionLadder: 'Career Progression Ladder',
    microExperiments: 'Micro-Experiments: "Try Before You Decide"',
    tryBeforeDecide: 'Discovery Hands-on Project',
    askAICounselor: 'Ask AI Counselor About This Career',
    addToCompare: 'Add to Comparison',
    removeFromCompare: 'In Comparison',

    juryModalTitle: 'Scientific Evaluation & Algorithm Inspector',
    juryModalSubtitle: 'For Science & Tech Competition Jury: Transparent inspection of mathematical scoring vectors, empirical study metrics, and RAG architecture.',
    tabFormula: 'Mathematical Formulation',
    tabWeights: 'Weight Calibrator',
    tabEmpirical: 'Empirical Cohort Study (320 Students)',
    tabJson: 'Raw JSON Audit Export',
    copyJson: 'Copy JSON',
    copied: 'Copied!',
    downloadJson: 'Download JSON',
    resetWeights: 'Reset Weights to Baseline (35-25-15-10-5-5-5)',
    deterministicCoreTitle: 'Deterministic Core Guarantee',
    mbtiNoticeTitle: 'Secondary MBTI Treatment',
    empiricalTitle: 'Empirical Validation Cohort: 320 High-School Students',

    riasecR: 'Realistic',
    riasecI: 'Investigative',
    riasecA: 'Artistic',
    riasecS: 'Social',
    riasecE: 'Enterprising',
    riasecC: 'Conventional',
    riasecRDesc: 'Hands-on problem solving, machinery, hardware, physical crafts, and outdoors.',
    riasecIDesc: 'Scientific inquiry, mathematical analysis, research, and complex problem formulation.',
    riasecADesc: 'Visual aesthetics, creative expression, writing, design, and non-conformity.',
    riasecSDesc: 'Helping, mentoring, healthcare, teaching, psychology, and community engagement.',
    riasecEDesc: 'Leadership, entrepreneurship, persuasion, business strategy, and pitching.',
    riasecCDesc: 'Organization, data verification, structured workflows, accuracy, and clear procedures.'
  }
};

// Vietnamese career titles and clusters dictionary for authentic localization
export const CAREER_LOCALIZATION: Record<string, { title: string; cluster: string; desc: string }> = {
  'software-engineer': {
    title: 'Kỹ sư Phần mềm (Software Engineer)',
    cluster: 'Công nghệ Thông tin & Khoa học Máy tính',
    desc: 'Thiết kế, xây dựng và tối ưu hóa các ứng dụng phần mềm, hệ thống phân tán và nền tảng điện toán đám mây.'
  },
  'robotics-engineer': {
    title: 'Kỹ sư Robot & Tự động hóa (Robotics Engineer)',
    cluster: 'Kỹ thuật & Công nghệ Chế tạo',
    desc: 'Tích hợp cơ khí chính xác, mạch điện tử và thuật toán điều khiển để chế tạo các hệ thống cánh tay robot và máy tự hành.'
  },
  'ai-data-scientist': {
    title: 'Nhà khoa học Dữ liệu & AI (Data Scientist / AI Specialist)',
    cluster: 'Công nghệ Thông tin & Khoa học Máy tính',
    desc: 'Huấn luyện các mô hình học máy (Machine Learning), trích xuất tri thức từ dữ liệu lớn và kiến tạo giải pháp AI thông minh.'
  },
  'cybersecurity-analyst': {
    title: 'Chuyên gia An toàn Thông tin & An ninh Mạng',
    cluster: 'Công nghệ Thông tin & Khoa học Máy tính',
    desc: 'Bảo vệ cơ sở hạ tầng số, săn lùng mối đe dọa, kiểm thử xâm nhập và phản ứng với các cuộc tấn công mạng.'
  },
  'biomedical-engineer': {
    title: 'Kỹ sư Kỹ thuật Y sinh (Biomedical Engineer)',
    cluster: 'Y tế & Khoa học Sức khỏe',
    desc: 'Phát triển thiết bị y tế tiên tiến như máy tạo nhịp tim, chi giả sinh học và hệ thống chẩn đoán hình ảnh cứu chữa người bệnh.'
  },
  'environmental-scientist': {
    title: 'Nhà khoa học Môi trường & Bền vững',
    cluster: 'Khoa học Tự nhiên & Môi trường',
    desc: 'Nghiên cứu biến đổi khí hậu, đánh giá tác động sinh thái và thiết kế các chính sách bảo vệ tài nguyên thiên nhiên.'
  },
  'ux-designer': {
    title: 'Nhà thiết kế Trải nghiệm Người dùng (UX/UI Designer)',
    cluster: 'Nghệ thuật, Thiết kế & Truyền thông Số',
    desc: 'Thấu cảm hành vi người dùng, phác thảo khung sườn (wireframe) và xây dựng giao diện số trực quan, thuận tiện.'
  },
  'game-developer': {
    title: 'Lập trình viên Phát triển Game (Game Developer)',
    cluster: 'Nghệ thuật, Thiết kế & Truyền thông Số',
    desc: 'Lập trình cơ chế vật lý, đồ họa chuyển động và logic tương tác trong môi trường game 2D và 3D chân thực.'
  },
  'physician-doctor': {
    title: 'Bác sĩ Đa khoa / Lâm sàng (Medical Doctor)',
    cluster: 'Y tế & Khoa học Sức khỏe',
    desc: 'Chẩn đoán bệnh lý, chỉ định phác đồ điều trị và chăm sóc sức khỏe thể chất toàn diện cho bệnh nhân.'
  },
  'civil-engineer': {
    title: 'Kỹ sư Xây dựng & Kết cấu Công trình (Civil Engineer)',
    cluster: 'Kỹ thuật & Công nghệ Chế tạo',
    desc: 'Quy hoạch, thiết kế kết cấu cầu đường, tòa nhà cao tầng và mạng lưới hạ tầng đô thị an toàn, bền bỉ.'
  },
  'financial-analyst': {
    title: 'Chuyên viên Phân tích Tài chính & Đầu tư',
    cluster: 'Kinh doanh, Tài chính & Quản trị',
    desc: 'Xây dựng mô hình định giá dòng tiền, thẩm định danh mục đầu tư và tư vấn chiến lược tài chính doanh nghiệp.'
  },
  'product-manager': {
    title: 'Giám đốc Sản phẩm Công nghệ (Product Manager)',
    cluster: 'Kinh doanh, Tài chính & Quản trị',
    desc: 'Định hình tầm nhìn sản phẩm, dung hòa nhu cầu người dùng, công nghệ và mục tiêu kinh doanh của công ty.'
  },
  'clinical-psychologist': {
    title: 'Chuyên gia Tâm lý học Lâm sàng & Tham vấn',
    cluster: 'Khoa học Xã hội & Giáo dục',
    desc: 'Trị liệu tâm lý, tham vấn phục hồi cảm xúc và nghiên cứu nhận thức hành vi con người.'
  },
  'high-school-teacher': {
    title: 'Giáo viên Trung học Phổ thông & Nhà Sư phạm',
    cluster: 'Khoa học Xã hội & Giáo dục',
    desc: 'Truyền cảm hứng tri thức, phát triển phương pháp sư phạm sáng tạo và dìu dắt thế hệ học sinh trưởng thành.'
  },
  'supply-chain-manager': {
    title: 'Chuyên gia Quản trị Chuỗi cung ứng & Logistics',
    cluster: 'Vận tải, Logistics & Năng lượng',
    desc: 'Điều phối dòng lưu chuyển hàng hóa, tối ưu hóa kho vận toàn cầu và giải quyết rủi ro chuỗi cung ứng.'
  },
  'renewable-energy-engineer': {
    title: 'Kỹ sư Năng lượng Tái tạo (Điện gió & Mặt trời)',
    cluster: 'Vận tải, Logistics & Năng lượng',
    desc: 'Nghiên cứu, lắp đặt và tích hợp các trang trại điện mặt trời, tua-bin gió vào lưới điện thông minh xanh sạch.'
  }
};
