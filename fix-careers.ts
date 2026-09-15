import { CAREER_DATABASE } from './src/data/careers';
import fs from 'fs';

const translations: Record<string, any> = {
  'software-engineer': {
    description: 'Thiết kế, phát triển, kiểm thử và bảo trì các ứng dụng phần mềm, thuật toán và hệ thống máy tính trên web, thiết bị di động và nền tảng đám mây.',
    tasks: [
      'Viết mã nguồn sạch, dễ bảo trì và hiệu quả bằng các ngôn ngữ hiện đại',
      'Thiết kế kiến trúc phần mềm và API theo mô-đun',
      'Tìm và sửa lỗi, viết các bài kiểm tra tự động và tối ưu hóa hiệu suất',
      'Cộng tác trong các nhóm làm việc linh hoạt với đánh giá mã nguồn và lập trình đôi',
      'Triển khai ứng dụng lên hạ tầng đám mây và giám sát thời gian hoạt động'
    ],
    responsibilities: [
      'Cung cấp các tính năng phần mềm có thể mở rộng đúng thời hạn',
      'Duy trì chất lượng phần mềm và tài liệu mã nguồn',
      'Bảo vệ an ninh ứng dụng và quyền riêng tư dữ liệu'
    ],
    workEnvironment: ['Văn phòng hiện đại, hợp tác', 'Linh hoạt làm việc từ xa', 'Thời gian làm việc với màn hình cao', 'Môi trường nhóm Agile'],
    requiredSkills: ['Lập trình (Python, JS/TS hoặc Java)', 'Thuật toán & Cấu trúc dữ liệu', 'Giải quyết vấn đề', 'Quản lý phiên bản Git'],
    recommendedSkills: ['Thiết kế Cơ sở dữ liệu (SQL/NoSQL)', 'REST APIs', 'Điện toán đám mây (GCP/AWS)', 'Kiểm thử & CI/CD'],
    softSkills: ['Tư duy phân tích', 'Giao tiếp nhóm', 'Không ngừng học hỏi', 'Khả năng thích ứng'],
    relevantSubjects: ['Khoa học Máy tính', 'Toán học', 'Vật lý', 'Công nghệ Thông tin', 'Tiếng Anh'],
    relevantInterests: ['Lập trình', 'Giải quyết vấn đề', 'Xây dựng phần mềm', 'Công nghệ', 'Câu đố & Logic'],
    educationPaths: [
      {
        type: 'Đại học',
        duration: '4 Năm (Cử nhân Khoa học Máy tính hoặc Kỹ thuật Phần mềm)',
        description: 'Nền tảng lý thuyết toàn diện về lý thuyết tính toán, hệ điều hành, trình biên dịch và toán cao cấp.',
        tradeoffs: 'Chiều sâu lý thuyết và khả năng tuyển dụng cao, nhưng học phí cao hơn và chậm tiếp cận thực tế công nghiệp hơn.'
      },
      {
        type: 'Cao đẳng/Học nghề',
        duration: '2-3 Năm (Bằng liên kết / CNTT ứng dụng)',
        description: 'Tập trung vào phát triển ứng dụng và web, các framework doanh nghiệp và đào tạo nghề trực tiếp.',
        tradeoffs: 'Tham gia thị trường nhanh hơn với chi phí thấp hơn, nhưng có thể gặp rào cản khi xin việc tại các phòng nghiên cứu chuyên sâu.'
      },
      {
        type: 'Tự học / Hồ sơ năng lực',
        duration: '1-2 Năm tự học chuyên sâu',
        description: 'Tham gia các khóa đào tạo lập trình cường độ cao, đóng góp mã nguồn mở, kho lưu trữ GitHub cá nhân và các dự án tự do.',
        tradeoffs: 'Tính linh hoạt tối đa và chi phí tài chính thấp nhất, nhưng đòi hỏi tính kỷ luật tự giác cao và khả năng xây dựng mạng lưới quan hệ.'
      }
    ],
    beginnerProjects: ['Xây dựng một máy tính cá nhân tương tác', 'Tạo một trò chơi phiêu lưu dựa trên văn bản bằng Python', 'Phát triển một trang web danh mục đầu tư cá nhân đáp ứng'],
    workStyle: 'Phân tích, định hướng dự án, các đợt chạy nước rút hợp tác với các khoảng thời gian tập trung làm việc độc lập',
    challenges: ['Sự thay đổi nhanh chóng của công nghệ đòi hỏi không ngừng nâng cao kỹ năng', 'Ngồi nhiều trước màn hình', 'Sửa các lỗi phức tạp'],
    advantages: ['Nhu cầu toàn cầu cao và tính cơ động', 'Mức lương hấp dẫn', 'Tính tự chủ cao và sự thỏa mãn sáng tạo khi xây dựng hệ thống'],
    futureTrends: 'Gia tăng hiệu suất thông qua các trợ lý AI hỗ trợ lập trình; tập trung ngày càng nhiều vào hệ thống phân tán, bảo mật và năng suất của lập trình viên.',
    salaryInfo: {
      rangeDescription: 'Thay đổi nhiều tùy theo khu vực; thường nằm trong top 20% mức lương khởi điểm chuyên nghiệp.',
      disclaimer: 'Thông tin mang tính minh họa - cần xác minh tại địa phương với cơ quan lao động khu vực.',
      levelIndicator: 'Rất Cao'
    }
  },
  'cybersecurity-specialist': {
    description: 'Bảo vệ mạng máy tính, cơ sở hạ tầng đám mây và dữ liệu số khỏi các cuộc tấn công mạng, truy cập trái phép và các lỗ hổng bảo mật.',
    tasks: [
      'Giám sát lưu lượng mạng để phát hiện các mối đe dọa bảo mật',
      'Thực hiện kiểm tra xâm nhập và đánh giá lỗ hổng bảo mật',
      'Cấu hình tường lửa, hệ thống phát hiện xâm nhập và mã hóa',
      'Ứng phó với các sự cố bảo mật và tiến hành điều tra pháp y',
      'Giáo dục nhân viên về các phương pháp tốt nhất trong an ninh mạng'
    ],
    responsibilities: [
      'Bảo vệ dữ liệu bí mật và hệ thống cơ sở hạ tầng cốt lõi',
      'Tuân thủ các quy định và tiêu chuẩn bảo mật',
      'Phát hiện và giảm thiểu các rủi ro bảo mật'
    ],
    workEnvironment: ['Trung tâm điều hành an ninh mạng', 'Môi trường áp lực cao trong lúc ứng phó sự cố', 'Làm việc từ xa thường xuyên', 'Cần trực ban ngoài giờ'],
    requiredSkills: ['Mạng máy tính (TCP/IP, DNS, Định tuyến)', 'Hệ điều hành Linux/Unix', 'Phân tích rủi ro & Mối đe dọa', 'Mã hóa/Bảo mật'],
    recommendedSkills: ['Bảo mật Đám mây (AWS/Azure)', 'Kỹ thuật dịch ngược', 'Lập trình (Python/Bash)', 'Luật & Tuân thủ An ninh mạng'],
    softSkills: ['Tư duy phản biện', 'Bình tĩnh dưới áp lực', 'Chú ý đến chi tiết', 'Giải quyết vấn đề đạo đức'],
    relevantSubjects: ['Toán học', 'Khoa học Máy tính', 'Công nghệ Thông tin', 'Logic học', 'Mật mã học'],
    relevantInterests: ['Giải đố', 'Tìm hiểu hệ thống', 'Phân tích logic', 'Bảo vệ thông tin'],
    educationPaths: [
      {
        type: 'Đại học',
        duration: '4 Năm (Cử nhân An toàn Thông tin hoặc Khoa học Máy tính)',
        description: 'Nền tảng vững chắc về khoa học máy tính kết hợp với lý thuyết bảo mật chuyên sâu.',
        tradeoffs: 'Kiến thức bài bản và cơ hội thực tập, nhưng cần kết hợp thi chứng chỉ.'
      }
    ],
    beginnerProjects: ['Thiết lập máy ảo phân tích mã độc', 'Tạo tường lửa cơ bản trên Linux', 'Thực hành khai thác và vá lỗi trên môi trường giả lập'],
    workStyle: 'Cảnh giác, phân tích chi tiết, có kỷ luật và xử lý tình huống nhanh nhạy',
    challenges: ['Tin tặc luôn phát triển các kỹ thuật mới', 'Áp lực cao khi xảy ra sự cố', 'Đòi hỏi sự tỉnh táo liên tục'],
    advantages: ['Nhu cầu nhân lực luôn vượt cung', 'Mức thu nhập cực kỳ hấp dẫn', 'Bảo đảm an toàn cho xã hội và doanh nghiệp'],
    futureTrends: 'Ứng dụng AI trong phát hiện mối đe dọa; bảo mật cho IoT và hệ thống điều khiển công nghiệp ngày càng quan trọng.',
    salaryInfo: {
      rangeDescription: 'Nhu cầu cao trên toàn cầu với sự thiếu hụt nhân tài liên tục trong doanh nghiệp và chính phủ.',
      disclaimer: 'Thông tin mang tính tham khảo - cần xác minh với các nguồn dữ liệu lao động địa phương.',
      levelIndicator: 'Rất Cao'
    }
  },
  'robotics-engineer': {
    description: 'Thiết kế, chế tạo, kiểm tra và bảo trì các hệ thống robot, thiết bị cơ điện tử và phần mềm tự động hóa để thực hiện các nhiệm vụ phức tạp.',
    tasks: [
      'Thiết kế cơ cấu cơ khí và hệ thống truyền động cho robot',
      'Phát triển thuật toán điều khiển và lập trình vi điều khiển',
      'Tích hợp cảm biến, thị giác máy tính và trí tuệ nhân tạo',
      'Kiểm thử và gỡ lỗi trên các nguyên mẫu phần cứng',
      'Tối ưu hóa khả năng vận hành và độ chính xác của robot'
    ],
    responsibilities: [
      'Đảm bảo robot hoạt động an toàn và hiệu quả',
      'Nâng cao khả năng tự chủ của hệ thống',
      'Tuân thủ các tiêu chuẩn công nghiệp và an toàn'
    ],
    workEnvironment: ['Phòng thí nghiệm nghiên cứu & phát triển (R&D)', 'Nhà máy sản xuất', 'Môi trường làm việc đa ngành', 'Kết hợp làm việc trên máy tính và xưởng cơ khí'],
    requiredSkills: ['Cơ học & Động lực học', 'Lập trình (C/C++, Python)', 'Điện tử & Vi điều khiển', 'Toán học Ứng dụng'],
    recommendedSkills: ['Hệ điều hành ROS (Robot Operating System)', 'Thị giác máy tính (Computer Vision)', 'CAD/CAM', 'Kỹ thuật Điều khiển'],
    softSkills: ['Tư duy hệ thống', 'Làm việc nhóm đa ngành', 'Kiên nhẫn', 'Sáng tạo'],
    relevantSubjects: ['Vật lý', 'Toán học', 'Tin học', 'Công nghệ', 'Cơ khí'],
    relevantInterests: ['Lắp ráp máy móc', 'Lập trình điều khiển', 'Sáng chế', 'Công nghệ tương lai'],
    educationPaths: [
      {
        type: 'Đại học',
        duration: '4-5 Năm (Cử nhân Cơ điện tử hoặc Kỹ thuật Robot)',
        description: 'Chương trình học kết hợp giữa Cơ khí, Điện - Điện tử và Khoa học Máy tính.',
        tradeoffs: 'Chương trình nặng và đòi hỏi nỗ lực cao, nhưng cơ hội việc làm rộng mở.'
      }
    ],
    beginnerProjects: ['Lắp ráp và lập trình robot tránh vật cản', 'Thiết kế cánh tay robot gắp vật 3 trục', 'Viết chương trình xử lý ảnh để nhận diện màu sắc'],
    workStyle: 'Đòi hỏi tư duy không gian tốt, kiên nhẫn khi xử lý các vấn đề giao thoa giữa phần cứng và phần mềm',
    challenges: ['Tích hợp nhiều lĩnh vực kỹ thuật phức tạp', 'Chi phí thử nghiệm phần cứng cao', 'Đòi hỏi độ chính xác tuyệt đối'],
    advantages: ['Tiên phong trong các công nghệ định hình tương lai', 'Công việc luôn thay đổi và không nhàm chán', 'Mức lương cao trong ngành phần cứng'],
    futureTrends: 'Sự bùng nổ của robot hợp tác (cobots), xe tự hành và ứng dụng AI để tạo ra các hệ thống có khả năng tự học.',
    salaryInfo: {
      rangeDescription: 'Mức lương khởi điểm cao do sự hiếm hoi của nhân sự có khả năng kết hợp đa ngành (Cơ-Điện-Phần mềm).',
      disclaimer: 'Mang tính chất tham khảo, có sự chênh lệch lớn giữa các trung tâm công nghệ.',
      levelIndicator: 'Rất Cao'
    }
  },
  'semiconductor-hardware-engineer': {
    description: 'Nghiên cứu, thiết kế, phát triển và kiểm tra các linh kiện điện tử, chip vi xử lý, và bảng mạch tích hợp (IC) dùng trong mọi thiết bị số.',
    tasks: [
      'Thiết kế sơ đồ mạch logic cho các chip vi xử lý (VLSI)',
      'Sử dụng phần mềm CAD để mô phỏng và kiểm tra mạch điện',
      'Lập trình mô tả phần cứng (Verilog/VHDL)',
      'Phân tích hiệu năng, công suất và giới hạn nhiệt của linh kiện',
      'Làm việc với các nhà máy đúc chip (Foundry) để sản xuất nguyên mẫu'
    ],
    responsibilities: [
      'Tối ưu hóa tỷ lệ hiệu năng / năng lượng (PPA) của vi mạch',
      'Đảm bảo tính toàn vẹn tín hiệu trên các bảng mạch tốc độ cao',
      'Xử lý lỗi và cải tiến quy trình thiết kế phần cứng'
    ],
    workEnvironment: ['Phòng sạch công nghệ cao', 'Văn phòng R&D tĩnh lặng', 'Làm việc với thiết bị đo lường đắt tiền', 'Đòi hỏi sự tập trung cực độ'],
    requiredSkills: ['Kỹ thuật Điện tử', 'Thiết kế VLSI/IC', 'Lập trình Mô tả Phần cứng (Verilog)', 'Vật lý Bán dẫn'],
    recommendedSkills: ['Kiến trúc Máy tính', 'Kỹ thuật Vi sóng', 'Tự động hóa thiết kế điện tử (EDA)', 'C/C++'],
    softSkills: ['Tư duy phân tích cực kỳ tỉ mỉ', 'Khả năng tập trung dài hạn', 'Giải quyết vấn đề', 'Tính kiên trì'],
    relevantSubjects: ['Vật lý', 'Toán học', 'Tin học', 'Hóa học'],
    relevantInterests: ['Mạch điện tử', 'Vật lý vi mô', 'Máy tính & Phần cứng', 'Thiết bị điện tử'],
    educationPaths: [
      {
        type: 'Đại học / Sau đại học',
        duration: '4-6 Năm (Cử nhân/Thạc sĩ Kỹ thuật Điện - Điện tử hoặc Vi mạch)',
        description: 'Tập trung chuyên sâu vào vật lý bán dẫn, thiết kế mạch tích hợp và kiến trúc vi xử lý.',
        tradeoffs: 'Chuyên ngành rất sâu và hẹp, đòi hỏi nỗ lực học thuật cực lớn, nhưng thị trường luôn khát nhân lực.'
      }
    ],
    beginnerProjects: ['Thiết kế mạch logic số bằng các cổng AND/OR cơ bản', 'Viết mã Verilog mô phỏng hoạt động của một bộ nhớ', 'Thiết kế và in một bảng mạch in (PCB) đơn giản'],
    workStyle: 'Cực kỳ tỉ mỉ, chi tiết, tập trung vào sự hoàn hảo do chi phí sửa sai phần cứng rất đắt đỏ',
    challenges: ['Quy trình thiết kế tốn nhiều năm', 'Chi phí sản xuất lỗi là khổng lồ', 'Công nghệ liên tục thu nhỏ tới giới hạn vật lý'],
    advantages: ['Là ngành công nghiệp xương sống của toàn cầu', 'Chế độ đãi ngộ xuất sắc', 'Ít bị cạnh tranh bởi nhân sự không chính quy'],
    futureTrends: 'Phát triển chip chuyên biệt cho AI (NPU), vật liệu bán dẫn mới (Silicon Carbide), và bao bì tiên tiến (Chiplet).',
    salaryInfo: {
      rangeDescription: 'Thường nằm trong nhóm có mức thu nhập cao nhất của ngành kỹ thuật phần cứng.',
      disclaimer: 'Thay đổi tùy theo quy mô của tập đoàn công nghệ (Intel, TSMC, Nvidia, v.v.).',
      levelIndicator: 'Rất Cao'
    }
  }
};

for (const career of CAREER_DATABASE) {
  if (translations[career.id]) {
    const data = translations[career.id];
    // Merge data
    Object.assign(career, data);
  }
}

const output = `import { Career } from '../types';\n\nexport const CAREER_DATABASE: Career[] = ${JSON.stringify(CAREER_DATABASE, null, 2)};\n`;
fs.writeFileSync('./src/data/careers.ts', output, 'utf8');
console.log('Fixed 4 key careers!');
