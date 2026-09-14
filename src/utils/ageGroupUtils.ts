import { AgeGroup, AgeGroupMeta, UserProfile } from '../types';

export const AGE_GROUPS_CONFIG: AgeGroupMeta[] = [
  {
    key: '6-10',
    labelVi: '6 - 10 tuổi (Tiểu học)',
    labelEn: 'Ages 6-10 (Primary School)',
    stageVi: 'Khám phá & Ươm mầm Sở thích',
    descriptionVi: 'Tập trung khơi gợi trí tò mò, khám phá sở thích qua trò chơi tư duy, hoạt động STEM vui nhộn và câu lạc bộ thiếu nhi. Không áp lực thi cử hay chọn ngành sớm.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    key: '11-14',
    labelVi: '11 - 14 tuổi (THCS)',
    labelEn: 'Ages 11-14 (Middle School)',
    stageVi: 'Định hình Thiên hướng & Thi vào Lớp 10',
    descriptionVi: 'Khám phá năng khiếu môn học (tự nhiên vs xã hội), rèn luyện kỹ năng tự học, định hướng thi vào trường THPT phù hợp (chuyên / công lập / định hướng nghề).',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    key: '15-18',
    labelVi: '15 - 18 tuổi (THPT)',
    labelEn: 'Ages 15-18 (High School)',
    stageVi: 'Chọn Ngành ĐH & Chiến lược Thi Tuyển',
    descriptionVi: 'Đối chiếu điểm thi ĐGNL (HSA, TSA, V-ACT) & THPTQG với điểm chuẩn các trường Top 1 & Top 2; xác định tổ hợp xét tuyển, chuẩn bị hồ sơ du học hoặc học bổng.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    key: '19-24',
    labelVi: '19 - 24 tuổi (Sinh viên / Học nghề)',
    labelEn: 'Ages 19-24 (College & Vocational)',
    stageVi: 'Chuyên môn Sâu, Thực tập & Việc làm Khởi điểm',
    descriptionVi: 'Tối ưu hóa chuyên ngành, chứng chỉ nghề nghiệp quốc tế (IELTS, IT, Tài chính), kỹ năng thực tập tại doanh nghiệp, xây dựng CV & Portfolio ứng tuyển.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    key: '25-35',
    labelVi: '25 - 35 tuổi (Người đi làm)',
    labelEn: 'Ages 25-35 (Early & Mid Career)',
    stageVi: 'Chuyển ngành (Reskilling) & Bứt phá Thu nhập',
    descriptionVi: 'Đánh giá kỹ năng có thể chuyển đổi (Transferable Skills), kế hoạch học tập chuyển ngành mà không gián đoạn thu nhập, thăng tiến lên vị trí chuyên gia hoặc quản lý.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    key: '35+',
    labelVi: '35+ tuổi (Quản lý / Chuyên gia)',
    labelEn: 'Ages 35+ (Senior Leadership & Transition)',
    stageVi: 'Lãnh đạo, Tái định vị & Cân bằng Cuộc sống',
    descriptionVi: 'Định vị dài hạn, vai trò cố vấn / lãnh đạo cấp cao, khởi nghiệp kinh doanh độc lập hoặc cân bằng giữa thành tựu công việc và gia đình.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  }
];

export function getAgeGroupMeta(group?: AgeGroup): AgeGroupMeta {
  const normKey = group === '7-10' ? '6-10' : group === '25+' ? '25-35' : group || '15-18';
  return AGE_GROUPS_CONFIG.find(g => g.key === normKey) || AGE_GROUPS_CONFIG[2];
}

export function detectAgeGroupFromNumber(age: number): AgeGroup {
  if (age <= 10) return '6-10';
  if (age <= 14) return '11-14';
  if (age <= 18) return '15-18';
  if (age <= 24) return '19-24';
  if (age <= 35) return '25-35';
  return '35+';
}

/**
 * Creates an empty user profile where ALL input fields, scores, and text are completely blank
 * with NO pre-filled values, strictly respecting the user requirement:
 * "Các lựa chọn trong khảo sát phải để trống, chỉ để placeholder ví dụ điền như thế nào, không điền sẵn."
 */
export function createEmptyProfile(ageGroup: AgeGroup = '15-18'): UserProfile {
  return {
    id: `user-${Date.now()}`,
    name: '',
    age: (ageGroup === '6-10' ? 9 : ageGroup === '11-14' ? 13 : ageGroup === '15-18' ? 17 : ageGroup === '19-24' ? 21 : ageGroup === '25-35' ? 28 : 38) as number,
    gender: undefined,
    province: '',
    grade: '',
    ageGroup,
    educationLevel: '',
    location: '',
    favoriteSubjects: [],
    confidentSubjects: [],
    academicGPA: '',
    interests: [],
    strengths: [],
    skills: [],
    selfRatedSkills: [],
    goals: [],
    preferredWorkEnvironment: [],
    preferredActivities: [],
    careerPriorities: [],
    careerReadiness: 'exploring',
    interestedMajorInput: '',
    examScores: {
      hsaScore: undefined,
      vactScore: undefined,
      tsaScore: undefined,
      pedagogyScore: undefined,
      thptCombo: '',
      thptScore: undefined,
      awards: []
    },
    workPreferences: {
      teamworkVsSolo: 'Balanced',
      handsOnVsAbstract: 'Balanced',
      remotePreference: 'Any',
      creativityVsStructure: 'Balanced'
    },
    constraints: [],
    educationPreferences: [],
    riaSecScores: {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0
    },
    riaSecProfile: {
      scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
      primary: 'I',
      secondary: 'R',
      tertiary: 'C',
      code: 'Chưa có',
      confidence: 0,
      description: 'Chưa hoàn thành trắc nghiệm RIASEC ở Trang 2'
    },
    mbtiType: undefined,
    mbtiResult: undefined,
    assessmentConfidence: 0,
    completenessPercentage: 0,
    assessmentTimestamp: Date.now(),
    version: '3.0.0'
  };
}
