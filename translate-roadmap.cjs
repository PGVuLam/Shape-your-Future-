const fs = require('fs');

const p = 'src/engine/roadmapEngine.ts';
let content = fs.readFileSync(p, 'utf8');

// Replacements
content = content.replace(/Elementary School Foundations \(Ages 6–10\)/g, 'Nền tảng Tiểu học (6–10 Tuổi)');
content = content.replace(/Focusing on play, curiosity, and hands-on fun to plant the seeds for future passions./g, 'Tập trung vào vui chơi, khám phá và thực hành để ươm mầm đam mê tương lai.');
content = content.replace(/Middle School Exploration \(Ages 11–14\)/g, 'Khám phá THCS (11–14 Tuổi)');
content = content.replace(/Building foundational strengths, exploring hobby clubs, and trying micro-projects to uncover personal passions./g, 'Xây dựng thế mạnh nền tảng, tham gia câu lạc bộ sở thích và thử sức với các dự án nhỏ để khám phá đam mê.');
content = content.replace(/High School & Pre-University \(Ages 15–18\)/g, 'THPT & Tiền Đại học (15–18 Tuổi)');
content = content.replace(/Intensive academic preparation, building an impressive portfolio, and aiming for advanced coursework or internships./g, 'Chuẩn bị học thuật chuyên sâu, xây dựng hồ sơ năng lực ấn tượng và nhắm tới các khóa học nâng cao hoặc thực tập.');
content = content.replace(/University & College \(Ages 19–22\)/g, 'Đại học & Cao đẳng (19–22 Tuổi)');
content = content.replace(/Gaining practical mastery, securing impactful internships, and transitioning into full professional readiness./g, 'Đạt được sự thành thạo thực tế, đảm bảo các kỳ thực tập chất lượng và chuẩn bị sẵn sàng cho môi trường chuyên nghiệp.');
content = content.replace(/Adult & Career Transition \(Ages 23\+\)/g, 'Người trưởng thành & Chuyển đổi nghề (23+ Tuổi)');
content = content.replace(/Leveraging existing transferable skills and focusing on high-speed reskilling to make an efficient pivot./g, 'Tận dụng các kỹ năng chuyển đổi hiện có và tập trung vào việc tái đào tạo tốc độ cao để chuyển hướng hiệu quả.');

content = content.replace(/Phase 0: Play & Curiosity/g, 'Giai đoạn 0: Vui chơi & Tò mò');
content = content.replace(/Phase 1: Junior Maker & Discoverer/g, 'Giai đoạn 1: Nhà sáng chế & Khám phá nhí');
content = content.replace(/Phase 2: Fun Challenge Quests/g, 'Giai đoạn 2: Thử thách Vui nhộn');

content = content.replace(/Phase 0: Exploration & First Taste/g, 'Giai đoạn 0: Khám phá & Trải nghiệm đầu tiên');
content = content.replace(/Phase 1: Core Fundamentals & Tools/g, 'Giai đoạn 1: Kiến thức cốt lõi & Công cụ');
content = content.replace(/Phase 2: Competitions & Team Collaborations/g, 'Giai đoạn 2: Các cuộc thi & Làm việc nhóm');

content = content.replace(/Phase 0: Reality Check & Micro-Experimentation/g, 'Giai đoạn 0: Đánh giá thực tế & Thử nghiệm nhỏ');
content = content.replace(/Phase 1: Academic & Foundational Mastery/g, 'Giai đoạn 1: Nắm vững học thuật & Nền tảng');
content = content.replace(/Phase 2: Substantive Portfolio & Competitions/g, 'Giai đoạn 2: Hồ sơ năng lực thực tế & Cuộc thi');
content = content.replace(/Phase 3: Pathway & Admissions Preparation/g, 'Giai đoạn 3: Lộ trình & Chuẩn bị tuyển sinh');

content = content.replace(/Phase 0: Professional Gap Diagnostic/g, 'Giai đoạn 0: Chẩn đoán Lỗ hổng chuyên môn');
content = content.replace(/Phase 1: Production-Grade Project Sprint/g, 'Giai đoạn 1: Dự án Cấp độ Thực tế (Sprint)');
content = content.replace(/Phase 2: Internship & Interview Readiness/g, 'Giai đoạn 2: Thực tập & Sẵn sàng Phỏng vấn');

