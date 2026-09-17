const fs = require('fs');

let content = fs.readFileSync('src/components/Step1ComprehensiveInfoView.tsx', 'utf-8');

// 1. Update min age
content = content.replace(
  'min="6"\n              max="70"',
  'min="4"\n              max="70"'
);
content = content.replace(
  'min="6" max="70"',
  'min="4" max="70"'
);

// 2. Update getGradeOptions
content = content.replace(
  `case '6-10':\n        return ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];`,
  `case '6-10':\n        return ['Trước lớp 1', 'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];`
);

// 3. Update interestList
const newInterestList = `const interestList = formData.ageGroup === '6-10'
    ? ['Lắp ráp LEGO & Mô hình', 'Vẽ tranh & Sáng tác truyện', 'Khám phá thế giới động vật', 'Trò chơi điện tử trí tuệ', 'Làm thí nghiệm khoa học', 'Bơi lội & Thể thao', 'Ca hát & Biểu diễn', 'Toán học vui', 'Kể chuyện & Đóng kịch', 'Trồng cây & Làm vườn']
    : formData.ageGroup === '11-14'
    ? ['Lập trình Scratch/Python', 'Robotics & Chế tạo', 'Đọc sách khoa học & Lịch sử', 'Vẽ tranh kỹ thuật số', 'Tham gia hoạt động Đội/Nhóm', 'Hùng biện tiếng Anh', 'Chơi nhạc cụ (Piano, Guitar...)', 'Nhiếp ảnh & Quay video', 'Thể thao cạnh tranh (Bóng đá, Cầu lông...)', 'Thiết kế thời trang', 'Sáng tạo nội dung (Tiktok/Youtube)']
    : [
        'Lập trình phần mềm & Thuật toán', 'Trí tuệ nhân tạo (AI)', 'Nghiên cứu khoa học & Tự nhiên',
        'Thiết kế đồ họa & Giao diện UI/UX', 'Kinh doanh & Khởi nghiệp', 'Tài chính & Đầu tư',
        'Giao tiếp, Đàm phán & Thuyết trình', 'Hoạt động xã hội & Tình nguyện', 'Chế tạo máy & Điện tử vi mạch',
        'Y học & Chăm sóc sức khỏe', 'Tâm lý học con người', 'Truyền thông số & Báo chí',
        'Luật & Pháp lý', 'Du lịch & Quản trị khách sạn', 'Ngoại ngữ & Biên phiên dịch', 'Nghệ thuật biểu diễn (Âm nhạc, Điện ảnh)', 'Thể thao thành tích cao & Huấn luyện'
      ];`;

content = content.replace(
  /const interestList = [^;]+;/s,
  newInterestList
);

// 4. Update skillList
const newSkillList = `const skillList = formData.ageGroup === '6-10' || formData.ageGroup === '11-14'
    ? ['Tư duy logic', 'Tự học và tìm tòi', 'Giao tiếp hòa đồng', 'Làm việc nhóm', 'Sáng tạo ý tưởng', 'Sử dụng máy tính', 'Trình bày trôi chảy', 'Quan sát tinh tế', 'Khéo tay hay làm', 'Nhớ lâu & Ghi nhớ nhanh']
    : [
        'Lập trình (Python, C++, Java)', 'Tư duy logic & Toán ứng dụng', 'Giải quyết vấn đề phức tạp',
        'Thuyết trình & Hùng biện', 'Làm việc nhóm & Phối hợp', 'Tiếng Anh giao tiếp & Học thuật',
        'Thiết kế đồ họa / Video', 'Phân tích dữ liệu & Excel', 'Quản lý thời gian & Kế hoạch',
        'Lãnh đạo & Tổ chức sự kiện', 'Sáng tạo & Viết lách (Copywriting)', 'Giao tiếp ngoại ngữ (Trung, Nhật, Hàn...)',
        'Thích nghi nhanh với công nghệ', 'Lắng nghe & Thấu cảm', 'Đàm phán & Xử lý tình huống'
      ];`;

content = content.replace(
  /const skillList = [^;]+;/s,
  newSkillList
);

// 5. Update thptCombos
const newThptCombos = `const thptCombos = [
    'A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'A02 (Toán, Lý, Sinh)', 
    'B00 (Toán, Hóa, Sinh)', 'B08 (Toán, Sinh, Anh)', 
    'C00 (Văn, Sử, Địa)', 'C03 (Toán, Văn, Sử)', 'C19 (Văn, Sử, GDCD)',
    'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)', 'D04 (Toán, Văn, Trung)',
    'H00 (Văn, Vẽ NT, Vẽ TT)', 'V00 (Toán, Lý, Vẽ KT)', 'M00 (Toán, Văn, Đọc kể diễn cảm)',
    'N00 (Văn, Kiến thức Âm nhạc, Năng khiếu Âm nhạc)', 'T00 (Toán, Sinh, Năng khiếu TDTT)'
  ];`;

content = content.replace(
  /const thptCombos = \[.*?\];/s,
  newThptCombos
);

fs.writeFileSync('src/components/Step1ComprehensiveInfoView.tsx', content);
