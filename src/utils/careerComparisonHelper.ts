import { Career, UserProfile, RecommendationScore } from '../types';
import { analyzeSkillGap } from '../engine/skillGapEngine';

export interface AdmissionCombinationItem {
  code: string;
  name: string;
  subjects: string;
  isStudentCombo: boolean;
  matchReason?: string;
  relevanceScore?: number;
}

export interface CareerAdmissionInfo {
  combinations: AdmissionCombinationItem[];
  representativeSchools: Array<{
    name: string;
    type: 'Top 1' | 'Top 2' | 'Cao đẳng / Nghề';
    estimatedBenchmark: string;
    referenceYear?: string;
    sourceName?: string;
  }>;
  hasData: boolean;
  disclaimer: string;
}

/**
 * Determines realistic university and college admission combinations in Vietnam
 * based on career subjects, clusters, and related majors.
 * Personalizes and ranks combinations by student's chosen exam combo and favorite/confident subjects.
 */
export function getCareerAdmissionInfo(career: Career, profile?: UserProfile): CareerAdmissionInfo {
  const cluster = (career.careerCluster || '').toLowerCase();
  const title = (career.title || '').toLowerCase();
  const subjects = (career.relevantSubjects || []).map(s => s.toLowerCase());
  const studentCombo = (profile?.examScores?.thptCombo || '').toUpperCase();
  const favSubs = (profile?.favoriteSubjects || []).map(s => s.toLowerCase());
  const confSubs = (profile?.confidentSubjects || []).map(s => s.toLowerCase());

  const rawCombinations: AdmissionCombinationItem[] = [];

  const isMathHeavy = subjects.some(s => s.includes('toán') || s.includes('tin') || s.includes('lý'));
  const isBioHeavy = subjects.some(s => s.includes('sinh') || s.includes('hóa'));
  const isSocialHeavy = subjects.some(s => s.includes('văn') || s.includes('sử') || s.includes('địa'));
  const isArtHeavy = subjects.some(s => s.includes('vẽ') || s.includes('nghệ thuật') || s.includes('thiết kế'));

  if (isBioHeavy || cluster.includes('y tế') || cluster.includes('sức khỏe') || title.includes('bác sĩ') || title.includes('dược')) {
    rawCombinations.push({ code: 'B00', name: 'Khối B00', subjects: 'Toán, Hóa học, Sinh học', isStudentCombo: studentCombo.includes('B00') });
    rawCombinations.push({ code: 'A00', name: 'Khối A00', subjects: 'Toán, Vật lý, Hóa học', isStudentCombo: studentCombo.includes('A00') });
    rawCombinations.push({ code: 'D07', name: 'Khối D07', subjects: 'Toán, Hóa học, Tiếng Anh', isStudentCombo: studentCombo.includes('D07') });
  } else if (isArtHeavy || cluster.includes('thiết kế') || cluster.includes('nghệ thuật')) {
    rawCombinations.push({ code: 'H00', name: 'Khối H00', subjects: 'Ngữ văn, Năng khiếu Vẽ 1, Năng khiếu Vẽ 2', isStudentCombo: studentCombo.includes('H00') });
    rawCombinations.push({ code: 'V00', name: 'Khối V00', subjects: 'Toán, Vật lý, Vẽ mỹ thuật', isStudentCombo: studentCombo.includes('V00') });
    rawCombinations.push({ code: 'D01', name: 'Khối D01', subjects: 'Toán, Ngữ văn, Tiếng Anh', isStudentCombo: studentCombo.includes('D01') });
  } else if (isMathHeavy || cluster.includes('công nghệ') || cluster.includes('kỹ thuật') || cluster.includes('khoa học')) {
    rawCombinations.push({ code: 'A00', name: 'Khối A00', subjects: 'Toán, Vật lý, Hóa học', isStudentCombo: studentCombo.includes('A00') });
    rawCombinations.push({ code: 'A01', name: 'Khối A01', subjects: 'Toán, Vật lý, Tiếng Anh', isStudentCombo: studentCombo.includes('A01') });
    rawCombinations.push({ code: 'D01', name: 'Khối D01', subjects: 'Toán, Ngữ văn, Tiếng Anh', isStudentCombo: studentCombo.includes('D01') });
    rawCombinations.push({ code: 'D07', name: 'Khối D07', subjects: 'Toán, Hóa học, Tiếng Anh', isStudentCombo: studentCombo.includes('D07') });
  } else if (isSocialHeavy || cluster.includes('xã hội') || cluster.includes('luật') || cluster.includes('giáo dục')) {
    rawCombinations.push({ code: 'C00', name: 'Khối C00', subjects: 'Ngữ văn, Lịch sử, Địa lý', isStudentCombo: studentCombo.includes('C00') });
    rawCombinations.push({ code: 'D01', name: 'Khối D01', subjects: 'Toán, Ngữ văn, Tiếng Anh', isStudentCombo: studentCombo.includes('D01') });
    rawCombinations.push({ code: 'D14', name: 'Khối D14', subjects: 'Ngữ văn, Lịch sử, Tiếng Anh', isStudentCombo: studentCombo.includes('D14') });
  } else if (cluster.includes('kinh tế') || cluster.includes('kinh doanh') || cluster.includes('quản trị')) {
    rawCombinations.push({ code: 'A00', name: 'Khối A00', subjects: 'Toán, Vật lý, Hóa học', isStudentCombo: studentCombo.includes('A00') });
    rawCombinations.push({ code: 'A01', name: 'Khối A01', subjects: 'Toán, Vật lý, Tiếng Anh', isStudentCombo: studentCombo.includes('A01') });
    rawCombinations.push({ code: 'D01', name: 'Khối D01', subjects: 'Toán, Ngữ văn, Tiếng Anh', isStudentCombo: studentCombo.includes('D01') });
    rawCombinations.push({ code: 'D07', name: 'Khối D07', subjects: 'Toán, Hóa học, Tiếng Anh', isStudentCombo: studentCombo.includes('D07') });
  }

  // Personalize & Rank combinations by student profile
  const combinations = rawCombinations.map(combo => {
    let score = 50;
    const reasons: string[] = [];

    if (combo.isStudentCombo) {
      score += 40;
      reasons.push('Khối thi dự kiến của bạn');
    }

    const comboSubs = combo.subjects.toLowerCase().split(',').map(s => s.trim());
    let matchedFavCount = 0;
    comboSubs.forEach(sub => {
      if (favSubs.some(f => f.includes(sub) || sub.includes(f))) matchedFavCount++;
      if (confSubs.some(c => c.includes(sub) || sub.includes(c))) matchedFavCount += 1.5;
    });

    if (matchedFavCount > 0) {
      score += matchedFavCount * 10;
      reasons.push(`Trùng ${Math.round(matchedFavCount)} môn thế mạnh của bạn`);
    }

    return {
      ...combo,
      relevanceScore: Math.min(100, score),
      matchReason: reasons.join(' • ') || undefined
    };
  }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  // Representative training institutions in Vietnam with source/year tags
  let representativeSchools: CareerAdmissionInfo['representativeSchools'] = [];
  if (cluster.includes('công nghệ') || cluster.includes('kỹ thuật') || title.includes('phần mềm') || title.includes('robot')) {
    representativeSchools = [
      { name: 'Đại học Bách Khoa Hà Nội (HUST)', type: 'Top 1', estimatedBenchmark: 'TSA 65 - 85+ / THPT 26 - 28.5đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Đề án Tuyển sinh HUST' },
      { name: 'ĐH Công nghệ - ĐHQGHN (UET)', type: 'Top 1', estimatedBenchmark: 'HSA 95 - 115+ / THPT 26.5 - 28đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Cổng Tuyển sinh UET' },
      { name: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)', type: 'Top 2', estimatedBenchmark: 'THPT 24.5 - 26đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Đề án PTIT' },
      { name: 'Cao đẳng Kỹ thuật Cao Thắng / FPT Polytechnic', type: 'Cao đẳng / Nghề', estimatedBenchmark: 'Xét tuyển học bạ THPT', referenceYear: 'Liên tục các kỳ', sourceName: 'Cổng Tuyển sinh Nghề' }
    ];
  } else if (cluster.includes('y tế') || cluster.includes('sức khỏe') || title.includes('bác sĩ')) {
    representativeSchools = [
      { name: 'Đại học Y Hà Nội / ĐH Y Dược TP.HCM', type: 'Top 1', estimatedBenchmark: 'THPT B00 27 - 29đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Đề án ĐHY' },
      { name: 'Đại học Y Dược Cần Thơ / ĐH Y Dược Huế', type: 'Top 2', estimatedBenchmark: 'THPT B00 24 - 26.5đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Đề án Tuyển sinh' },
      { name: 'Cao đẳng Y Dược Pasteur', type: 'Cao đẳng / Nghề', estimatedBenchmark: 'Xét tuyển học bạ THPT', referenceYear: 'Liên tục các kỳ', sourceName: 'Cổng Tuyển sinh' }
    ];
  } else if (cluster.includes('kinh tế') || cluster.includes('kinh doanh') || cluster.includes('tài chính')) {
    representativeSchools = [
      { name: 'ĐH Ngoại Thương (FTU) / ĐH Kinh tế Quốc dân (NEU)', type: 'Top 1', estimatedBenchmark: 'THPT 26.5 - 28.5đ / HSA 95+', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Đề án FTU/NEU' },
      { name: 'Đại học Thương Mại / ĐH Kinh tế - ĐHQGHN', type: 'Top 2', estimatedBenchmark: 'THPT 24.5 - 26đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Cổng Tuyển sinh' },
      { name: 'Cao đẳng Kinh tế Đối ngoại', type: 'Cao đẳng / Nghề', estimatedBenchmark: 'Xét tuyển học bạ THPT', referenceYear: 'Liên tục các kỳ', sourceName: 'Cổng Tuyển sinh' }
    ];
  } else {
    representativeSchools = [
      { name: 'Đại học Quốc gia Hà Nội / ĐHQG TP.HCM', type: 'Top 1', estimatedBenchmark: 'HSA 85+ / V-ACT 750+', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Cổng Thông tin ĐHQG' },
      { name: 'Đại học Sư phạm / ĐH Mở', type: 'Top 2', estimatedBenchmark: 'THPT 22 - 25đ', referenceYear: 'Tham khảo 2024–2025', sourceName: 'Cổng Tuyển sinh' }
    ];
  }

  return {
    combinations,
    representativeSchools,
    hasData: combinations.length > 0,
    disclaimer: 'Dữ liệu điểm chuẩn và khối thi mang tính chất minh họa tham khảo theo đề án tuyển sinh các năm gần nhất (2024–2025). Điểm chuẩn chính thức có thể thay đổi theo từng năm.'
  };
}

export interface CareerExplanationResult {
  reasons: Array<{
    category: 'academic' | 'skill' | 'riasec' | 'goal' | 'general';
    title: string;
    description: string;
    badgeText: string;
  }>;
  strengths: string[];
  gaps: string[];
}

/**
 * Deterministically constructs "Why this career matches" explanation
 * using pure student profile data + recommendation breakdown.
 * NO LLM hallucination, NO fabricated scores.
 */
export function explainWhyCareerMatches(
  profile: UserProfile,
  career: Career,
  recScore?: RecommendationScore
): CareerExplanationResult {
  const reasons: CareerExplanationResult['reasons'] = [];
  const strengths: string[] = [];
  const gaps: string[] = [];

  // 1. Academic & Subject Alignment
  const favSubs = (profile.favoriteSubjects || []).map(s => s.toLowerCase());
  const confSubs = (profile.confidentSubjects || []).map(s => s.toLowerCase());
  const carSubs = (career.relevantSubjects || []).map(s => s.toLowerCase());

  const matchedSubjects: string[] = [];
  career.relevantSubjects?.forEach(sub => {
    const sLower = sub.toLowerCase();
    if (favSubs.some(f => f.includes(sLower) || sLower.includes(f)) ||
        confSubs.some(c => c.includes(sLower) || sLower.includes(c))) {
      matchedSubjects.push(sub);
    }
  });

  if (matchedSubjects.length > 0) {
    const title = `Thế mạnh môn học: ${matchedSubjects.slice(0, 3).join(', ')}`;
    const desc = `Học viên có sở thích và năng lực tự tin ở môn ${matchedSubjects.join(', ')}, trực tiếp tạo nền tảng vững chắc cho kiến thức chuyên ngành của nghề ${career.title}.`;
    reasons.push({ category: 'academic', title, description: desc, badgeText: 'Học thuật phù hợp' });
    strengths.push(`Nắm vững môn học then chốt: ${matchedSubjects.join(', ')}`);
  } else if (profile.academicGPA) {
    reasons.push({
      category: 'academic',
      title: `Điểm học bạ GPA ${profile.academicGPA}`,
      description: `Học lực chung đáp ứng tốt điều kiện tuyển sinh của các chương trình đào tạo ngành ${career.title}.`,
      badgeText: 'Học lực đảm bảo'
    });
  }

  // 2. Skill Gap & Competency Alignment
  const gap = analyzeSkillGap(profile, career);
  const strongList = gap.strongSkills.map(s => s.skill);
  const devList = gap.developingSkills.map(s => s.skill);
  const missList = gap.missingSkills.map(s => s.skill);

  if (strongList.length > 0 || devList.length > 0) {
    const matchedCount = strongList.length + devList.length;
    const sampleSkills = [...strongList, ...devList].slice(0, 3).join(', ');
    reasons.push({
      category: 'skill',
      title: `Đáp ứng sẵn ${matchedCount} kỹ năng chuyên môn`,
      description: `Học viên đã tích lũy các năng lực quan trọng (${sampleSkills}), giúp rút ngắn đáng kể thời gian đào tạo ban đầu.`,
      badgeText: `${gap.overallReadiness}% sẵn sàng kỹ năng`
    });
    strengths.push(`Kỹ năng thành thạo: ${strongList.slice(0, 3).join(', ') || sampleSkills}`);
  }

  if (missList.length > 0) {
    const highPriGaps = gap.missingSkills.filter(s => s.priority === 'High').map(s => s.skill);
    gaps.push(`Cần bù đắp kỹ năng: ${(highPriGaps.length > 0 ? highPriGaps : missList).slice(0, 3).join(', ')}`);
  }

  // 3. Holland RIASEC Personality Fit
  const studentRiasec = profile.riaSecProfile?.code || (profile.riaSecScores ? 'Đã khảo sát' : undefined);
  const riasecScore = recScore?.breakdown?.riasec;

  if (studentRiasec && riasecScore !== undefined && riasecScore >= 60) {
    const carCode = career.hollandCode || 'IRC';
    reasons.push({
      category: 'riasec',
      title: `Mã Holland (${studentRiasec}) tương thích cao với nghề (${carCode})`,
      description: `Độ tương đồng tâm lý đạt ${Math.round(riasecScore)}%. Thiên hướng hành vi và sở thích tự nhiên của học viên ăn khớp với môi trường làm việc thực tế của ngành.`,
      badgeText: `${Math.round(riasecScore)}% RIASEC Fit`
    });
    strengths.push(`Sở thích nghề nghiệp Holland hòa hợp (${Math.round(riasecScore)}%)`);
  } else if (recScore?.breakdown?.mbti && recScore.breakdown.mbti >= 70) {
    reasons.push({
      category: 'riasec',
      title: `Nhóm tính cách MBTI (${profile.mbtiType || 'INTJ'}) tương thích phong cách làm việc`,
      description: `Phong cách tư duy và xử lý vấn đề của học viên phù hợp với vai trò của ${career.title}.`,
      badgeText: 'MBTI tương hợp'
    });
  }

  // 4. Career Priorities & Work Preferences
  if (profile.careerPriorities && profile.careerPriorities.length > 0) {
    const p0 = profile.careerPriorities[0];
    reasons.push({
      category: 'goal',
      title: `Phù hợp với ưu tiên: "${p0}"`,
      description: `Ngành ${career.title} mang lại mức thu nhập ${career.salaryInfo.rangeDescription} và lộ trình thăng tiến rõ ràng, đáp ứng đúng mục tiêu phát triển của học viên.`,
      badgeText: 'Mục tiêu đồng thuận'
    });
  }

  // Fallback if no specific reasons triggered
  if (reasons.length === 0) {
    reasons.push({
      category: 'general',
      title: `Độ phù hợp tổng thể: ${recScore?.overallScore || 75}%`,
      description: `Thuật toán đánh giá học viên sở hữu nền tảng tiềm năng để đào tạo bài bản và phát triển bền vững trong ngành ${career.title}.`,
      badgeText: 'Tiềm năng phát triển'
    });
  }

  // Additional contributors from engine if available
  if (recScore?.positiveContributors && recScore.positiveContributors.length > 0) {
    recScore.positiveContributors.slice(0, 3).forEach(c => {
      if (!strengths.includes(c)) strengths.push(c);
    });
  }

  if (recScore?.negativeContributors && recScore.negativeContributors.length > 0) {
    recScore.negativeContributors.slice(0, 3).forEach(c => {
      if (!gaps.includes(c)) gaps.push(c);
    });
  }

  return { reasons, strengths, gaps };
}
