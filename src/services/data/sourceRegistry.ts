import { DataSource } from './types';

/**
 * Authoritative official sources for Vietnamese University Admissions & Career Intelligence.
 * Ranked strictly by hierarchy:
 * 1. Ministry of Education & Training (MOET)
 * 2. Official University Admission Portals
 * 3. Government Labor Statistics & Vocational Agencies
 * 4. Reputable National Press (Secondary check only)
 */
export const DEFAULT_DATA_SOURCES: DataSource[] = [
  {
    id: 'moet-portal',
    name: 'Cổng Thông tin Tuyển sinh Quốc gia (Bộ GD&ĐT)',
    url: 'https://thisinh.thitotnghiepthpt.edu.vn',
    sourceType: 'MINISTRY_OFFICIAL',
    priority: 1,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'moet-main',
    name: 'Cổng Thông tin Điện tử Bộ GD&ĐT (moet.gov.vn)',
    url: 'https://moet.gov.vn',
    sourceType: 'MINISTRY_OFFICIAL',
    priority: 1,
    targetEntity: 'programs',
    updateFrequencyDays: 14,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'hust-ts',
    name: 'Cổng Tuyển sinh ĐH Bách Khoa Hà Nội (HUST)',
    url: 'https://ts.hust.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'uet-vnu-ts',
    name: 'Tuyển sinh ĐH Công nghệ - ĐHQG Hà Nội (UET)',
    url: 'https://uet.vnu.edu.vn/tuyen-sinh',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'vnu-hn-ts',
    name: 'Cổng Tuyển sinh ĐHQG Hà Nội (VNU Admissions)',
    url: 'https://tuyensinh.vnu.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'hcmut-ts',
    name: 'Cổng Tuyển sinh ĐH Bách Khoa - ĐHQG TP.HCM (HCMUT)',
    url: 'https://tuyensinh.hcmut.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'uit-ts',
    name: 'Cổng Tuyển sinh ĐH Công nghệ Thông tin - ĐHQG TP.HCM (UIT)',
    url: 'https://tuyensinh.uit.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'vnuhcm-ts',
    name: 'Cổng Tuyển sinh & Khảo thí ĐHQG TP.HCM (VNU-HCM)',
    url: 'https://vnuhcm.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'ftu-ts',
    name: 'Cổng Tuyển sinh Đại học Ngoại Thương (FTU)',
    url: 'https://tuyensinh.ftu.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'neu-ts',
    name: 'Cổng Tuyển sinh Đại học Kinh tế Quốc dân (NEU)',
    url: 'https://tuyensinh.neu.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'ueh-ts',
    name: 'Cổng Tuyển sinh Đại học Kinh tế TP.HCM (UEH)',
    url: 'https://tuyensinh.ueh.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'hnue-ts',
    name: 'Cổng Tuyển sinh Đại học Sư phạm Hà Nội (HNUE)',
    url: 'https://hnue.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'hmu-ts',
    name: 'Cổng Thông tin & Tuyển sinh Đại học Y Hà Nội (HMU)',
    url: 'https://hmu.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'ump-ts',
    name: 'Cổng Tuyển sinh ĐH Y Dược TP.HCM (UMP)',
    url: 'https://ump.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'ptit-ts',
    name: 'Cổng Tuyển sinh Học viện CN Bưu chính Viễn thông (PTIT)',
    url: 'https://tuyensinh.ptit.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 7,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'caothang-ts',
    name: 'Trường Cao đẳng Kỹ thuật Cao Thắng (CKC)',
    url: 'https://caothang.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'programs',
    updateFrequencyDays: 30,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'fpt-poly-ts',
    name: 'Trường Cao đẳng FPT Polytechnic',
    url: 'https://caodang.fpt.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'programs',
    updateFrequencyDays: 30,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'hactech-ts',
    name: 'Trường Cao đẳng Nghề Bách Khoa Hà Nội (HACTECH)',
    url: 'https://hactech.edu.vn',
    sourceType: 'UNIVERSITY_OFFICIAL',
    priority: 2,
    targetEntity: 'programs',
    updateFrequencyDays: 30,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'falmi-labor-market',
    name: 'Trung tâm Dự báo Nhu cầu Nhân lực & TT Lao động (FALMI)',
    url: 'https://falmi.org.vn',
    sourceType: 'GOVERNMENT',
    priority: 3,
    targetEntity: 'labor_market',
    updateFrequencyDays: 90,
    enabled: true,
    consecutiveFailures: 0
  },
  {
    id: 'vnexpress-giao-duc',
    name: 'Cổng Tra cứu Điểm chuẩn Đại học Toàn quốc (VnExpress)',
    url: 'https://diemthi.vnexpress.net',
    sourceType: 'TRUSTED_SECONDARY',
    priority: 4,
    targetEntity: 'admission_scores',
    updateFrequencyDays: 14,
    enabled: true,
    consecutiveFailures: 0
  }
];

export class SourceRegistry {
  private sources: Map<string, DataSource> = new Map();

  constructor(initialSources: DataSource[] = DEFAULT_DATA_SOURCES) {
    initialSources.forEach(s => this.sources.set(s.id, { ...s }));
  }

  getAll(): DataSource[] {
    return Array.from(this.sources.values()).sort((a, b) => a.priority - b.priority);
  }

  getById(id: string): DataSource | undefined {
    return this.sources.get(id);
  }

  getByEntity(entity: DataSource['targetEntity']): DataSource[] {
    return this.getAll().filter(s => s.targetEntity === entity && s.enabled);
  }

  register(source: DataSource): void {
    this.sources.set(source.id, { ...source });
  }

  update(id: string, updates: Partial<DataSource>): boolean {
    const existing = this.sources.get(id);
    if (!existing) return false;
    this.sources.set(id, { ...existing, ...updates });
    return true;
  }

  toggleEnabled(id: string, enabled?: boolean): boolean {
    const existing = this.sources.get(id);
    if (!existing) return false;
    existing.enabled = enabled !== undefined ? enabled : !existing.enabled;
    this.sources.set(id, existing);
    return existing.enabled;
  }

  resetToDefaults(): void {
    this.sources.clear();
    DEFAULT_DATA_SOURCES.forEach(s => this.sources.set(s.id, { ...s }));
  }

  exportJson(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  importJson(json: string): void {
    try {
      const list = JSON.parse(json);
      if (Array.isArray(list)) {
        list.forEach(s => {
          if (s.id && s.name && s.url) {
            this.sources.set(s.id, s);
          }
        });
      }
    } catch (e) {
      console.error('Failed to import source registry json', e);
    }
  }
}
