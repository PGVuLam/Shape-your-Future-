export interface UniversityInfo {
  id: string;
  name: string;
  shortName: string;
  location: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  tier: 'Top 1' | 'Top 2' | 'Chuyên ngành' | 'Cao đẳng nghề';
  category: 'Kỹ thuật - Công nghệ' | 'Kinh tế - Quản lý' | 'Y Dược' | 'Sư phạm' | 'Khoa học Xã hội' | 'Đa ngành' | 'Nghề thực hành';
  website: string;
  benchmarkScoreTHPT: string; // e.g. "25.5 - 28.5" or "Xét học bạ / Tốt nghiệp THPT"
  benchmarkHSA?: string; // HSA ĐHQG HN
  benchmarkVACT?: string; // V-ACT ĐHQG HCM
  benchmarkTSA?: string; // TSA Bách Khoa
  prominentMajors: string[];
  description: string;
  isVocational?: boolean;
}

export const VIETNAM_UNIVERSITIES: UniversityInfo[] = [
  // Top 1 Kỹ thuật & Công nghệ
  {
    id: 'hust',
    name: 'Đại học Bách Khoa Hà Nội',
    shortName: 'HUST',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Top 1',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://hust.edu.vn',
    benchmarkScoreTHPT: '25.0 - 29.4',
    benchmarkTSA: '60 - 83 / 100',
    prominentMajors: ['Khoa học máy tính', 'Kỹ thuật điều khiển & Tự động hóa', 'Trí tuệ nhân tạo', 'Cơ điện tử', 'Kỹ thuật Vi điện tử & Bán dẫn'],
    description: 'Trường đại học kỹ thuật công nghệ trọng điểm hàng đầu Việt Nam, đi đầu về đào tạo kỹ sư và nghiên cứu chuyên sâu.'
  },
  {
    id: 'uet-vnu',
    name: 'Đại học Công nghệ - ĐHQG Hà Nội',
    shortName: 'UET - VNU',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Top 1',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://uet.vnu.edu.vn',
    benchmarkScoreTHPT: '25.5 - 28.5',
    benchmarkHSA: '90 - 115 / 150',
    prominentMajors: ['Công nghệ thông tin', 'Khoa học máy tính', 'Kỹ thuật Robot', 'Hàng không vũ trụ', 'Mạng máy tính'],
    description: 'Thành viên nòng cốt của ĐHQG Hà Nội, thế mạnh vượt trội về Khoa học máy tính và Công nghệ cao.'
  },
  {
    id: 'bk-vnuhcm',
    name: 'Đại học Bách Khoa - ĐHQG TP.HCM',
    shortName: 'HCMUT - VNUHCM',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Top 1',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://hcmut.edu.vn',
    benchmarkScoreTHPT: '24.5 - 28.0',
    benchmarkVACT: '820 - 990 / 1200',
    prominentMajors: ['Khoa học máy tính', 'Kỹ thuật Cơ khí', 'Kỹ thuật Hóa học', 'Logistics', 'Kỹ thuật Điện - Điện tử'],
    description: 'Trung tâm đào tạo kỹ thuật danh tiếng bậc nhất miền Nam với chuẩn kiểm định quốc tế ABET.'
  },
  {
    id: 'uit-vnuhcm',
    name: 'Đại học Công nghệ Thông tin - ĐHQG TP.HCM',
    shortName: 'UIT - VNUHCM',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Top 1',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://uit.edu.vn',
    benchmarkScoreTHPT: '25.5 - 28.2',
    benchmarkVACT: '800 - 960 / 1200',
    prominentMajors: ['Khoa học dữ liệu', 'Trí tuệ nhân tạo', 'An toàn thông tin', 'Kỹ thuật phần mềm', 'Thiết kế vi mạch'],
    description: 'Đơn vị chuyên sâu số 1 miền Nam về công nghệ thông tin, vi mạch và trí tuệ nhân tạo.'
  },

  // Top 1 Kinh tế & Quản trị
  {
    id: 'ftu',
    name: 'Đại học Ngoại Thương',
    shortName: 'FTU',
    location: 'Hà Nội / TP.HCM',
    region: 'Bắc',
    tier: 'Top 1',
    category: 'Kinh tế - Quản lý',
    website: 'https://ftu.edu.vn',
    benchmarkScoreTHPT: '27.0 - 28.5',
    benchmarkHSA: '95 - 120 / 150',
    prominentMajors: ['Kinh tế đối ngoại', 'Tài chính quốc tế', 'Quản trị kinh doanh quốc tế', 'Logistics & Chuỗi cung ứng'],
    description: 'Biểu tượng đào tạo nhân lực kinh tế đối ngoại năng động, chuẩn quốc tế và khả năng hội nhập cao.'
  },
  {
    id: 'neu',
    name: 'Đại học Kinh tế Quốc dân',
    shortName: 'NEU',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Top 1',
    category: 'Kinh tế - Quản lý',
    website: 'https://neu.edu.vn',
    benchmarkScoreTHPT: '26.0 - 28.3',
    benchmarkHSA: '92 - 116 / 150',
    prominentMajors: ['Kinh doanh quốc tế', 'Marketing', 'Tài chính - Ngân hàng', 'Kiểm toán', 'Khoa học dữ liệu trong kinh tế'],
    description: 'Trường đại học đầu ngành về kinh tế, quản lý và quản trị kinh doanh tại miền Bắc.'
  },
  {
    id: 'ueh',
    name: 'Đại học Kinh tế TP. Hồ Chí Minh',
    shortName: 'UEH',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Top 1',
    category: 'Kinh tế - Quản lý',
    website: 'https://ueh.edu.vn',
    benchmarkScoreTHPT: '24.5 - 27.5',
    benchmarkVACT: '780 - 930 / 1200',
    prominentMajors: ['Kinh doanh quốc tế', 'Tài chính công nghệ (Fintech)', 'Quản trị chuỗi cung ứng', 'Digital Marketing'],
    description: 'Đại học đa ngành định hướng nghiên cứu và đào tạo kinh tế - công nghệ bền vững hàng đầu phía Nam.'
  },

  // Top Sư phạm & Y Dược
  {
    id: 'hnue',
    name: 'Đại học Sư phạm Hà Nội',
    shortName: 'HNUE',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Top 1',
    category: 'Sư phạm',
    website: 'https://hnue.edu.vn',
    benchmarkScoreTHPT: '24.0 - 28.5',
    prominentMajors: ['Sư phạm Toán', 'Sư phạm Tiếng Anh', 'Sư phạm Tin học', 'Tâm lý học giáo dục', 'Giáo dục mầm non'],
    description: 'Trường cái nôi của ngành giáo dục Việt Nam, trung tâm đào tạo giáo viên và chuyên gia giáo dục hàng đầu.'
  },
  {
    id: 'hmu',
    name: 'Đại học Y Hà Nội',
    shortName: 'HMU',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Top 1',
    category: 'Y Dược',
    website: 'https://hmu.edu.vn',
    benchmarkScoreTHPT: '25.0 - 28.8',
    prominentMajors: ['Y đa khoa', 'Răng - Hàm - Mặt', 'Dược học', 'Y học cổ truyền', 'Điều dưỡng'],
    description: 'Trường đại học y khoa lâu đời và danh giá nhất Việt Nam, quy tụ các chuyên gia y tế đầu ngành.'
  },
  {
    id: 'ump',
    name: 'Đại học Y Dược TP. Hồ Chí Minh',
    shortName: 'UMP',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Top 1',
    category: 'Y Dược',
    website: 'https://ump.edu.vn',
    benchmarkScoreTHPT: '24.5 - 28.5',
    prominentMajors: ['Y khoa', 'Dược học', 'Kỹ thuật xét nghiệm y học', 'Y học dự phòng'],
    description: 'Trung tâm đào tạo y dược trọng điểm phía Nam với chất lượng thực hành lâm sàng uy tín.'
  },

  // Top 2 & Chuyên sâu (Lựa chọn thực tế, phù hợp nhiều mức điểm)
  {
    id: 'ptit',
    name: 'Học viện Công nghệ Bưu chính Viễn thông',
    shortName: 'PTIT',
    location: 'Hà Nội / TP.HCM',
    region: 'Bắc',
    tier: 'Top 2',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://ptit.edu.vn',
    benchmarkScoreTHPT: '23.5 - 26.5',
    benchmarkHSA: '85 - 105 / 150',
    prominentMajors: ['Công nghệ thông tin', 'An toàn thông tin', 'Công nghệ đa phương tiện', 'Thương mại điện tử'],
    description: 'Đơn vị đào tạo công nghệ viễn thông và CNTT ứng dụng xuất sắc với tỉ lệ việc làm cao.'
  },
  {
    id: 'ute-hcm',
    name: 'Đại học Sư phạm Kỹ thuật TP.HCM',
    shortName: 'HCMUTE',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Top 2',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://hcmute.edu.vn',
    benchmarkScoreTHPT: '23.0 - 26.8',
    benchmarkVACT: '750 - 900 / 1200',
    prominentMajors: ['Kỹ thuật Cơ điện tử', 'Kỹ thuật Ô tô', 'Tự động hóa', 'Công nghệ thông tin', 'Thiết kế thời trang'],
    description: 'Thế mạnh đào tạo kỹ sư thực hành chất lượng cao, trang thiết bị phòng lab hiện đại liên kết doanh nghiệp.'
  },
  {
    id: 'fpt',
    name: 'Đại học FPT',
    shortName: 'FPTU',
    location: 'Hà Nội / TP.HCM / Đà Nẵng / Cần Thơ / Quy Nhơn',
    region: 'Bắc',
    tier: 'Top 2',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://fpt.edu.vn',
    benchmarkScoreTHPT: '21.0 - 24.0',
    prominentMajors: ['Kỹ thuật phần mềm', 'Trí tuệ nhân tạo', 'Thiết kế đồ họa số', 'Truyền thông đa phương tiện'],
    description: 'Trường đại học gắn liền với doanh nghiệp công nghệ, đào tạo 100% giáo trình tiếng Anh và OJT doanh nghiệp.'
  },
  {
    id: 'ctu',
    name: 'Đại học Cần Thơ',
    shortName: 'CTU',
    location: 'Cần Thơ',
    region: 'Nam',
    tier: 'Top 2',
    category: 'Đa ngành',
    website: 'https://ctu.edu.vn',
    benchmarkScoreTHPT: '20.0 - 25.5',
    benchmarkVACT: '700 - 850 / 1200',
    prominentMajors: ['Công nghệ thông tin', 'Nông nghiệp công nghệ cao', 'Tự động hóa', 'Sư phạm Toán', 'Kinh tế nông nghiệp'],
    description: 'Trường đại học đa ngành trọng điểm quốc gia lớn nhất vùng Đồng bằng sông Cửu Long.'
  },
  {
    id: 'dut',
    name: 'Đại học Bách Khoa - Đại học Đà Nẵng',
    shortName: 'DUT',
    location: 'Đà Nẵng',
    region: 'Trung',
    tier: 'Top 2',
    category: 'Kỹ thuật - Công nghệ',
    website: 'https://dut.udn.vn',
    benchmarkScoreTHPT: '22.0 - 26.5',
    prominentMajors: ['Công nghệ thông tin', 'Kỹ thuật Điện', 'Xây dựng cầu đường', 'Kỹ thuật điều khiển'],
    description: 'Trường đại học kỹ thuật trọng điểm hàng đầu miền Trung - Tây Nguyên.'
  },

  // Nhóm Trường Cao đẳng & Học nghề thực hành chất lượng cao (Đại học không phải là con đường duy nhất)
  {
    id: 'caothang',
    name: 'Trường Cao đẳng Kỹ thuật Cao Thắng',
    shortName: 'Cao Thắng (CKC)',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Cao đẳng nghề',
    category: 'Nghề thực hành',
    website: 'https://caothang.edu.vn',
    benchmarkScoreTHPT: 'Xét học bạ THPT / Tốt nghiệp',
    prominentMajors: ['Công nghệ Kỹ thuật Ô tô', 'Kỹ thuật Cơ điện tử', 'Kỹ thuật Điện - Điện tử', 'Công nghệ Thông tin', 'Kỹ thuật Nhiệt (Điện lạnh)'],
    description: 'Trường cao đẳng kỹ thuật danh tiếng hơn 115 năm lịch sử tại TP.HCM; 70% thời lượng thực hành xưởng máy, sinh viên ra trường được doanh nghiệp săn đón ngay.',
    isVocational: true
  },
  {
    id: 'fpt-poly',
    name: 'Trường Cao đẳng FPT Polytechnic',
    shortName: 'FPT Poly',
    location: 'Hà Nội / TP.HCM / Đà Nẵng / Cần Thơ / Tây Nguyên',
    region: 'Bắc',
    tier: 'Cao đẳng nghề',
    category: 'Nghề thực hành',
    website: 'https://caodang.fpt.edu.vn',
    benchmarkScoreTHPT: 'Xét tuyển tốt nghiệp THPT',
    prominentMajors: ['Lập trình Web/Mobile', 'Ứng dụng Phần mềm', 'Thiết kế Đồ họa', 'Digital Marketing', 'Logistics'],
    description: 'Triết lý "Thực học - Thực nghiệp", đào tạo 2 năm (6 học kỳ) tập trung dự án doanh nghiệp thực tế, cam kết cơ hội việc làm và làm việc sớm.',
    isVocational: true
  },
  {
    id: 'bk-hanoi-voc',
    name: 'Trường Cao đẳng Nghề Bách Khoa Hà Nội',
    shortName: 'HACTECH',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Cao đẳng nghề',
    category: 'Nghề thực hành',
    website: 'https://hactech.edu.vn',
    benchmarkScoreTHPT: 'Xét học bạ lớp 12',
    prominentMajors: ['Cơ điện tử', 'Kỹ thuật Cơ khí', 'Công nghệ Kỹ thuật Máy tính', 'Điện tử viễn thông', 'Công nghệ Ô tô'],
    description: 'Trực thuộc hệ sinh thái Bách Khoa Hà Nội, đào tạo kỹ thuật viên tay nghề cao làm việc tại các tập đoàn cơ điện tử, tự động hóa hàng đầu.',
    isVocational: true
  },
  {
    id: 'tdc-thuduc',
    name: 'Trường Cao đẳng Công nghệ Thủ Đức',
    shortName: 'TDC',
    location: 'TP. Hồ Chí Minh',
    region: 'Nam',
    tier: 'Cao đẳng nghề',
    category: 'Nghề thực hành',
    website: 'https://tdc.edu.vn',
    benchmarkScoreTHPT: 'Xét tốt nghiệp THPT',
    prominentMajors: ['Công nghệ Thông tin', 'Quản trị Khách sạn - Nhà hàng', 'Logistics', 'Tự động hóa', 'Tiếng Nhật thương mại'],
    description: 'Cơ sở đào tạo thực hành quy mô lớn tại TP. Thủ Đức, liên kết chặt chẽ với các khu công nghệ cao và doanh nghiệp Nhật Bản.',
    isVocational: true
  },
  {
    id: 'hht-voc',
    name: 'Trường Cao đẳng Nghề Công nghệ Cao Hà Nội',
    shortName: 'HHT',
    location: 'Hà Nội',
    region: 'Bắc',
    tier: 'Cao đẳng nghề',
    category: 'Nghề thực hành',
    website: 'https://hht.edu.vn',
    benchmarkScoreTHPT: 'Xét học bạ THPT',
    prominentMajors: ['Cơ khí chính xác CNC', 'Hàn công nghệ cao', 'Tự động hóa công nghiệp', 'Thiết kế đồ họa', 'Chăm sóc sắc đẹp & Dược'],
    description: 'Trường nghề công lập kiểu mẫu chất lượng cao đạt chuẩn kiểm định quốc tế, sở hữu nhiều huy chương kỹ năng nghề quốc gia và ASEAN.',
    isVocational: true
  }
];
