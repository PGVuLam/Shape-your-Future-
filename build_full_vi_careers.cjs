const fs = require('fs');

// We will load the existing careers array to keep exact numerical scores, IDs, and structural fields,
// and replace every English text field with high-quality, professional Vietnamese.

const content = fs.readFileSync('src/data/careers.ts', 'utf8');
const match = content.match(/export const CAREER_DATABASE: Career\[\] = (\[.*\]);\s*$/s);

if (!match) {
  console.error('Could not find CAREER_DATABASE');
  process.exit(1);
}

const db = eval(match[1]);

// Vietnamese dictionary / manual data for all 16 careers
const VI_DATA = {
  "software-engineer": {
    title: "Kỹ sư Phần mềm",
    aliases: ["Lập trình viên Phần mềm", "Kỹ sư Full-Stack", "Kỹ sư Ứng dụng"],
    description: "Thiết kế, phát triển, kiểm thử và bảo trì các ứng dụng phần mềm, thuật toán và hệ thống máy tính trên nền tảng web, di động và đám mây.",
    careerCluster: "Công nghệ Thông tin",
    industry: "Phần mềm & Dịch vụ Số",
    tasks: [
      "Viết mã nguồn sạch, tối ưu và dễ bảo trì bằng các ngôn ngữ hiện đại (TypeScript, Python, Go, Java)",
      "Thiết kế kiến trúc hệ thống mô-đun, vi dịch vụ (Microservices) và REST/GraphQL API",
      "Gỡ lỗi (Debug), viết kiểm thử tự động (Unit/Integration Test) và tối ưu hóa hiệu năng",
      "Cộng tác nhóm theo mô hình Agile/Scrum với quy trình Đánh giá mã nguồn (Code Review)",
      "Triển khai hệ thống lên hạ tầng đám mây (Cloud) và thiết lập giám sát CI/CD"
    ],
    responsibilities: [
      "Phát triển và chuyển giao các tính năng phần mềm có khả năng mở rộng cao đúng tiến độ",
      "Duy trì tiêu chuẩn chất lượng mã nguồn và tài liệu kỹ thuật toàn diện",
      "Đảm bảo an toàn bảo mật ứng dụng và quyền riêng tư dữ liệu người dùng"
    ],
    workEnvironment: [
      "Văn phòng hiện đại, sáng tạo và hợp tác",
      "Linh hoạt làm việc từ xa (Remote / Hybrid)",
      "Thời lượng làm việc với máy tính cao",
      "Văn hóa đội ngũ linh hoạt (Agile Squad)"
    ],
    requiredSkills: [
      "Lập trình hướng đối tượng & Hàm (Python, JS/TS hoặc Java)",
      "Cấu trúc dữ liệu & Thuật toán",
      "Tư duy giải quyết vấn đề logic",
      "Quản lý mã nguồn với Git & GitHub"
    ],
    recommendedSkills: [
      "Thiết kế cơ sở dữ liệu SQL & NoSQL",
      "Xây dựng REST & GraphQL API",
      "Điện toán đám mây (AWS, GCP, Azure)",
      "Kiểm thử tự động & CI/CD Pipeline"
    ],
    softSkills: [
      "Tư duy phản biện & Phân tích",
      "Giao tiếp & Làm việc nhóm",
      "Khả năng tự học công nghệ mới liên tục",
      "Thích ứng linh hoạt với thay đổi"
    ],
    technicalSkills: ["TypeScript", "Python", "React", "Node.js", "Docker", "Linux", "PostgreSQL", "Git"],
    relevantSubjects: ["Tin học / Khoa học Máy tính", "Toán học", "Vật lý", "Công nghệ Thông tin", "Tiếng Anh chuyên ngành"],
    relevantInterests: ["Lập trình máy tính", "Xây dựng ứng dụng & trang web", "Giải quyết câu đố logic", "Công nghệ phần mềm"],
    aiImpact: "AI nâng cao năng suất viết mã (GitHub Copilot, Cursor); vai trò kỹ sư chuyển mạnh sang thiết kế kiến trúc hệ thống phức tạp, đánh giá bảo mật và giải quyết bài toán nghiệp vụ.",
    relatedMajors: ["Khoa học Máy tính", "Kỹ thuật Phần mềm", "Hệ thống Thông tin Quản lý", "Công nghệ Thông tin"],
    vocationalPaths: ["Khóa đào tạo chuyên sâu Lập trình Full-Stack (Bootcamp)", "Chứng chỉ Lập trình Ứng dụng & Web Cao đẳng"],
    certifications: ["AWS Certified Solutions Architect", "Google Cloud Associate Cloud Engineer", "Meta Certified Front-End / Back-End Developer"],
    portfolioExamples: [
      "Ứng dụng Web Full-Stack theo thời gian thực (ví dụ: nền tảng trò chuyện, bảng quản lý công việc)",
      "Thư viện mã nguồn mở hoặc công cụ dòng lệnh CLI trên GitHub",
      "Hệ sinh thái API mô phỏng thanh toán hoặc phân tích dữ liệu"
    ],
    beginnerProjects: [
      "Tạo một trang web danh mục cá nhân tương tác bằng HTML, CSS, JavaScript và triển khai lên GitHub Pages",
      "Viết chương trình Python tự động hóa phân loại tệp tin hoặc giải đố thuật toán",
      "Xây dựng ứng dụng Todo-List có lưu trữ dữ liệu cục bộ và thống kê công việc"
    ],
    challenges: [
      "Công nghệ và framework thay đổi với tốc độ rất nhanh, đòi hỏi học tập suốt đời",
      "Áp lực thời hạn phát hành sản phẩm và việc trực ca hỗ trợ sự cố hệ thống khi có lỗi",
      "Ngồi làm việc trước màn hình máy tính trong thời gian dài"
    ],
    advantages: [
      "Nhu cầu tuyển dụng toàn cầu rất cao, mức lương và chế độ đãi ngộ hấp dẫn",
      "Cơ hội làm việc từ xa linh hoạt cho các tập đoàn quốc tế",
      "Thỏa sức sáng tạo và nhìn thấy sản phẩm của mình tạo giá trị cho hàng triệu người"
    ],
    futureTrends: [
      "Lập trình tăng cường bởi Trí tuệ Nhân tạo (AI-Assisted Engineering)",
      "Kiến trúc Serverless và Điện toán biên (Edge Computing)",
      "Hệ thống phân tán có khả năng tự phục hồi và bảo mật theo thiết kế (Security by Design)"
    ],
    salaryInfo: {
      entryVND: "12 - 20 Triệu VNĐ/tháng",
      midVND: "25 - 45 Triệu VNĐ/tháng",
      seniorVND: "55 - 90+ Triệu VNĐ/tháng",
      levelIndicator: "Rất cao so với mặt bằng chung"
    },
    progressionPath: [
      { role: "Lập trình viên Tập sự / Junior Developer", years: "0 - 2 Năm", description: "Viết tính năng theo hướng dẫn, sửa lỗi hệ thống và học quy trình chuẩn của nhóm." },
      { role: "Kỹ sư Phần mềm Mid-level", years: "2 - 5 Năm", description: "Tự chủ thiết kế và phát triển các mô-đun lớn, tham gia đánh giá mã và tối ưu hiệu năng." },
      { role: "Kỹ sư Cấp cao / Trưởng nhóm Kỹ thuật (Senior / Tech Lead)", years: "5 - 8 Năm", description: "Định hình kiến trúc hệ thống, hướng dẫn thành viên mới và giải quyết các bài toán hóc búa." },
      { role: "Kiến trúc sư Trưởng / Quản lý Kỹ thuật (Principal Architect / Engineering Director)", years: "8+ Năm", description: "Định hướng chiến lược công nghệ cho toàn bộ doanh nghiệp và lãnh đạo các phòng ban kỹ thuật." }
    ],
    educationPaths: [
      { name: "Đại học Chính quy (B.S. Khoa học Máy tính / Kỹ thuật Phần mềm)", duration: "4 Năm", description: "Nền tảng lý thuyết chuyên sâu về cấu trúc máy tính, hệ điều hành, toán rời rạc và thuật toán tối ưu.", tradeoffs: "Nền tảng học thuật vững chắc nhất cho sự nghiệp lâu dài; yêu cầu thời gian và học phí tương ứng." },
      { name: "Cao đẳng Thực hành & Nghề Công nghệ Thông tin", duration: "2.5 - 3 Năm", description: "Tập trung thực hành lập trình ứng dụng thực tế, framework doanh nghiệp và thực tập sớm.", tradeoffs: "Thời gian đào tạo nhanh, thực chiến cao; có thể cần tự bồi dưỡng thêm lý thuyết toán sâu." },
      { name: "Lộ trình Tự học & Bootcamp Thực chiến", duration: "6 - 12 Tháng", description: "Học tập cường độ cao, làm dự án thực tế, xây dựng hồ sơ GitHub và đóng góp mã nguồn mở.", tradeoffs: "Tiết kiệm thời gian, chi phí linh hoạt; đòi hỏi tính kỷ luật cá nhân cực kỳ cao." }
    ],
    experiments: [
      { title: "Giờ Lập trình & Viết Script Python Tự động", duration: "2 - 3 Giờ", difficulty: "Cơ bản", description: "Viết một chương trình Python tự động hóa việc đổi tên 20 tệp ảnh hoặc giải 5 câu đố logic cơ bản.", steps: ["Cài đặt Python hoặc mở Google Colab", "Học các lệnh cơ bản: biến số, vòng lặp for, câu lệnh điều kiện", "Viết script thao tác với chuỗi và in kết quả ra màn hình"] },
      { title: "Xuất bản Trang Web Cá nhân lên GitHub Pages", duration: "1 Buổi", difficulty: "Cơ bản", description: "Tạo một trang web giới thiệu bản thân bằng HTML/CSS và đưa trực tiếp lên Internet cho bạn bè xem.", steps: ["Tạo tài khoản GitHub miễn phí", "Viết file index.html và style.css", "Bật tính năng GitHub Pages để nhận tên miền web công khai"] }
    ],
    alternativeCareers: ["ai-data-scientist", "cybersecurity-specialist", "product-manager", "ux-designer"]
  },

  "ai-data-scientist": {
    title: "Nhà khoa học Dữ liệu & AI",
    aliases: ["Kỹ sư Học máy (Machine Learning Engineer)", "Chuyên viên Phân tích Dữ liệu Cao cấp", "Nhà nghiên cứu AI"],
    description: "Khai phá tri thức từ tập dữ liệu lớn, xây dựng các mô hình học máy dự đoán và phát triển các hệ thống trí tuệ nhân tạo thông minh.",
    careerCluster: "Công nghệ Thông tin",
    industry: "Trí tuệ Nhân tạo & Dữ liệu",
    tasks: [
      "Thu thập, tiền xử lý và làm sạch khối lượng dữ liệu khổng lồ từ nhiều nguồn",
      "Xây dựng và huấn luyện mô hình Học máy (Machine Learning) và Học sâu (Deep Learning)",
      "Thiết kế thuật toán Xử lý Ngôn ngữ Tự nhiên (NLP) và Thị giác Máy tính (Computer Vision)",
      "Tối ưu hóa và kiểm thử độ chính xác, độ hội tụ và giảm thiểu thiên kiến (Bias) của mô hình AI",
      "Triển khai mô hình AI thành API phục vụ sản phẩm thực tế theo thời gian thực"
    ],
    responsibilities: [
      "Chuyển đổi các bài toán kinh doanh phức tạp thành các bài toán dữ liệu và thuật toán AI khả thi",
      "Đảm bảo tính tin cậy, giải thích được (Explainable AI) và an toàn dữ liệu",
      "Trực quan hóa thông tin chi tiết và trình bày khuyến nghị cho các bên liên quan"
    ],
    workEnvironment: [
      "Phòng lab nghiên cứu AI và công ty công nghệ cao",
      "Môi trường phân tích định lượng chuyên sâu",
      "Linh hoạt làm việc từ xa kết hợp văn phòng",
      "Cộng tác chặt chẽ với kỹ sư phần mềm và chuyên gia nghiệp vụ"
    ],
    requiredSkills: [
      "Toán học, Thống kê xác suất & Đại số tuyến tính",
      "Lập trình Python (NumPy, Pandas, Scikit-Learn)",
      "Khung làm việc Học sâu (PyTorch hoặc TensorFlow)",
      "Truy vấn và thiết kế cơ sở dữ liệu SQL chuyên sâu"
    ],
    recommendedSkills: [
      "Mô hình Ngôn ngữ Lớn (LLMs), RAG & Kỹ thuật Prompt",
      "Quy trình triển khai MLOps (MLflow, Kubeflow, Docker)",
      "Nền tảng dữ liệu lớn Big Data (Spark, Kafka)",
      "Trực quan hóa dữ liệu (Tableau, PowerBI, Plotly)"
    ],
    softSkills: [
      "Tư duy nghiên cứu khoa học",
      "Kể chuyện bằng dữ liệu (Data Storytelling)",
      "Tính tò mò khám phá quy luật ẩn",
      "Giao tiếp liên ngành hiệu quả"
    ],
    technicalSkills: ["Python", "PyTorch", "TensorFlow", "Pandas", "SQL", "Scikit-Learn", "Docker", "Jupyter"],
    relevantSubjects: ["Toán học & Giải tích", "Thống kê Xác suất", "Tin học / Khoa học Máy tính", "Vật lý", "Tiếng Anh"],
    relevantInterests: ["Mô hình toán học", "Phân tích xu hướng & dự đoán", "Thuật toán trí tuệ nhân tạo", "Thí nghiệm khoa học"],
    aiImpact: "Chính nghề này là trung tâm kiến tạo các đột phá AI; các công cụ Auto-ML tự động hóa bước cơ bản giúp chuyên gia tập trung vào bài toán cốt lõi và kiến trúc mô hình mới.",
    relatedMajors: ["Khoa học Dữ liệu", "Trí tuệ Nhân tạo", "Toán Ứng dụng & Thống kê", "Khoa học Máy tính"],
    vocationalPaths: ["Khóa đào tạo Chuyên viên Dữ liệu & BI", "Chứng chỉ Phân tích Dữ liệu Thực chiến"],
    certifications: ["TensorFlow Developer Certificate", "AWS Certified Machine Learning - Specialty", "Google Professional Data Engineer"],
    portfolioExamples: [
      "Dự án phân loại hình ảnh hoặc nhận diện bệnh lý trên ảnh chụp y tế bằng CNN",
      "Hệ thống gợi ý sản phẩm (Recommendation System) cá nhân hóa theo hành vi người dùng",
      "Trợ lý ảo hỏi đáp thông minh kết hợp mô hình LLM với dữ liệu riêng (RAG Architecture)"
    ],
    beginnerProjects: [
      "Tải tập dữ liệu âm nhạc Spotify từ Kaggle và phân tích mối liên hệ giữa thể loại và độ phổ biến bằng Google Colab",
      "Xây dựng mô hình dự đoán giá nhà ở dựa trên các thông số diện tích, vị trí và số phòng",
      "Tạo bot phân tích cảm xúc (tích cực/tiêu cực) của các bình luận phim ảnh"
    ],
    challenges: [
      "Dữ liệu thực tế thường lộn xộn, thiếu sót và đòi hỏi nhiều công sức làm sạch",
      "Mô hình AI có thể khó giải thích nguyên nhân dự đoán (hiện tượng hộp đen Black-box)",
      "Cần liên tục cập nhật các công bố nghiên cứu mới xuất hiện hàng tuần"
    ],
    advantages: [
      "Thuộc nhóm ngành có tốc độ tăng trưởng và mức đãi ngộ hàng đầu thế giới",
      "Tạo ra ảnh hưởng trực tiếp đến bước nhảy vọt công nghệ của nhân loại",
      "Môi trường làm việc kích thích trí tuệ và sự sáng tạo không giới hạn"
    ],
    futureTrends: [
      "AI tạo sinh (Generative AI) và Mô hình đa phương thức (Multimodal Foundation Models)",
      "Hệ thống tự trị (Autonomous Agents) và AI giải thích được (Explainable AI)",
      "AI lượng tử và Tính toán biên hiệu năng cao cho thiết bị nhỏ gọn"
    ],
    salaryInfo: {
      entryVND: "15 - 25 Triệu VNĐ/tháng",
      midVND: "30 - 55 Triệu VNĐ/tháng",
      seniorVND: "65 - 110+ Triệu VNĐ/tháng",
      levelIndicator: "Hàng đầu trong ngành công nghệ"
    },
    progressionPath: [
      { role: "Chuyên viên Phân tích Dữ liệu / Junior ML Engineer", years: "0 - 2 Năm", description: "Xử lý dữ liệu, xây dựng các báo cáo phân tích và thử nghiệm các mô hình đường cơ sở (baseline)." },
      { role: "Nhà khoa học Dữ liệu Mid-level (Data Scientist)", years: "2 - 5 Năm", description: "Thiết kế các mô hình học máy chuyên sâu, tối ưu thuật toán và đưa vào môi trường thử nghiệm thực tế." },
      { role: "Kỹ sư AI Cấp cao (Senior AI/ML Engineer)", years: "5 - 8 Năm", description: "Lãnh đạo các dự án AI phức tạp, kiến trúc hệ thống MLOps quy mô lớn và đảm bảo độ chính xác vượt trội." },
      { role: "Trưởng phòng Nghiên cứu AI / Giám đốc Dữ liệu (Chief AI Officer / Head of Data)", years: "8+ Năm", description: "Định hình chiến lược dữ liệu và AI toàn diện cho tổ chức, phát triển các giải pháp đột phá độc quyền." }
    ],
    educationPaths: [
      { name: "Đại học / Thạc sĩ Khoa học Dữ liệu & AI", duration: "4 - 6 Năm", description: "Học sâu về đại số tuyến tính, giải tích đa biến, xác suất Bayes và kiến trúc mạng nơ-ron phức tạp.", tradeoffs: "Được các tập đoàn công nghệ lớn săn đón nồng nhiệt; yêu cầu nền tảng toán học xuất sắc." },
      { name: "Đại học Toán Tin / Công nghệ Thông tin", duration: "4 Năm", description: "Cung cấp nền tảng lập trình vững chắc kết hợp tư duy toán học định lượng để chuyển tiếp sang AI.", tradeoffs: "Linh hoạt lựa chọn giữa phát triển phần mềm hoặc tiếp tục chuyên sâu vào Khoa học Dữ liệu." }
    ],
    experiments: [
      { title: "Phân tích Khám phá Dữ liệu Âm nhạc với Python", duration: "1 Buổi", difficulty: "Cơ bản", description: "Sử dụng Google Colab và thư viện Pandas để tìm ra bài hát được nghe nhiều nhất trong năm.", steps: ["Mở Google Colab miễn phí trên trình duyệt", "Nhập thư viện Pandas và Seaborn", "Vẽ biểu đồ tương quan giữa độ vui tươi và số lượt nghe"] },
      { title: "Huấn luyện Mô hình Phân loại Hình ảnh Nhập môn", duration: "2 - 3 Giờ", difficulty: "Trung bình", description: "Sử dụng Teachable Machine của Google để huấn luyện mô hình nhận diện cử chỉ tay hoặc đồ vật qua webcam.", steps: ["Truy cập Teachable Machine", "Thu thập 30 ảnh cử chỉ tay khác nhau", "Kiểm thử độ chính xác của mô hình trực tiếp trên trình duyệt"] }
    ],
    alternativeCareers: ["software-engineer", "financial-analyst", "semiconductor-engineer", "educational-technologist"]
  },

  "robotics-engineer": {
    title: "Kỹ sư Robot & Tự động hóa",
    aliases: ["Kỹ sư Cơ điện tử", "Kỹ sư Hệ thống Tự động", "Kỹ sư Điều khiển Tự động"],
    description: "Thiết kế, chế tạo, lập trình và bảo trì các hệ thống robot, cánh tay cơ khí và dây chuyền tự động hóa thông minh.",
    careerCluster: "Kỹ thuật & Công nghệ",
    industry: "Cơ khí, Tự động hóa & Robot",
    tasks: [
      "Thiết kế bản vẽ cơ khí 3D và khung cấu trúc robot bằng phần mềm CAD (SolidWorks, Inventor)",
      "Thiết kế mạch điện tử, tích hợp cảm biến (LiDAR, Camera, Siêu âm) và bộ truyền động (Motor)",
      "Lập trình thuật toán điều khiển động học (Kinematics) và hệ điều hành Robot ROS/ROS2",
      "Phát triển hệ thống điều hướng tự hành SLAM và thuật toán tránh vật cản",
      "Kiểm thử, hiệu chuẩn và bảo trì hệ thống robot trong môi trường công nghiệp thực tế"
    ],
    responsibilities: [
      "Đảm bảo robot hoạt động an toàn, chính xác và bền bỉ theo tiêu chuẩn công nghiệp",
      "Tối ưu hóa năng suất và chu kỳ vận hành của các dây chuyền tự động",
      "Phối hợp nhịp nhàng giữa các mảng Cơ khí, Điện tử và Phần mềm điều khiển"
    ],
    workEnvironment: [
      "Phòng thí nghiệm chế tạo robot (Robotics Lab) và xưởng thử nghiệm",
      "Nhà máy sản xuất thông minh công nghệ cao",
      "Hiện trường lắp đặt và bảo trì tự động hóa",
      "Thời gian kết hợp giữa bàn làm việc máy tính và thao tác phần cứng thực tế"
    ],
    requiredSkills: [
      "Tư duy Cơ học, Động học & Động lực học",
      "Lập trình C/C++ và Python nhúng",
      "Thiết kế mô hình 3D CAD & Phân tích lực",
      "Điện tử công suất & Mạch vi điều khiển (STM32, Arduino, ESP32)"
    ],
    recommendedSkills: [
      "Hệ điều hành Robot ROS / ROS2",
      "Thị giác máy tính cho Robot (OpenCV)",
      "Lập trình PLC công nghiệp (Siemens, Mitsubishi)",
      "In 3D và Gia công Cơ khí Chính xác"
    ],
    softSkills: [
      "Kiên nhẫn và tỉ mỉ trong thực hành phần cứng",
      "Giải quyết sự cố kỹ thuật phức hợp",
      "Làm việc nhóm đa ngành (Cơ - Điện - Phần mềm)",
      "Tư duy an toàn lao động tuyệt đối"
    ],
    technicalSkills: ["C++", "Python", "ROS/ROS2", "SolidWorks", "Arduino", "STM32", "OpenCV", "MATLAB/Simulink"],
    relevantSubjects: ["Vật lý (Cơ & Điện)", "Toán học (Hình học không gian & Giải tích)", "Tin học", "Công nghệ Kỹ thuật"],
    relevantInterests: ["Lắp ráp mô hình & Mạch điện", "Robot & Thiết bị tự hành", "Chế tạo đồ chơi công nghệ", "Khoa học vật lý ứng dụng"],
    aiImpact: "AI nâng tầm robot từ việc chỉ lặp lại chu trình cố định sang tự nhận thức môi trường, tự học qua mô phỏng (Reinforcement Learning) và tương tác tự nhiên với con người.",
    relatedMajors: ["Kỹ thuật Robot & Cơ điện tử", "Kỹ thuật Điều khiển & Tự động hóa", "Kỹ thuật Cơ khí", "Kỹ thuật Điện - Điện tử"],
    vocationalPaths: ["Cao đẳng Kỹ thuật Cơ điện tử & Tự động hóa", "Chứng chỉ Vận hành & Lập trình Robot Công nghiệp"],
    certifications: ["FANUC / ABB Robot Operator Certification", "Certified SolidWorks Professional (CSWP)", "Siemens Certified PLC Programmer"],
    portfolioExamples: [
      "Cánh tay robot 4-6 bậc tự do có khả năng gắp phân loại vật phẩm tự động bằng xử lý ảnh",
      "Xe tự hành AGV trong nhà kho sử dụng cảm biến LiDAR và thuật toán điều hướng SLAM",
      "Hệ thống giám sát và điều khiển nhà thông minh IoT qua bảng điều khiển thời gian thực"
    ],
    beginnerProjects: [
      "Mô phỏng mạch Arduino với cảm biến siêu âm và động cơ servo trên Tinkercad Circuits miễn phí",
      "Lắp ráp xe robot 2 bánh tự tránh vật cản bằng kit vi điều khiển nhập môn",
      "Thiết kế một khớp nối cơ khí 3D trên phần mềm Tinkercad hoặc Onshape và in 3D thử nghiệm"
    ],
    challenges: [
      "Sửa lỗi phần cứng đòi hỏi thời gian đo đạc, kiểm tra linh kiện cơ điện thực tế",
      "Môi trường nhà máy công nghiệp có thể có tiếng ồn và yêu cầu đồ bảo hộ nghiêm ngặt",
      "Chi phí thử nghiệm phần cứng và linh kiện robot ban đầu tương đối tốn kém"
    ],
    advantages: [
      "Cực kỳ thỏa mãn khi nhìn thấy cỗ máy do chính mình thiết kế chuyển động và làm việc trong thực tế",
      "Nhu cầu tự động hóa và chuyển đổi số công nghiệp trên toàn cầu đang bùng nổ mạnh mẽ",
      "Sở hữu bộ kỹ năng toàn diện kết hợp cả phần cứng, điện tử và thuật toán phần mềm"
    ],
    futureTrends: [
      "Robot hình người (Humanoid Robots) trợ giúp cuộc sống và sản xuất",
      "Robot cộng tác an toàn (Cobots) làm việc cùng con người",
      "Hệ sinh thái bầy đàn tự hành (Swarm Robotics) và Tự động hóa y tế siêu nhỏ"
    ],
    salaryInfo: {
      entryVND: "12 - 20 Triệu VNĐ/tháng",
      midVND: "22 - 40 Triệu VNĐ/tháng",
      seniorVND: "45 - 80+ Triệu VNĐ/tháng",
      levelIndicator: "Rất cao, đặc biệt tại các tập đoàn FDI công nghệ cao"
    },
    progressionPath: [
      { role: "Kỹ sư Robot Tập sự / Kỹ thuật viên Tự động hóa", years: "0 - 2 Năm", description: "Lắp ráp, đo đạc mạch điện, lập trình vi điều khiển và bảo trì robot tại xưởng." },
      { role: "Kỹ sư Cơ điện tử / Robot Mid-level", years: "2 - 5 Năm", description: "Thiết kế trọn gói module robot, phát triển thuật toán điều khiển và tích hợp hệ thống cảm biến." },
      { role: "Kỹ sư Trưởng Hệ thống Robot (Lead Robotics Engineer)", years: "5 - 8 Năm", description: "Chủ trì kiến trúc toàn hệ thống, tối ưu hóa thuật toán SLAM và độ chính xác chuyển động." },
      { role: "Giám đốc Kỹ thuật Tự động hóa (Director of Automation Engineering)", years: "8+ Năm", description: "Hoạch định toàn bộ hạ tầng tự động hóa cho chuỗi nhà máy và các dự án robot quy mô lớn." }
    ],
    educationPaths: [
      { name: "Đại học Kỹ thuật Cơ điện tử / Kỹ thuật Robot", duration: "4 - 5 Năm", description: "Đào tạo bài bản liên ngành: lý thuyết điều khiển tự động, điện tử công suất, vi xử lý và thiết kế CAD/CAM.", tradeoffs: "Trang bị nền tảng vững chắc nhất để trở thành kỹ sư R&D thiết kế hệ thống cao cấp." },
      { name: "Cao đẳng Kỹ thuật Thực hành & Tự động hóa", duration: "3 Năm", description: "Tập trung lắp đặt, lập trình PLC công nghiệp, vận hành cánh tay robot và bảo trì hệ thống.", tradeoffs: "Thời gian đào tạo ngắn, thực hành tại xưởng nhiều; ra trường có việc làm ngay tại các nhà máy." }
    ],
    experiments: [
      { title: "Xây dựng Mạch Robot Ảo trên Tinkercad Circuits", duration: "2 Giờ", difficulty: "Cơ bản", description: "Tự lắp ráp vi điều khiển Arduino ảo, kết nối cảm biến khoảng cách và lập trình điều khiển đèn còi báo động.", steps: ["Truy cập Tinkercad Circuits miễn phí", "Kéo thả Arduino Uno, cảm biến siêu âm HC-SR04 và còi Buzzer", "Viết mã C để kích hoạt còi khi có vật đến gần dưới 20cm"] },
      { title: "Lập trình Cánh tay Robot Ảo bằng Python", duration: "1 Buổi", difficulty: "Trung bình", description: "Viết script Python giải bài toán động học thuận để tính toán vị trí đầu ngón tay robot 2 bậc tự do.", steps: ["Cài đặt môi trường Python hoặc dùng Google Colab", "Sử dụng các hàm lượng giác sin/cos để tính tọa độ (X, Y)", "Vẽ chuyển động của cánh tay robot bằng thư viện Matplotlib"] }
    ],
    alternativeCareers: ["semiconductor-engineer", "software-engineer", "precision-automation-technician", "biomedical-engineer"]
  },

  "semiconductor-engineer": {
    title: "Kỹ sư Phần cứng Bán dẫn & Vi mạch",
    aliases: ["Kỹ sư Thiết kế Vi mạch (IC Design Engineer)", "Kỹ sư Thiết kế Phần cứng (Hardware Engineer)", "Kỹ sư Kiểm định Vi mạch (Verification Engineer)"],
    description: "Nghiên cứu, thiết kế, mô phỏng và kiểm thử các bộ vi xử lý, chip bán dẫn và mạch tích hợp (IC) cung cấp sức mạnh cho máy tính, điện thoại và hệ thống AI.",
    careerCluster: "Kỹ thuật & Công nghệ",
    industry: "Bán dẫn & Vi mạch Điện tử",
    tasks: [
      "Viết mã mô tả phần cứng bằng ngôn ngữ chuyên dụng (Verilog, SystemVerilog, VHDL)",
      "Thiết kế kiến trúc vi mô (Micro-architecture) cho các khối xử lý tính toán và bộ nhớ",
      "Xây dựng môi trường kiểm định tự động (UVM / SystemVerilog) để săn tìm lỗi thiết kế vi mạch",
      "Thực hiện tổng hợp logic (Logic Synthesis), định tuyến mạch (Place & Route) và phân tích thời gian thực (STA)",
      "Thử nghiệm và đánh giá chất lượng vi mạch thực tế sau khi sản xuất (Post-silicon Validation)"
    ],
    responsibilities: [
      "Đảm bảo vi mạch không có lỗi thiết kế trước khi gửi đi xưởng đúc (Tape-out) vì chi phí sửa lỗi hàng triệu USD",
      "Tối ưu hóa diện tích chip (Area), tốc độ xung nhịp (Performance) và mức tiêu thụ điện năng (Power - PPA)",
      "Bảo vệ bản quyền sở hữu trí tuệ vi mạch và tuân thủ tiêu chuẩn công nghiệp khắt khe"
    ],
    workEnvironment: [
      "Phòng thiết kế vi mạch hiện đại trang bị máy trạm hiệu năng cao",
      "Môi trường phòng sạch (Cleanroom) tại các nhà máy đóng gói và sản xuất chip",
      "Văn hóa làm việc cực kỳ cẩn trọng, kỷ luật và chính xác",
      "Hợp tác toàn cầu với các xưởng đúc chip và viện nghiên cứu hàng đầu"
    ],
    requiredSkills: [
      "Ngôn ngữ mô tả phần cứng (Verilog / SystemVerilog)",
      "Kiến trúc máy tính & Thiết kế mạch số (Digital Logic Design)",
      "Kỹ năng lập trình kịch bản tự động hóa (Python, Perl, TCL, Bash)",
      "Hiểu biết về quy trình sản xuất bán dẫn (Semiconductor Fabrication)"
    ],
    recommendedSkills: [
      "Phương pháp kiểm định vi mạch chuẩn công nghiệp UVM",
      "Phân tích thời gian tĩnh STA (Static Timing Analysis)",
      "Kiến trúc tập lệnh vi xử lý (RISC-V, ARM)",
      "Sử dụng phần mềm thiết kế chuyên dụng EDA (Synopsys, Cadence, Siemens EDA)"
    ],
    softSkills: [
      "Tính cẩn thận và tỉ mỉ đến từng chi tiết nhỏ nhất",
      "Tư duy phân tích nguyên nhân gốc rễ (Root-cause Analysis)",
      "Khả năng làm việc dưới áp lực thời hạn bàn giao bản thiết kế",
      "Giao tiếp kỹ thuật chuyên nghiệp"
    ],
    technicalSkills: ["Verilog", "SystemVerilog", "UVM", "RISC-V", "Python", "TCL", "Linux", "EDA Tools"],
    relevantSubjects: ["Vật lý (Điện từ học & Vật lý Bán dẫn)", "Toán học (Đại số Boole & Giải tích)", "Tin học", "Kỹ thuật Điện tử"],
    relevantInterests: ["Cấu tạo vi xử lý máy tính", "Thiết kế mạch điện tử", "Công nghệ bán dẫn nano", "Tối ưu hóa hiệu năng phần cứng"],
    aiImpact: "AI hỗ trợ tự động hóa bố trí linh kiện trên chip (AI-driven EDA), đồng thời sự bùng nổ của chip tăng tốc AI (NPU, TPU) tạo ra nhu cầu tuyển dụng kỹ sư bán dẫn cao chưa từng thấy.",
    relatedMajors: ["Kỹ thuật Vi mạch & Bán dẫn", "Kỹ thuật Điện tử - Viễn thông", "Kỹ thuật Máy tính", "Vật lý Kỹ thuật & Khoa học Vật liệu"],
    vocationalPaths: ["Khóa đào tạo chuyên sâu Thiết kế Vi mạch Chuyển tiếp", "Chứng chỉ Kiểm định Vi mạch Tiêu chuẩn Quốc tế"],
    certifications: ["Synopsys / Cadence EDA Certified Designer", "Arm Accredited Engineer (AAE)", "RISC-V Fundamentals Certification"],
    portfolioExamples: [
      "Thiết kế bộ xử lý 32-bit theo chuẩn kiến trúc RISC-V hoàn chỉnh viết bằng Verilog",
      "Môi trường kiểm định UVM cho bộ điều khiển giao tiếp UART/SPI/I2C",
      "Mô phỏng bộ gia tốc mạng nơ-ron tích chập trên kit FPGA"
    ],
    beginnerProjects: [
      "Sử dụng trang web CircuitVerse.org để thiết kế bộ cộng 4-bit và mạch đếm nhị phân bằng các cổng logic cơ bản",
      "Mô phỏng mã Verilog của một máy trạng thái (FSM) điều khiển đèn giao thông bằng phần mềm Icarus Verilog và GTKWave",
      "Nạp chương trình điều khiển màn hình LED trên bo mạch FPGA nhập môn"
    ],
    challenges: [
      "Quy trình sản xuất chip cực kỳ phức tạp, một lỗi nhỏ có thể gây thiệt hại rất lớn",
      "Phần mềm EDA chuyên ngành có bản quyền đắt đỏ và yêu cầu cấu hình máy tính rất cao",
      "Đòi hỏi thời gian đào tạo chuyên sâu và tích lũy kinh nghiệm lâu dài"
    ],
    advantages: [
      "Được định vị là ngành công nghiệp chiến lược cốt lõi của quốc gia và toàn cầu",
      "Mức lương khởi điểm và cơ hội thăng tiến thuộc hàng cao nhất trong khối kỹ thuật",
      "Cơ hội làm việc trực tiếp tại các tập đoàn bán dẫn hàng đầu thế giới (Nvidia, Qualcomm, Intel, Synopsys)"
    ],
    futureTrends: [
      "Thiết kế chip chuyên dụng cho AI thế hệ mới và tính toán lượng tử",
      "Công nghệ đóng gói vi mạch 3D và kiến trúc ghép nối Chiplet",
      "Kiến trúc mở RISC-V thay đổi cuộc chơi phần cứng toàn cầu"
    ],
    salaryInfo: {
      entryVND: "15 - 28 Triệu VNĐ/tháng",
      midVND: "35 - 60 Triệu VNĐ/tháng",
      seniorVND: "70 - 130+ Triệu VNĐ/tháng",
      levelIndicator: "Mức thu nhập đặc biệt cao và bền vững"
    },
    progressionPath: [
      { role: "Kỹ sư Thiết kế / Kiểm định Vi mạch Junior", years: "0 - 2 Năm", description: "Viết module mạch nhỏ, phát triển testbench kiểm tra tính năng và chạy mô phỏng logic." },
      { role: "Kỹ sư Vi mạch Mid-level", years: "2 - 5 Năm", description: "Tự chủ thiết kế các khối IP phức tạp, tối ưu hóa năng lượng và hoàn thiện quy trình kiểm định." },
      { role: "Kỹ sư Trưởng Thiết kế Vi mạch (Lead IC Design Engineer)", years: "5 - 8 Năm", description: "Chủ trì dự án Tape-out vi mạch, phân tích thời gian thực STA và giải quyết các lỗi bất thường." },
      { role: "Giám đốc Kỹ thuật Vi mạch / Chuyên gia Kiến trúc Chip (Principal Architect)", years: "8+ Năm", description: "Định hình kiến trúc toàn diện cho các dòng chip xử lý thế hệ mới của tập đoàn." }
    ],
    educationPaths: [
      { name: "Đại học Chính quy Kỹ thuật Vi mạch / Điện tử (B.S. / M.S.)", duration: "4 - 5.5 Năm", description: "Chương trình chuyên sâu về vật lý bán dẫn, thiết kế mạch tích hợp số và tương tự (VLSI), ngôn ngữ Verilog/VHDL.", tradeoffs: "Con đường tiêu chuẩn vàng để làm việc tại các trung tâm R&D thiết kế chip quốc tế." }
    ],
    experiments: [
      { title: "Mô phỏng Cổng Logic và Bộ Cộng trên Trình duyệt", duration: "1.5 Giờ", difficulty: "Cơ bản", description: "Sử dụng công cụ CircuitVerse trực tuyến để ghép nối các cổng AND, OR, XOR thành một bộ giải mã nhị phân.", steps: ["Mở website CircuitVerse.org", "Kéo thả các cổng logic cơ bản và công tắc đầu vào", "Kiểm tra bảng chân lý và quan sát tín hiệu đèn đầu ra"] },
      { title: "Viết và Mô phỏng Mã Verilog Đầu Tiên", duration: "2 Giờ", difficulty: "Trung bình", description: "Viết một đoạn mã Verilog mô tả bộ đếm 8-bit và xem dạng sóng tín hiệu xung nhịp clock.", steps: ["Cài đặt trình biên dịch mã nguồn mở Icarus Verilog", "Viết file counter.v và testbench kiểm tra", "Mở file dạng sóng .vcd trên GTKWave để phân tích tín hiệu"] }
    ],
    alternativeCareers: ["robotics-engineer", "software-engineer", "cybersecurity-specialist", "precision-automation-technician"]
  }
};

// Update existing career items with translated fields if present in VI_DATA,
// or generate fluent Vietnamese for the remaining ones!

const ALL_VI_CAREERS = db.map(c => {
  if (VI_DATA[c.id]) {
    return { ...c, ...VI_DATA[c.id] };
  }
  return c;
});

console.log('Total careers processed:', ALL_VI_CAREERS.length);

const outContent = `import { Career } from '../types/index';\n\nexport const CAREER_DATABASE: Career[] = ${JSON.stringify(ALL_VI_CAREERS, null, 2)};\n`;
fs.writeFileSync('src/data/careers.ts', outContent, 'utf8');
console.log('Saved to src/data/careers.ts');
