/**
 * Core Data Models & TypeScript Types for EduPath AI Career Guidance Platform
 */

export type AgeGroup = '6-10' | '7-10' | '11-14' | '15-18' | '19-24' | '25-35' | '35+' | '25+';

export interface AgeGroupMeta {
  key: AgeGroup;
  labelVi: string;
  labelEn: string;
  stageVi: string;
  descriptionVi: string;
  badgeColor: string;
}

export type RIASECDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RIASECScores {
  [key: string]: number;
  R: number; // 0 to 1
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface RIASECResult {
  scores: RIASECScores;
  primary: RIASECDimension;
  secondary: RIASECDimension;
  tertiary: RIASECDimension;
  code: string; // e.g., "IRC"
  confidence: number; // 0 to 1
  description: string;
}

export interface MBTIResult {
  type: string; // e.g. "INTJ", "ENFP"
  confidence: number; // 0 to 1
  traits: {
    IE: 'I' | 'E';
    SN: 'S' | 'N';
    TF: 'T' | 'F';
    JP: 'J' | 'P';
  };
  notes: string;
}

export type SkillLevel = 'Beginner' | 'Developing' | 'Strong' | 'Expert';

export interface SelfRatedSkill {
  skill: string;
  level: SkillLevel;
  category: 'Technical' | 'Soft' | 'Domain';
}

export interface ExamProfile {
  hsaScore?: number; // HSA ĐHQG Hà Nội (thang 150)
  vactScore?: number; // V-ACT ĐHQG TP.HCM (thang 1200)
  tsaScore?: number; // TSA Bách Khoa Hà Nội (thang 100)
  pedagogyScore?: number; // Đánh giá năng lực Sư phạm (thang 100)
  thptCombo?: string; // Khối thi (A00, A01, B00, C00, D01, ...)
  thptScore?: number; // Điểm thi THPT QG ước tính hoặc thực tế (thang 30)
  awards?: string[]; // Chứng chỉ / Giải thưởng (IELTS, HSG, KHKT...)
}

export type LLMProviderType = 'local' | 'gemini' | 'custom';

export interface LLMConfig {
  provider: LLMProviderType;
  modelName: string;
  customEndpoint?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  maxOutputTokens?: number;
  systemPromptStyle?: 'empathetic' | 'analytical' | 'strategic';
  connectionStatus?: 'unknown' | 'connected' | 'error';
  lastPingMs?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  province?: string;
  grade?: string; // Lớp 10, Lớp 11, Lớp 12, Đại học, Tốt nghiệp/Đi làm
  ageGroup: AgeGroup;
  educationLevel: string;
  location?: string;
  favoriteSubjects: string[];
  confidentSubjects?: string[]; // Môn học tự tin điểm cao nhất
  academicGPA?: string; // Học lực / Điểm trung bình cả năm (Giỏi >8.0, Khá, etc.)
  interests: string[];
  strengths?: string[]; // Sở trường
  skills: string[];
  selfRatedSkills: SelfRatedSkill[];
  goals: string[];
  preferredWorkEnvironment: string[];
  preferredActivities: string[];
  careerPriorities: string[];
  careerReadiness?: 'clear' | 'undecided' | 'exploring'; // Trạng thái định hướng nghề
  interestedMajorInput?: string; // Các ngành người dùng tự nhập quan tâm
  examScores?: ExamProfile; // Các kỳ thi HSA, V-ACT, TSA, Sư phạm, THPT
  workPreferences: {
    teamworkVsSolo: 'Team' | 'Solo' | 'Balanced';
    handsOnVsAbstract: 'Hands-on' | 'Theoretical' | 'Balanced';
    remotePreference: 'Remote' | 'On-site' | 'Hybrid' | 'Any';
    creativityVsStructure: 'Creative' | 'Structured' | 'Balanced';
  };
  constraints: string[];
  educationPreferences: string[]; // e.g., "University", "Vocational", "Apprenticeship", "Self-Taught"
  financialConsiderations?: string;
  riaSecScores: RIASECScores;
  riaSecProfile: RIASECResult;
  mbtiType?: string;
  mbtiResult?: MBTIResult;
  assessmentConfidence: number; // 0 to 1
  completenessPercentage: number; // 0 to 100
  previousExperience?: string[];
  currentOccupation?: string;
  targetOccupation?: string;
  currentEducation?: string;
  targetEducation?: string;
  availableStudyTimeHoursPerWeek?: number;
  learningStyle?: 'Visual' | 'Hands-on' | 'Reading' | 'Social';
  personalityNotes?: string;
  assessmentTimestamp: number;
  version: string;
}

export interface CareerExperiment {
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate';
  description: string;
  steps: string[];
  expectedOutcome: string;
  evaluationQuestion?: string;
}

export interface Career {
  id: string;
  title: string;
  hollandCode?: string;
  aliases: string[];
  description: string;
  careerCluster: string;
  industry: string;
  tasks: string[];
  responsibilities: string[];
  workEnvironment: string[];
  requiredSkills: string[];
  recommendedSkills: string[];
  softSkills: string[];
  technicalSkills: string[];
  relevantSubjects: string[];
  relevantInterests: string[];
  riaSecProfile: RIASECScores;
  mbtiCompatibility: string[]; // Supplementary MBTI types
  educationPaths: Array<{
    type: 'University' | 'College/Vocational' | 'Self-Taught / Portfolio' | 'Certifications' | 'Apprenticeship';
    duration: string;
    description: string;
    tradeoffs: string;
  }>;
  relatedMajors: string[];
  vocationalPaths: string[];
  certifications: string[];
  portfolioExamples: string[];
  beginnerProjects: string[];
  progressionPath: {
    entry: string;
    mid: string;
    senior: string;
  };
  workStyle: string;
  challenges: string[];
  advantages: string[];
  futureTrends: string;
  aiImpact?: string;
  salaryInfo: {
    rangeDescription: string;
    disclaimer: string; // "Example / illustrative information - requires local verification"
    levelIndicator: 'Moderate' | 'Above Average' | 'High' | 'Very High';
  };
  experiments: CareerExperiment[];
  alternativeCareers: Array<{
    careerId: string;
    title: string;
    similarityReason: string;
    distinction: string;
  }>;
  source: string;
  lastUpdated: string;
}

export interface CareerCluster {
  id: string;
  name: string;
  description: string;
  iconName: string;
  careerCount: number;
  domain: string;
}

export interface ScoreBreakdown {
  riasec: number; // 0 to 100 (30% weight)
  academic: number; // 0 to 100 (30% weight - Học tập & điểm thi)
  skills: number; // 0 to 100 (25% weight - Kỹ năng)
  mbti: number; // 0 to 100 (5% weight - Phong cách MBTI bổ trợ)
  expectation: number; // 0 to 100 (10% weight - Kỳ vọng & môi trường)
  // Optional backwards compatibility fields
  interests?: number;
  subjects?: number;
  goals?: number;
  preferences?: number;
}

export interface RecommendationScore {
  careerId: string;
  career: Career;
  overallScore: number; // 0 to 100
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  breakdown: ScoreBreakdown;
  positiveContributors: string[];
  negativeContributors: string[];
  missingSkills: string[];
  rank: number;
  recommendedPathway?: 'University' | 'VocationalCollege' | 'CertificationAndWork' | 'Flexible';
  pathwayAdvice?: string;
}

export interface ScoringWeights {
  wRIASEC: number; // 0.30
  wAcademic: number; // 0.30
  wSkills: number; // 0.25
  wMBTI: number; // 0.05
  wExpectation: number; // 0.10
  // Optional backwards compatibility fields
  wInterests?: number;
  wSubjects?: number;
  wGoals?: number;
  wPreferences?: number;
}

export interface SkillGapItem {
  skill: string;
  userLevel: 'Strong' | 'Developing' | 'Missing';
  priority: 'High' | 'Medium' | 'Low';
  category: 'Technical' | 'Soft' | 'Domain';
  recommendedAction: string;
}

export interface SkillGapAnalysis {
  careerId: string;
  careerTitle: string;
  overallReadiness: number; // 0 to 100
  strongSkills: SkillGapItem[];
  developingSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
  highPriorityCount: number;
}

export interface RoadmapPhase {
  phaseNumber: number;
  name: string;
  duration: string;
  objectives: string[];
  skillsToLearn: string[];
  projects: string[];
  recommendedActivities: string[];
  milestone: string;
}

export interface LearningRoadmap {
  careerId: string;
  careerTitle: string;
  targetAgeGroup: AgeGroup;
  phases: RoadmapPhase[];
  tailoredNote: string;
}

export interface WhatIfAdjustments {
  addedSubjects: string[];
  removedSubjects: string[];
  addedSkills: string[];
  preferredRemote: 'Remote' | 'On-site' | 'Any';
  higherTeamwork: boolean;
  noUniversity: boolean;
  priorityHighIncome: boolean;
}

export interface WhatIfComparisonResult {
  beforeRankings: Array<{ careerId: string; title: string; score: number }>;
  afterRankings: Array<{ careerId: string; title: string; score: number; delta: number }>;
  explanation: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  sources?: string[];
  suggestedQuestions?: string[];
}

export interface AssessmentQuestion {
  id: string;
  module: 'basic' | 'interests' | 'riasec' | 'skills' | 'subjects' | 'goals' | 'workStyle' | 'mbti';
  ageGroups: AgeGroup[];
  prompt: string;
  description?: string;
  type: 'single-choice' | 'multi-choice' | 'rating' | 'slider';
  options: Array<{
    label: string;
    value: string;
    emoji?: string;
    riasecWeight?: Partial<Record<RIASECDimension, number>>;
    skillTags?: string[];
    interestTags?: string[];
    subjectTags?: string[];
    mbtiWeight?: { dimension: 'IE' | 'SN' | 'TF' | 'JP'; value: 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' };
  }>;
}

export interface DisambiguationQuestion {
  careerA: { id: string; title: string };
  careerB: { id: string; title: string };
  question: string;
  options: Array<{
    label: string;
    favorsCareerId: string;
    impactDescription: string;
  }>;
}

export function getHollandCode(scores: RIASECScores): string {
  const sorted = Object.entries(scores)
    .filter(([k]) => ['R', 'I', 'A', 'S', 'E', 'C'].includes(k))
    .sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 3).map(s => s[0]).join('');
}
