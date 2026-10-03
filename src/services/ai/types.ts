import { UserProfile, Career, LLMConfig, RecommendationScore, AgeGroup } from '../../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  modelUsed?: string;
  suggestedQuestions?: string[];
}

export interface NormalizedAIResponse {
  reply: string;
  modelUsed: string;
  suggestedQuestions: string[];
  // Backwards compatibility aliases
  content: string;
  provider: string;
  suggestedFollowUps: string[];
}

export interface CounselorContextPayload {
  careerTitle: string;
  cluster: string;
  tasks: string[];
  requiredSkills: string[];
  userMatchedSkills: string[];
  userMissingSkills?: string[];
  educationPaths: string[];
  salaryLevel: string;
  riasecFitSummary: string;
  verifiedAdmissionContext?: string[];
  surveyRecommendations: Array<{
    title: string;
    careerCluster: string;
    overallScore?: number;
    requiredSkills?: string[];
    salaryInfo?: any;
  }>;
  profileContext: {
    name?: string;
    age?: number;
    gender?: string;
    ageGroup: AgeGroup;
    province?: string;
    grade?: string;
    educationLevel?: string;
    favoriteSubjects?: string[];
    confidentSubjects?: string[];
    academicGPA?: string;
    strengths?: string[];
    interests?: string[];
    skills?: string[];
    selfRatedSkills?: any[];
    riasecCode?: string;
    riaSecScores?: any;
    riaSecProfile?: any;
    mbtiType?: string;
    mbtiResult?: any;
    examScores?: any;
    workPreferences?: any;
    careerPriorities?: string[];
    careerReadiness?: string;
    interestedMajorInput?: string;
    financialConsiderations?: string;
    educationPreferences?: string[];
  };
  // Structured and filtered context dimensions (Provider-Independent)
  careerComparison?: Array<{
    title: string;
    cluster: string;
    matchScore?: number;
    requiredSkills: string[];
    salary: string;
    aiImpact?: string;
    futureTrends?: string;
  }>;
  skillGapAnalysis?: {
    matchedSkills: string[];
    developingSkills: string[];
    missingSkills: string[];
    overallReadiness: number;
    criticalGaps: string[];
  };
  roadmapSummary?: {
    phases: Array<{
      name: string;
      duration: string;
      focus: string;
      keyActions: string[];
      milestone?: string;
    }>;
  };
  aiImpact?: string;
  futureTrends?: string;
  progressionPath?: {
    entry: string;
    mid: string;
    senior: string;
  };
  aiImpactAnalysis?: {
    timeHorizon: '3–5 năm';
    directAiImpact?: string;
    assistableTasks: string[];
    automatedAspectsSummary: string;
    humanAdvantageSummary: string;
    humanAbilities: string[];
    emergingSkills: string[];
    marketTrendSummary: string;
    tailoredAdvice: string[];
    knownData: string[];
    inferences: string[];
    uncertainties: string[];
  };
  userQuestion?: string;
}

export interface LLMProviderRequest {
  userQuestion: string;
  context: CounselorContextPayload;
  chatHistory: Array<{
    role: 'user' | 'model' | 'assistant';
    parts?: string;
    content?: string;
  }>;
  language?: 'vi' | 'en';
  llmConfig?: LLMConfig;
}
