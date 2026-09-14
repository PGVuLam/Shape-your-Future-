import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Zap,
  RotateCcw,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { UserProfile, AgeGroup, ExamProfile } from '../types';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { AGE_GROUPS_CONFIG, detectAgeGroupFromNumber, createEmptyProfile } from '../utils/ageGroupUtils';

interface Step1ComprehensiveInfoViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onAdvanceToStep2: () => void;
  onLoadDemoProfile: (profile: UserProfile) => void;
}

export const Step1ComprehensiveInfoView: React.FC<Step1ComprehensiveInfoViewProps> = ({
  profile,
  onUpdateProfile,
  onAdvanceToStep2,
  onLoadDemoProfile
}) => {
  // Form data initialized strictly from profile (empty if new survey)
  const [formData, setFormData] = useState<{
    name: string;
    age: string;
    gender: 'Nam' | 'Nữ' | 'Khác' | '';
    province: string;
    grade: string;
    ageGroup: AgeGroup;
    favoriteSubjects: string[];
    confidentSubjects: string[];
    academicGPA: string;
    interests: string[];
    strengths: string[];
    skills: string[];
    hsaScore: string;
    vactScore: string;
    tsaScore: string;
    pedagogyScore: string;
    thptCombo: string;
    thptScore: string;
    awards: string[];
    preferredWorkEnvironment: string[];
    careerPriorities: string[];
    careerReadiness: 'clear' | 'undecided' | 'exploring';
    interestedMajorInput: string;
    currentOccupation: string;
    yearsOfExperience: string;
    customSubjectInput: string;
    customInterestInput: string;
    customSkillInput: string;
  }>({
    name: profile.name || '',
    age: profile.age ? profile.age.toString() : '',
    gender: profile.gender || '',
    province: profile.province || '',
    grade: profile.grade || '',
    ageGroup: profile.ageGroup || '15-18',
    favoriteSubjects: profile.favoriteSubjects || [],
    confidentSubjects: profile.confidentSubjects || [],
    academicGPA: profile.academicGPA || '',
    interests: profile.interests || [],
    strengths: profile.strengths || [],
    skills: profile.skills || [],
    hsaScore: profile.examScores?.hsaScore ? profile.examScores.hsaScore.toString() : '',
    vactScore: profile.examScores?.vactScore ? profile.examScores.vactScore.toString() : '',
    tsaScore: profile.examScores?.tsaScore ? profile.examScores.tsaScore.toString() : '',
    pedagogyScore: profile.examScores?.pedagogyScore ? profile.examScores.pedagogyScore.toString() : '',
    thptCombo: profile.examScores?.thptCombo || '',
    thptScore: profile.examScores?.thptScore ? profile.examScores.thptScore.toString() : '',
    awards: profile.examScores?.awards || [],
    preferredWorkEnvironment: profile.preferredWorkEnvironment || [],
    careerPriorities: profile.careerPriorities || [],
    careerReadiness: profile.careerReadiness || 'exploring',
    interestedMajorInput: profile.interestedMajorInput || '',
    currentOccupation: profile.currentOccupation || '',
    yearsOfExperience: '',
    customSubjectInput: '',
    customInterestInput: '',
    customSkillInput: ''
  });

  // Keep form data strictly in sync when profile id changes (such as reset to blank)
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      age: profile.age ? profile.age.toString() : '',
      gender: profile.gender || '',
      province: profile.province || '',
      grade: profile.grade || '',
      ageGroup: profile.ageGroup || '15-18',
      favoriteSubjects: profile.favoriteSubjects || [],
      confidentSubjects: profile.confidentSubjects || [],
      academicGPA: profile.academicGPA || '',
      interests: profile.interests || [],
      strengths: profile.strengths || [],
      skills: profile.skills || [],
      hsaScore: profile.examScores?.hsaScore ? profile.examScores.hsaScore.toString() : '',
      vactScore: profile.examScores?.vactScore ? profile.examScores.vactScore.toString() : '',
      tsaScore: profile.examScores?.tsaScore ? profile.examScores.tsaScore.toString() : '',
      pedagogyScore: profile.examScores?.pedagogyScore ? profile.examScores.pedagogyScore.toString() : '',
      thptCombo: profile.examScores?.thptCombo || '',
      thptScore: profile.examScores?.thptScore ? profile.examScores.thptScore.toString() : '',
      awards: profile.examScores?.awards || [],
      preferredWorkEnvironment: profile.preferredWorkEnvironment || [],
      careerPriorities: profile.careerPriorities || [],
      careerReadiness: profile.careerReadiness || 'exploring',
      interestedMajorInput: profile.interestedMajorInput || '',
      currentOccupation: profile.currentOccupation || '',
      yearsOfExperience: '',
      customSubjectInput: '',
      customInterestInput: '',
      customSkillInput: ''
    });
  }, [profile.id]);

  // Keep age group in sync when user edits age number
  const handleAgeChange = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      const autoGroup = detectAgeGroupFromNumber(num);
      setFormData(prev => ({ ...prev, age: val, ageGroup: autoGroup }));
    } else {
      setFormData(prev => ({ ...prev, age: val }));
    }
  };

  const handleAgeGroupSelect = (group: AgeGroup) => {
    let defaultAgeStr = formData.age;
    if (!defaultAgeStr) {
      if (group === '6-10') defaultAgeStr = '9';
      else if (group === '11-14') defaultAgeStr = '13';
      else if (group === '15-18') defaultAgeStr = '17';
      else if (group === '19-24') defaultAgeStr = '21';
      else if (group === '25-35') defaultAgeStr = '28';
      else if (group === '35+') defaultAgeStr = '38';
    }
    setFormData(prev => ({ ...prev, ageGroup: group, age: defaultAgeStr }));
  };

  // Reset form completely to blank
  const handleResetToBlank = () => {
    const empty = createEmptyProfile(formData.ageGroup);
    onUpdateProfile(empty);
    setFormData({
      name: '',
      age: '',
      gender: '',
      province: '',
      grade: '',
      ageGroup: formData.ageGroup,
      favoriteSubjects: [],
      confidentSubjects: [],
      academicGPA: '',
      interests: [],
      strengths: [],
      skills: [],
      hsaScore: '',
      vactScore: '',
      tsaScore: '',
      pedagogyScore: '',
      thptCombo: '',
      thptScore: '',
      awards: [],
      preferredWorkEnvironment: [],
      careerPriorities: [],
      careerReadiness: 'exploring',
      interestedMajorInput: '',
      currentOccupation: '',
      yearsOfExperience: '',
      customSubjectInput: '',
      customInterestInput: '',
      customSkillInput: ''
    });
  };

  // Grade options based on age group
  const getGradeOptions = () => {
    switch (formData.ageGroup) {
      case '6-10':
        return ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];
      case '11-14':
        return ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'];
      case '15-18':
        return ['Lớp 10', 'Lớp 11', 'Lớp 12'];
      case '19-24':
        return ['Sinh viên Năm 1', 'Sinh viên Năm 2', 'Sinh viên Năm 3', 'Sinh viên Năm 4', 'Cao đẳng / Học nghề', 'Vừa tốt nghiệp'];
      case '25-35':
        return ['Đã tốt nghiệp ĐH/CĐ (1 - 3 năm)', 'Người đi làm (3 - 7 năm)', 'Đang muốn chuyển ngành', 'Kinh doanh tự do'];
      case '35+':
        return ['Chuyên gia thâm niên (>8 năm)', 'Quản lý / Trưởng bộ phận', 'Chủ doanh nghiệp / Khởi nghiệp', 'Tư vấn độc lập'];
      default:
        return ['Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học', 'Đi làm'];
    }
  };

  const subjectList = formData.ageGroup === '6-10'
    ? ['Toán tư duy', 'Tiếng Việt', 'Khoa học tự nhiên', 'Ngoại ngữ (Tiếng Anh)', 'Tin học / Lập trình trẻ em', 'Mỹ thuật & Sáng tạo', 'Âm nhạc', 'Thể thao']
    : formData.ageGroup === '11-14'
    ? ['Toán học', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học', 'Tin học', 'Lịch sử & Địa lý', 'Công nghệ', 'Mỹ thuật']
    : [
        'Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Tin học',
        'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh', 'GDCD / Kinh tế & Pháp luật', 'Mỹ thuật'
      ];

  const interestList = formData.ageGroup === '6-10'
    ? ['Lắp ráp LEGO & Mô hình', 'Vẽ tranh & Sáng tác truyện', 'Khám phá thế giới động vật', 'Trò chơi điện tử trí tuệ', 'Làm thí nghiệm khoa học', 'Bơi lội & Thể thao']
    : formData.ageGroup === '11-14'
    ? ['Lập trình Scratch/Python', 'Robotics & Chế tạo', 'Đọc sách khoa học & Lịch sử', 'Vẽ tranh kỹ thuật số', 'Tham gia hoạt động Đội/Nhóm', 'Hùng biện tiếng Anh']
    : [
        'Lập trình phần mềm & Thuật toán', 'Trí tuệ nhân tạo (AI)', 'Nghiên cứu khoa học & Tự nhiên',
        'Thiết kế đồ họa & Giao diện UI/UX', 'Kinh doanh & Khởi nghiệp', 'Tài chính & Đầu tư',
        'Giao tiếp, Đàm phán & Thuyết trình', 'Hoạt động xã hội & Tình nguyện', 'Chế tạo máy & Điện tử vi mạch',
        'Y học & Chăm sóc sức khỏe', 'Tâm lý học con người', 'Truyền thông số & Báo chí'
      ];

  const skillList = formData.ageGroup === '6-10' || formData.ageGroup === '11-14'
    ? ['Tư duy logic', 'Tự học và tìm tòi', 'Giao tiếp hòa đồng', 'Làm việc nhóm', 'Sáng tạo ý tưởng', 'Sử dụng máy tính']
    : [
        'Lập trình (Python, C++, Java)', 'Tư duy logic & Toán ứng dụng', 'Giải quyết vấn đề phức tạp',
        'Thuyết trình & Hùng biện', 'Làm việc nhóm & Phối hợp', 'Tiếng Anh giao tiếp & Học thuật',
        'Thiết kế đồ họa / Video', 'Phân tích dữ liệu & Excel', 'Quản lý thời gian & Kế hoạch'
      ];

  const envList = [
    'Công ty công nghệ cao & Đổi mới sáng tạo', 'Phòng thí nghiệm & Viện nghiên cứu khoa học',
    'Làm việc linh hoạt Hybrid / Làm từ xa (Remote)', 'Tập đoàn đa quốc gia chuyên nghiệp',
    'Cơ quan nhà nước & Cơ sở giáo dục đào tạo', 'Studio sáng tạo nghệ thuật & Truyền thông', 'Môi trường bệnh viện & Y tế'
  ];

  const priorityList = [
    'Thu nhập cao & Cơ hội thăng tiến rõ ràng', 'Cân bằng giữa công việc và cuộc sống gia đình',
    'Đóng góp giá trị nhân văn cho cộng đồng', 'Môi trường học hỏi & Phát triển bản thân liên tục',
    'Tính ổn định và an toàn lâu dài', 'Tự do sáng tạo & Quyền tự chủ cao'
  ];

  const thptCombos = [
    'A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'B00 (Toán, Hóa, Sinh)',
    'C00 (Văn, Sử, Địa)', 'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)'
  ];

  // Tag toggle helper
  const toggleItem = (
    listKey: 'favoriteSubjects' | 'confidentSubjects' | 'interests' | 'strengths' | 'skills' | 'preferredWorkEnvironment' | 'careerPriorities',
    item: string
  ) => {
    setFormData(prev => {
      const current = prev[listKey];
      const exists = current.includes(item);
      return {
        ...prev,
        [listKey]: exists ? current.filter(x => x !== item) : [...current, item]
      };
    });
  };

  const handleAddCustomTag = (
    listKey: 'favoriteSubjects' | 'interests' | 'skills',
    inputKey: 'customSubjectInput' | 'customInterestInput' | 'customSkillInput'
  ) => {
    const val = formData[inputKey].trim();
    if (!val) return;
    if (!formData[listKey].includes(val)) {
      setFormData(prev => ({
        ...prev,
        [listKey]: [...prev[listKey], val],
        [inputKey]: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [inputKey]: '' }));
    }
  };

  const handleSaveAndAdvance = () => {
    const ageNum = parseInt(formData.age, 10) || (formData.ageGroup === '6-10' ? 9 : formData.ageGroup === '11-14' ? 13 : formData.ageGroup === '15-18' ? 17 : formData.ageGroup === '19-24' ? 21 : formData.ageGroup === '25-35' ? 28 : 38);

    const updated: UserProfile = {
      ...profile,
      name: formData.name.trim(),
      age: ageNum,
      gender: formData.gender ? (formData.gender as 'Nam' | 'Nữ' | 'Khác') : undefined,
      province: formData.province,
      grade: formData.grade,
      ageGroup: formData.ageGroup,
      educationLevel: formData.grade || (ageNum <= 10 ? 'Tiểu học' : ageNum <= 14 ? 'THCS' : ageNum <= 18 ? 'THPT' : 'Đại học / Đi làm'),
      favoriteSubjects: formData.favoriteSubjects,
      confidentSubjects: formData.confidentSubjects,
      academicGPA: formData.academicGPA,
      interests: formData.interests,
      strengths: formData.strengths,
      skills: formData.skills,
      preferredWorkEnvironment: formData.preferredWorkEnvironment,
      careerPriorities: formData.careerPriorities,
      careerReadiness: formData.careerReadiness,
      interestedMajorInput: formData.interestedMajorInput,
      currentOccupation: formData.currentOccupation,
      examScores: {
        hsaScore: formData.hsaScore ? parseFloat(formData.hsaScore) : undefined,
        vactScore: formData.vactScore ? parseFloat(formData.vactScore) : undefined,
        tsaScore: formData.tsaScore ? parseFloat(formData.tsaScore) : undefined,
        pedagogyScore: formData.pedagogyScore ? parseFloat(formData.pedagogyScore) : undefined,
        thptCombo: formData.thptCombo,
        thptScore: formData.thptScore ? parseFloat(formData.thptScore) : undefined,
        awards: formData.awards
      }
    };

    onUpdateProfile(updated);
    onAdvanceToStep2();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Top Notification Bar: Clean Slate & Demo Switch */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>TRANG 1 / 4: KHẢO SÁT THÔNG TIN CƠ BẢN & NĂNG LỰC HỌC TẬP</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Hồ sơ Khảo sát Người học theo Từng Độ tuổi
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Các ô nhập đều để trống để bạn tự do điền thông tin của chính mình (có kèm ví dụ minh họa).
            Hãy chọn nhóm tuổi phù hợp để hệ thống điều chỉnh câu hỏi và định hướng chuyên sâu nhất.
          </p>
        </div>

        {/* Action Buttons: Demo vs Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToBlank}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Xóa sạch dữ liệu về trạng thái trống hoàn toàn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Để trống tất cả</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const demo = DEMO_PROFILES['demo-hs-tech'];
              onLoadDemoProfile(demo);
              setFormData({
                name: demo.name,
                age: demo.age.toString(),
                gender: 'Nam',
                province: 'Hà Nội',
                grade: 'Lớp 11',
                ageGroup: '15-18',
                favoriteSubjects: demo.favoriteSubjects,
                confidentSubjects: ['Toán học', 'Tin học'],
                academicGPA: '8.8 (Học lực Giỏi)',
                interests: demo.interests,
                strengths: ['Tư duy logic sắc bén', 'Khả năng tự học cao'],
                skills: demo.skills,
                hsaScore: '98',
                vactScore: '',
                tsaScore: '74',
                pedagogyScore: '',
                thptCombo: 'A00 (Toán, Lý, Hóa)',
                thptScore: '26.5',
                awards: ['IELTS 7.0', 'Giải Nhì HSG Tin học cấp Tỉnh'],
                preferredWorkEnvironment: demo.preferredWorkEnvironment,
                careerPriorities: demo.careerPriorities,
                careerReadiness: 'undecided',
                interestedMajorInput: 'Khoa học máy tính, Kỹ thuật Vi mạch, Trí tuệ nhân tạo',
                currentOccupation: '',
                yearsOfExperience: '',
                customSubjectInput: '',
                customInterestInput: '',
                customSkillInput: ''
              });
            }}
            className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Tải nhanh hồ sơ mẫu của học sinh THPT để kiểm thử"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Nạp Hồ sơ Mẫu</span>
          </button>
        </div>
      </div>

      {/* CHỌN ĐỘ TUỔI KHẢO SÁT (EXPANDED AGE GROUPS) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>1. Chọn Nhóm Tuổi Khảo Sát (Được cá nhân hóa câu hỏi & tư vấn)</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">Bắt buộc</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {AGE_GROUPS_CONFIG.map(group => {
            const isSelected = formData.ageGroup === group.key;
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => handleAgeGroupSelect(group.key)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'bg-indigo-50/90 border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    {group.key} tuổi
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="text-[11px] font-semibold text-indigo-950 truncate">
                  {group.labelVi.split('(')[1]?.replace(')', '') || group.labelVi}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                  {group.stageVi}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Age Group Banner */}
        {(() => {
          const currentMeta = AGE_GROUPS_CONFIG.find(g => g.key === formData.ageGroup) || AGE_GROUPS_CONFIG[2];
          return (
            <div className={`p-3.5 rounded-2xl text-xs border flex items-start space-x-2.5 mt-2 ${currentMeta.badgeColor}`}>
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>{currentMeta.labelVi} — {currentMeta.stageVi}: </strong>
                <span>{currentMeta.descriptionVi}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* MỤC 2: THÔNG TIN CÁ NHÂN CƠ BẢN */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>2. Thông tin Cá nhân Cơ bản</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Name */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Họ và tên người học:</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              placeholder="Ví dụ: Nguyễn Văn An"
            />
          </div>

          {/* Age */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Số tuổi cụ thể:</label>
            <input
              type="number"
              min="6"
              max="70"
              value={formData.age}
              onChange={e => handleAgeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
              placeholder="Ví dụ: 17"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Giới tính:</label>
            <select
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              <option value="">-- Chọn Giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tỉnh / Thành phố:</label>
            <select
              value={formData.province}
              onChange={e => setFormData({ ...formData, province: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              <option value="">-- Chọn Tỉnh / Thành phố --</option>
              {VIETNAM_PROVINCES.map(prov => (
                <option key={prov.id} value={prov.name}>
                  {prov.name} (Miền {prov.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grade / Stage & Current Occupation if adult */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Khối lớp / Giai đoạn học tập:</label>
            <select
              value={formData.grade}
              onChange={e => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              <option value="">-- Chọn Khối lớp / Trình độ tương ứng --</option>
              {getGradeOptions().map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {formData.ageGroup === '25-35' || formData.ageGroup === '35+'
                ? 'Công việc / Vị trí hiện tại:'
                : formData.ageGroup === '19-24'
                ? 'Trường Đại học / Cao đẳng đang học (nếu có):'
                : 'Trường đang học (Tiểu học / THCS / THPT):'}
            </label>
            <input
              type="text"
              value={formData.currentOccupation}
              onChange={e => setFormData({ ...formData, currentOccupation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              placeholder={
                formData.ageGroup === '25-35' || formData.ageGroup === '35+'
                  ? 'Ví dụ: Kế toán viên / Chuyên viên Marketing / Kỹ sư cơ khí...'
                  : formData.ageGroup === '19-24'
                  ? 'Ví dụ: Đại học Bách Khoa Hà Nội - Ngành CNTT'
                  : 'Ví dụ: Trường THPT Chuyên Hà Nội - Amsterdam'
              }
            />
          </div>
        </div>
      </div>

      {/* MỤC 3: NĂNG LỰC HỌC TẬP & MÔN THẾ MẠNH */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>3. Môn học Yêu thích & Học lực</span>
        </h2>

        {/* GPA selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Điểm trung bình (GPA) / Học lực:</label>
            <select
              value={formData.academicGPA}
              onChange={e => setFormData({ ...formData, academicGPA: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            >
              <option value="">-- Chọn khoảng điểm GPA / Xếp loại học lực --</option>
              <option value="Xuất sắc (> 9.0)">Xuất sắc (&gt; 9.0)</option>
              <option value="Giỏi (8.0 - 8.9)">Giỏi (8.0 - 8.9)</option>
              <option value="Khá (6.5 - 7.9)">Khá (6.5 - 7.9)</option>
              <option value="Trung bình (5.0 - 6.4)">Trung bình (5.0 - 6.4)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Môn tự tin đạt điểm cao nhất:</label>
            <input
              type="text"
              value={formData.confidentSubjects.join(', ')}
              onChange={e =>
                setFormData({
                  ...formData,
                  confidentSubjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              placeholder="Ví dụ: Toán học, Tin học, Tiếng Anh (cách nhau bởi dấu phẩy)"
            />
          </div>
        </div>

        {/* Favorite subjects click-to-toggle tags */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 text-xs">
              Môn học yêu thích (Click để chọn hoặc bỏ chọn):
            </span>
            <span className="text-[11px] text-slate-400">
              Đã chọn: {formData.favoriteSubjects.length} môn
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {subjectList.map(subj => {
              const selected = formData.favoriteSubjects.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => toggleItem('favoriteSubjects', subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    selected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected && '✓ '}
                  {subj}
                </button>
              );
            })}
          </div>

          {/* Add custom subject */}
          <div className="flex items-center gap-2 pt-1 max-w-md">
            <input
              type="text"
              value={formData.customSubjectInput}
              onChange={e => setFormData({ ...formData, customSubjectInput: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag('favoriteSubjects', 'customSubjectInput');
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              placeholder="Thêm môn học khác..."
            />
            <button
              type="button"
              onClick={() => handleAddCustomTag('favoriteSubjects', 'customSubjectInput')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              + Thêm
            </button>
          </div>
        </div>
      </div>

      {/* MỤC 4: KỲ THI TUYỂN SINH (THPT / ĐẠI HỌC) HOẶC KỸ NĂNG NGHỀ NGHIỆP (DYNAMIC ACCORDING TO AGE) */}
      {(formData.ageGroup === '15-18' || formData.ageGroup === '19-24') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>4. Điểm Thi Tuyển Sinh Đại học (HSA, TSA, V-ACT & THPT Quốc gia)</span>
            </h2>
            <span className="text-[11px] text-slate-400">Tùy chọn nếu đã thi hoặc dự kiến</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* HSA */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">HSA (ĐHQG Hà Nội):</label>
              <input
                type="number"
                min="0"
                max="150"
                value={formData.hsaScore}
                onChange={e => setFormData({ ...formData, hsaScore: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                placeholder="Ví dụ: 98 (Thang 150)"
              />
            </div>

            {/* TSA */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">TSA (Bách Khoa HN):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.tsaScore}
                onChange={e => setFormData({ ...formData, tsaScore: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                placeholder="Ví dụ: 74 (Thang 100)"
              />
            </div>

            {/* V-ACT */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">V-ACT (ĐHQG TP.HCM):</label>
              <input
                type="number"
                min="0"
                max="1200"
                value={formData.vactScore}
                onChange={e => setFormData({ ...formData, vactScore: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                placeholder="Ví dụ: 850 (Thang 1200)"
              />
            </div>

            {/* Pedagogy */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ĐGNL Sư phạm:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.pedagogyScore}
                onChange={e => setFormData({ ...formData, pedagogyScore: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                placeholder="Ví dụ: 25.0 (Thang 30)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Khối thi THPT Quốc gia:</label>
              <select
                value={formData.thptCombo}
                onChange={e => setFormData({ ...formData, thptCombo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                <option value="">-- Chọn Khối thi --</option>
                {thptCombos.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Điểm thi THPT ước tính hoặc thực tế:</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={formData.thptScore}
                onChange={e => setFormData({ ...formData, thptScore: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                placeholder="Ví dụ: 26.5 (Thang 30)"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Giải thưởng & Chứng chỉ (IELTS, HSG...):</label>
              <input
                type="text"
                value={formData.awards.join(', ')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    awards: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                placeholder="Ví dụ: IELTS 7.0, Giải Ba HSG Tỉnh"
              />
            </div>
          </div>
        </div>
      )}

      {/* For age < 15: Friendly Note */}
      {(formData.ageGroup === '6-10' || formData.ageGroup === '11-14') && (
        <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-950">Gợi ý dành riêng cho lứa tuổi {formData.ageGroup} tuổi</h3>
            <p className="mt-1 text-amber-800 leading-relaxed">
              Các kỳ thi ĐGNL (HSA, TSA) và THPTQG được thiết kế dành cho học sinh từ 15 tuổi trở lên.
              Ở độ tuổi của em, hệ thống sẽ tập trung phân tích đam mê, sở thích, năng khiếu và kỹ năng tự học để xây dựng nền tảng vững vàng nhất!
            </p>
          </div>
        </div>
      )}

      {/* For age >= 25: Career Transition & Reskilling Section */}
      {(formData.ageGroup === '25-35' || formData.ageGroup === '35+') && (
        <div className="bg-purple-50/70 rounded-3xl p-5 border border-purple-200/80 text-xs text-purple-900 space-y-3">
          <div className="flex items-center gap-2 font-bold text-purple-950">
            <Briefcase className="w-4 h-4 text-purple-700" />
            <span>Mục tiêu Phát triển Sự nghiệp & Chuyển ngành (Reskilling)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-purple-900 block mb-1">Số năm kinh nghiệm làm việc:</label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.yearsOfExperience}
                onChange={e => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs font-mono"
                placeholder="Ví dụ: 4 (năm)"
              />
            </div>

            <div>
              <label className="font-semibold text-purple-900 block mb-1">Mục tiêu ưu tiên hàng đầu:</label>
              <select
                value={formData.careerReadiness}
                onChange={e => setFormData({ ...formData, careerReadiness: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs"
              >
                <option value="exploring">Chuyển hướng sang ngành nghề mới (Reskilling)</option>
                <option value="clear">Thăng tiến lên vị trí Quản lý / Chuyên gia cao cấp</option>
                <option value="undecided">Khởi nghiệp / Tự do tài chính & Cân bằng cuộc sống</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* MỤC 5: SỞ THÍCH, KỸ NĂNG & ĐỊNH HƯỚNG MONG MUỐN */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>5. Sở thích, Kỹ năng & Ngành học Quan tâm</span>
        </h2>

        {/* Interests */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Lĩnh vực & Hoạt động bạn có hứng thú:</span>
            <span className="text-[11px] text-slate-400">Đã chọn: {formData.interests.length}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {interestList.map(item => {
              const selected = formData.interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem('interests', item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    selected
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected && '✓ '}
                  {item}
                </button>
              );
            })}
          </div>

          {/* Add custom interest */}
          <div className="flex items-center gap-2 pt-1 max-w-md">
            <input
              type="text"
              value={formData.customInterestInput}
              onChange={e => setFormData({ ...formData, customInterestInput: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag('interests', 'customInterestInput');
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              placeholder="Thêm sở thích khác..."
            />
            <button
              type="button"
              onClick={() => handleAddCustomTag('interests', 'customInterestInput')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              + Thêm
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Kỹ năng sở trường bạn tự tin:</span>
            <span className="text-[11px] text-slate-400">Đã chọn: {formData.skills.length}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {skillList.map(skill => {
              const selected = formData.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleItem('skills', skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected && '✓ '}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Major input */}
        <div className="pt-2 text-xs">
          <label className="font-semibold text-slate-700 block mb-1">
            Ngành nghề hoặc chuyên môn bạn đang quan tâm nhất (nếu có):
          </label>
          <input
            type="text"
            value={formData.interestedMajorInput}
            onChange={e => setFormData({ ...formData, interestedMajorInput: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            placeholder="Ví dụ: Khoa học máy tính, Trí tuệ nhân tạo, Thiết kế vi mạch, Kinh doanh quốc tế..."
          />
        </div>
      </div>

      {/* BOTTOM ACTION BUTTON: ADVANCE TO STEP 2 */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-500">
          Bước 1 / 4 • Thông tin sẽ được chuyển giao sang Bài kiểm tra RIASEC ở Trang 2.
        </div>

        <button
          type="button"
          onClick={handleSaveAndAdvance}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer group"
        >
          <span>Lưu Hồ Sơ & Sang Trang 2 (Bài Test RIASEC)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
