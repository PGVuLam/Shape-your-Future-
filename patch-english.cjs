const fs = require('fs');

const p = 'src/data/careers.ts';
let content = fs.readFileSync(p, 'utf8');

const replacements = [
  ['"careerCluster": "Design"', '"careerCluster": "Thiết kế"'],
  ['"careerCluster": "Arts"', '"careerCluster": "Nghệ thuật"'],
  ['"careerCluster": "Environment"', '"careerCluster": "Môi trường"'],
  ['"careerCluster": "Architecture"', '"careerCluster": "Kiến trúc"'],
  ['"careerCluster": "Finance"', '"careerCluster": "Tài chính"'],
  ['"careerCluster": "Social Services"', '"careerCluster": "Dịch vụ Xã hội"'],
  ['"careerCluster": "Education"', '"careerCluster": "Giáo dục"'],
  ['"careerCluster": "Manufacturing"', '"careerCluster": "Sản xuất"'],
  
  // Descriptions
  [/Researches user behaviors and crafts intuitive, accessible, and visually captivating digital interfaces for websites, mobile applications, and software tools./g, "Nghiên cứu hành vi người dùng và tạo ra các giao diện kỹ thuật số trực quan, dễ truy cập và hấp dẫn cho trang web và ứng dụng di động."],
  [/Conceptualizes and programs gameplay mechanics, rules, balance, narrative worlds, and interactive audio-visual systems for video games on PC, console, and mobile./g, "Lên ý tưởng và lập trình cơ chế trò chơi, quy tắc, cân bằng, thế giới cốt truyện và hệ thống nghe nhìn tương tác cho các trò chơi điện tử trên PC, console và di động."],
  [/Studies the natural environment, analyzes pollutants, assesses climate change impacts, and designs conservation and remediation strategies for a sustainable planet./g, "Nghiên cứu môi trường tự nhiên, phân tích chất ô nhiễm, đánh giá tác động của biến đổi khí hậu và thiết kế các chiến lược bảo tồn vì một hành tinh bền vững."],
  [/Plans, designs, and oversees the construction of buildings, urban spaces, and transit networks balancing aesthetics, environmental sustainability, structural safety, and human community needs./g, "Lập kế hoạch, thiết kế và giám sát việc xây dựng các tòa nhà, không gian đô thị và mạng lưới giao thông cân bằng giữa thẩm mỹ, tính bền vững môi trường và nhu cầu cộng đồng."],
  [/Applies mathematical models, statistical algorithms, and financial data analysis to evaluate investment risks, value assets, and optimize financial portfolios./g, "Áp dụng các mô hình toán học, thuật toán thống kê và phân tích dữ liệu tài chính để đánh giá rủi ro đầu tư, định giá tài sản và tối ưu hóa danh mục đầu tư tài chính."],
  [/Assesses, diagnoses, and treats mental health challenges, emotional difficulties, learning disabilities, and behavioral disorders in children and adolescents./g, "Đánh giá, chẩn đoán và điều trị các thách thức về sức khỏe tâm thần, khó khăn về cảm xúc, khuyết tật học tập và rối loạn hành vi ở trẻ em và thanh thiếu niên."],
  [/Designs effective digital learning experiences, interactive curricula, and educational software integrating pedagogy with modern technology for schools, universities, and corporate training./g, "Thiết kế các trải nghiệm học tập kỹ thuật số hiệu quả, chương trình giảng dạy tương tác và phần mềm giáo dục tích hợp sư phạm với công nghệ hiện đại."],
  [/Sets up, programs, and operates computer numerically controlled \(CNC\) machines, laser cutters, and automated fabrication systems to produce high-precision aerospace, medical, and automotive components./g, "Thiết lập, lập trình và vận hành máy điều khiển kỹ thuật số (CNC), máy cắt laser và các hệ thống chế tạo tự động để sản xuất các linh kiện hàng không, y tế và ô tô độ chính xác cao."],
  
  // Diff
  [/"difficulty": "Beginner"/g, '"difficulty": "Cơ bản"'],
  [/"difficulty": "Intermediate"/g, '"difficulty": "Trung bình"'],
  [/"difficulty": "Advanced"/g, '"difficulty": "Nâng cao"']
];

for (const [en, vi] of replacements) {
  content = content.replace(en, vi);
}

fs.writeFileSync(p, content, 'utf8');
console.log('patched clusters and descriptions');
