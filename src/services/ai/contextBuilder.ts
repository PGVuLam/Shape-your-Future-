import { UserProfile, Career, RecommendationScore, AgeGroup } from '../../types';
import { detectAgeGroupFromNumber } from '../../utils/ageGroupUtils';
import { retrieveContextForCareer } from '../ragService';
import { analyzeSkillGap } from '../../engine/skillGapEngine';
import { generateLearningRoadmap } from '../../engine/roadmapEngine';
import { analyzeAIImpactAndFutureTrends } from '../../engine/aiImpactEngine';
import { CounselorContextPayload } from './types';

/**
 * Builds a comprehensive, grounded context payload combining:
 * 1. Student Profile (personal, academic, subjects, GPA)
 * 2. Assessment Scores (RIASEC & MBTI)
 * 3. Standardized Exams (HSA, TSA, V-ACT, THPT)
 * 4. Recommendation Results (Top matched careers with calculated match %)
 * 5. Skill Gap Analysis (Strong, developing, missing skills and priority)
 * 6. Learning Roadmap (Structured milestones & actionable phases)
 * 7. AI Impact & Future Market Trends (Disruption level, human unique edge)
 * 8. Career Comparison (Comparative matrix across selected careers)
 * 9. RAG University Admission Benchmarks (Verified Vietnamese institutions)
 *
 * Output is completely provider-independent (used identically by Gemini, Ollama, and offline engine).
 */