content = content.replace(/Phase 0: Transferable Skills & Feasibility Audit/g, 'Giai đoạn 0: Kỹ năng Chuyển đổi & Đánh giá Khả thi');
content = content.replace(/Phase 1: Targeted High-Leverage Reskilling/g, 'Giai đoạn 1: Tái đào tạo Nhắm mục tiêu Hiệu quả cao');
content = content.replace(/Phase 2: Hybrid Portfolio & Strategic Networking/g, 'Giai đoạn 2: Hồ sơ Kết hợp & Kết nối Chiến lược');

// Other English phrases inside roadmapEngine.ts
content = content.replace(/weeks/g, 'tuần');
content = content.replace(/months/g, 'tháng');
content = content.replace(/1-2 Weeks/g, '1-2 Tuần');
content = content.replace(/1-2 Tuần/g, '1-2 Tuần');
content = content.replace(/2-4 Weeks/g, '2-4 Tuần');
content = content.replace(/2-3 Tuần/g, '2-3 Tuần');
content = content.replace(/2-3 Months/g, '2-3 Tháng');
content = content.replace(/2-3 Tháng/g, '2-3 Tháng');
content = content.replace(/3-4 Months/g, '3-4 Tháng');
content = content.replace(/3-4 Tháng/g, '3-4 Tháng');
content = content.replace(/3-6 Months/g, '3-6 Tháng');
content = content.replace(/3-6 Tháng/g, '3-6 Tháng');

content = content.replace(/Build a dream machine out of cardboard and recycled boxes/g, 'Chế tạo cỗ máy mơ ước từ bìa cứng và hộp tái chế');
content = content.replace(/Draw an illustrated comic book about a day in this career/g, 'Vẽ truyện tranh về một ngày làm việc trong nghề này');
content = content.replace(/Create a mini interactive Scratch animation or game/g, 'Tạo một trò chơi hoặc hoạt hình Scratch tương tác nhỏ');
content = content.replace(/Conduct 3 simple home science experiments/g, 'Thực hiện 3 thí nghiệm khoa học đơn giản tại nhà');
content = content.replace(/Build a cardboard marble run with 3 ramps and a loop/g, 'Làm đường đua bi lăn bằng bìa cứng với 3 dốc và 1 vòng lặp');
content = content.replace(/Grow a mini indoor garden and record daily leaf heights/g, 'Trồng một khu vườn mini trong nhà và ghi lại chiều cao lá hàng ngày');
content = content.replace(/Introductory Hands-on Mini Project/g, 'Dự án mini thực hành nhập môn');
content = content.replace(/A community science fair entry or game jam submission/g, 'Sản phẩm dự thi hội chợ khoa học hoặc Game Jam');
content = content.replace(/Complete two standalone guided projects with documented GitHub\/Behance repositories./g, 'Hoàn thành hai dự án có hướng dẫn với kho lưu trữ GitHub/Behance được tài liệu hóa.');
content = content.replace(/Original community capstone project/g, 'Dự án tốt nghiệp (capstone) cộng đồng độc đáo');
content = content.replace(/Consolidated personal digital portfolio showcasing complete progression/g, 'Hồ sơ năng lực kỹ thuật số cá nhân thể hiện toàn bộ quá trình phát triển');
content = content.replace(/Refactor an existing college project into production code standards/g, 'Cấu trúc lại một dự án đại học theo tiêu chuẩn mã nguồn thực tế');
content = content.replace(/Curated 1-page resume \+ polished LinkedIn profile \+ live portfolio site/g, 'Sơ yếu lý lịch 1 trang \+ hồ sơ LinkedIn trau chuốt \+ trang portfolio trực tuyến');
content = content.replace(/A 1-page Career Transition Strategy Brief/g, 'Bản Tóm tắt Chiến lược Chuyển đổi Nghề nghiệp (1 trang)');
content = content.replace(/Applied real-world workflow automation/g, 'Ứng dụng tự động hóa quy trình làm việc thực tế');
content = content.replace(/Comprehensive business\/tech bridge case study/g, 'Nghiên cứu tình huống toàn diện về cầu nối kinh doanh/công nghệ');
content = content.replace(/Decide if you want to invest 3 months of hobby time into building skills here./g, 'Quyết định xem bạn có muốn đầu tư 3 tháng thời gian rảnh rỗi để xây dựng kỹ năng trong lĩnh vực này hay không.');

fs.writeFileSync(p, content, 'utf8');
console.log('roadmap translated');
