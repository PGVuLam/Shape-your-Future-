const fs = require('fs');
const content = `export interface ProvinceItem {
  id: string;
  name: string;
  region: 'Bắc' | 'Trung' | 'Nam';
}

export const VIETNAM_PROVINCES: ProvinceItem[] = [
  // 6 Thành phố trực thuộc Trung ương
  { id: 'ha-noi', name: 'Hà Nội', region: 'Bắc' },
  { id: 'hai-phong', name: 'Hải Phòng', region: 'Bắc' },
  { id: 'tp-ho-chi-minh', name: 'Thành phố Hồ Chí Minh', region: 'Nam' },
  { id: 'da-nang', name: 'Đà Nẵng', region: 'Trung' },
  { id: 'can-tho', name: 'Cần Thơ', region: 'Nam' },
  { id: 'hue', name: 'Huế', region: 'Trung' },
  // 28 Tỉnh
  { id: 'an-giang', name: 'An Giang', region: 'Nam' },
  { id: 'bac-ninh', name: 'Bắc Ninh', region: 'Bắc' },
  { id: 'binh-dinh', name: 'Bình Định', region: 'Trung' },
  { id: 'cao-bang', name: 'Cao Bằng', region: 'Bắc' },
  { id: 'ca-mau', name: 'Cà Mau', region: 'Nam' },
  { id: 'dak-lak', name: 'Đắk Lắk', region: 'Trung' },
  { id: 'dien-bien', name: 'Điện Biên', region: 'Bắc' },
  { id: 'dong-nai', name: 'Đồng Nai', region: 'Nam' },
  { id: 'dong-thap', name: 'Đồng Tháp', region: 'Nam' },
  { id: 'gia-lai', name: 'Gia Lai', region: 'Trung' },
  { id: 'ha-tinh', name: 'Hà Tĩnh', region: 'Trung' },
  { id: 'hung-yen', name: 'Hưng Yên', region: 'Bắc' },
  { id: 'khanh-hoa', name: 'Khánh Hòa', region: 'Trung' },
  { id: 'kon-tum', name: 'Kon Tum', region: 'Trung' },
  { id: 'lai-chau', name: 'Lai Châu', region: 'Bắc' },
  { id: 'lam-dong', name: 'Lâm Đồng', region: 'Trung' },
  { id: 'lang-son', name: 'Lạng Sơn', region: 'Bắc' },
  { id: 'lao-cai', name: 'Lào Cai', region: 'Bắc' },
  { id: 'nghe-an', name: 'Nghệ An', region: 'Trung' },
  { id: 'ninh-binh', name: 'Ninh Bình', region: 'Bắc' },
  { id: 'phu-tho', name: 'Phú Thọ', region: 'Bắc' },
  { id: 'quang-nam', name: 'Quảng Nam', region: 'Trung' },
  { id: 'quang-ngai', name: 'Quảng Ngãi', region: 'Trung' },
  { id: 'quang-ninh', name: 'Quảng Ninh', region: 'Bắc' },
  { id: 'quang-tri', name: 'Quảng Trị', region: 'Trung' },
  { id: 'son-la', name: 'Sơn La', region: 'Bắc' },
  { id: 'tay-ninh', name: 'Tây Ninh', region: 'Nam' },
  { id: 'thanh-hoa', name: 'Thanh Hóa', region: 'Trung' }
];
`;
fs.writeFileSync('src/data/vietnamProvinces.ts', content);