export function buildCounselorContext(
  profile: UserProfile,
  primaryCareer?: Career,
  topCareers?: Career[],
  recommendations?: any[],
  recScore?: RecommendationScore,
  comparedCareers?: Career[],
  userQuestion?: string
): CounselorContextPayload {
  const age = Number(profile.age || 17);
  const ageGroup: AgeGroup = profile.ageGroup || detectAgeGroupFromNumber(age);

  // Determine target career
  const mainCareer = primaryCareer || (topCareers && topCareers[0]);

  // 1. Extract RAG grounded context if career exists
  let ragContext: any = null;
  if (mainCareer) {
    try {
      ragContext = retrieveContextForCareer(profile, mainCareer, recScore);
    } catch {
      // Graceful fallback if rag retrieval encounters partial objects
    }
  }

  // 2. Format survey recommendations with exact match scores
  let formattedRecs: Array<{
    title: string;
    careerCluster: string;
    overallScore?: number;
    requiredSkills?: string[];
    salaryInfo?: any;
  }> = [];

  if (recommendations && recommendations.length > 0) {
    formattedRecs = recommendations.slice(0, 5).map(r => ({
      title: r.career?.title || r.title || 'Chuyên viên Công nghệ',
      careerCluster: r.career?.careerCluster || r.careerCluster || 'Khoa học Kỹ thuật',
      overallScore: r.overallScore,
      requiredSkills: r.career?.requiredSkills || r.requiredSkills || [],
      salaryInfo: r.career?.salaryInfo || r.salaryInfo
    }));
  } else if (topCareers && topCareers.length > 0) {
    formattedRecs = topCareers.slice(0, 5).map(c => ({
      title: c.title,
      careerCluster: c.careerCluster,
      requiredSkills: c.requiredSkills,
      salaryInfo: c.salaryInfo
    }));
  }

  // 3. Compute Skill Gap Analysis for the target career
  let skillGapAnalysis: CounselorContextPayload['skillGapAnalysis'] = undefined;
  if (mainCareer) {
    try {
      const gap = analyzeSkillGap(profile, mainCareer);
      skillGapAnalysis = {
        matchedSkills: gap.strongSkills.map(s => s.skill).slice(0, 6),
        developingSkills: gap.developingSkills.map(s => s.skill).slice(0, 6),
        missingSkills: gap.missingSkills.map(s => s.skill).slice(0, 6),
        overallReadiness: Math.round(gap.overallReadiness),
        criticalGaps: gap.missingSkills.filter(s => s.priority === 'High').map(s => s.skill).slice(0, 4)
      };
    } catch {
      // Graceful fallback if skill gap computation encounters edge case
    }
  }

  // 4. Compute Learning Roadmap for the target career
  let roadmapSummary: CounselorContextPayload['roadmapSummary'] = undefined;
  if (mainCareer) {
    try {
      const roadmap = generateLearningRoadmap(profile, mainCareer);
      roadmapSummary = {
        phases: roadmap.phases.slice(0, 4).map(p => ({
          name: p.name,
          duration: p.duration,
          focus: p.objectives.slice(0, 2).join('; '),
          keyActions: p.skillsToLearn.slice(0, 4),
          milestone: p.milestone
        }))
      };
    } catch {
      // Graceful fallback
    }
  }

  // 5. Extract AI Impact, Future Trends & 3-5 Year Horizon Analysis
  const aiImpact: string | undefined = mainCareer?.aiImpact;
  const futureTrends: string | undefined = mainCareer?.futureTrends;
  const progressionPath = mainCareer?.progressionPath;

  let aiImpactAnalysis: CounselorContextPayload['aiImpactAnalysis'] = undefined;
  if (mainCareer) {
    try {
      const fullGap = analyzeSkillGap(profile, mainCareer);
      const impact = analyzeAIImpactAndFutureTrends(mainCareer, profile, fullGap);
      aiImpactAnalysis = {
        timeHorizon: impact.timeHorizon,
        directAiImpact: impact.aiAutomation.directAiImpact,
        assistableTasks: impact.aiAutomation.assistableTasks,
        automatedAspectsSummary: impact.aiAutomation.automatedAspectsSummary,
        humanAdvantageSummary: impact.humanAdvantage.irreplaceableAspectsSummary,
        humanAbilities: impact.humanAdvantage.coreAbilities,
        emergingSkills: impact.skillDemand.emergingSkills,
        marketTrendSummary: impact.skillDemand.marketTrendSummary,
        tailoredAdvice: impact.preparation.tailoredAdvice,
        knownData: impact.groundingAndUncertainty.knownData,
        inferences: impact.groundingAndUncertainty.inferences,
        uncertainties: impact.groundingAndUncertainty.uncertainties
      };
    } catch {
      // Graceful fallback if error
    }
  }

  // 6. Format Career Comparison if multiple careers are compared or available
  let careerComparison: CounselorContextPayload['careerComparison'] = undefined;
  const listToCompare = (comparedCareers && comparedCareers.length > 0)
    ? comparedCareers
    : (topCareers && topCareers.length > 1 ? topCareers.slice(0, 3) : []);

  if (listToCompare.length > 0) {
    careerComparison = listToCompare.map(c => {
      const matchRec = formattedRecs.find(r => r.title.toLowerCase() === c.title.toLowerCase());
      return {
        title: c.title,
        cluster: c.careerCluster,
        matchScore: matchRec?.overallScore,
        requiredSkills: (c.requiredSkills || []).slice(0, 4),
        salary: c.salaryInfo?.rangeDescription || '15 - 30 triệu VNĐ/tháng',
        aiImpact: c.aiImpact,
        futureTrends: c.futureTrends
      };
    });
  }

  return {
    careerTitle: mainCareer?.title || 'Chuyên viên Công nghệ & Phân tích',
    cluster: mainCareer?.careerCluster || 'Khoa học Kỹ thuật',
    tasks: mainCareer?.tasks || ragContext?.tasks || [],
    requiredSkills: mainCareer?.requiredSkills || ragContext?.requiredSkills || [],
    userMatchedSkills: ragContext?.userMatchedSkills || profile.skills || [],
    userMissingSkills: ragContext?.userMissingSkills || [],
    educationPaths: mainCareer?.educationPaths?.map(p => `${p.type}: ${p.duration}`) || ragContext?.educationPaths || [],
    salaryLevel: mainCareer?.salaryInfo?.rangeDescription || ragContext?.salaryLevel || '15 - 25 triệu VNĐ/tháng',
    riasecFitSummary: ragContext?.riasecFitSummary || `Mã Holland: ${profile.riaSecProfile?.code || 'Chưa hoàn tất'}`,
    verifiedAdmissionContext: ragContext?.verifiedAdmissionContext || [],
    surveyRecommendations: formattedRecs,
    skillGapAnalysis,
    roadmapSummary,
    aiImpact,
    futureTrends,
    progressionPath,
    aiImpactAnalysis,
    careerComparison,
    userQuestion,
    profileContext: {
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      ageGroup,
      province: profile.province,
      grade: profile.grade,
      educationLevel: profile.grade || profile.educationLevel,
      favoriteSubjects: profile.favoriteSubjects || [],
      confidentSubjects: profile.confidentSubjects || [],
      academicGPA: profile.academicGPA,
      strengths: profile.strengths || [],
      interests: profile.interests || [],
      skills: profile.skills || [],
      selfRatedSkills: profile.selfRatedSkills || [],
      riasecCode: profile.riaSecProfile?.code,
      riaSecScores: profile.riaSecScores || profile.riaSecProfile?.scores,
      riaSecProfile: profile.riaSecProfile,
      mbtiType: profile.mbtiType,
      mbtiResult: profile.mbtiResult,
      examScores: profile.examScores,
      workPreferences: profile.workPreferences,
      careerPriorities: profile.careerPriorities || [],
      careerReadiness: profile.careerReadiness,
      interestedMajorInput: profile.interestedMajorInput,
      financialConsiderations: profile.financialConsiderations,
      educationPreferences: profile.educationPreferences
    }
  };
}
