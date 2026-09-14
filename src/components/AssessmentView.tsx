import React, { useState } from 'react';
import {
  CheckCircle2,
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { UserProfile, AssessmentQuestion, RIASECDimension } from '../types';
import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';
import { useLanguage } from '../context/LanguageContext';

interface AssessmentViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onComplete: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  profile,
  onUpdateProfile,
  onComplete
}) => {
  const { language, t } = useLanguage();
  // Filter questions for user's age group
  const questions = ASSESSMENT_QUESTIONS.filter(q => q.ageGroups.includes(profile.ageGroup));

  // State to hold answers
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);

  const activeQuestion: AssessmentQuestion | undefined = questions[currentStep];

  const handleSingleSelect = (questionId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleMultiSelect = (questionId: string, val: string) => {
    setAnswers(prev => {
      const existing = (prev[questionId] as string[]) || [];
      if (existing.includes(val)) {
        return { ...prev, [questionId]: existing.filter(x => x !== val) };
      } else {
        return { ...prev, [questionId]: [...existing, val] };
      }
    });
  };

  const handleFinish = () => {
    // Process answers into profile updates
    const updatedProfile: UserProfile = JSON.parse(JSON.stringify(profile));

    const riaSecDeltas: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const newInterests: string[] = [...(updatedProfile.interests || [])];
    const newSkills: string[] = [...(updatedProfile.skills || [])];
    const newSubjects: string[] = [...(updatedProfile.favoriteSubjects || [])];

    questions.forEach(q => {
      const ans = answers[q.id];
      if (!ans) return;

      const chosenOptions = q.options.filter(opt =>
        Array.isArray(ans) ? ans.includes(opt.value) : ans === opt.value
      );

      chosenOptions.forEach(opt => {
        if (opt.riasecWeight) {
          Object.entries(opt.riasecWeight).forEach(([dim, weight]) => {
            riaSecDeltas[dim] = (riaSecDeltas[dim] || 0) + weight;
          });
        }
        if (opt.interestTags) {
          opt.interestTags.forEach(t => {
            if (!newInterests.includes(t)) newInterests.push(t);
          });
        }
        if (opt.skillTags) {
          opt.skillTags.forEach(s => {
            if (!newSkills.includes(s)) newSkills.push(s);
          });
        }
        if (opt.subjectTags) {
          opt.subjectTags.forEach(s => {
            if (!newSubjects.includes(s)) newSubjects.push(s);
          });
        }
      });
    });

    // Normalize updated RIASEC scores
    const maxDelta = Math.max(...Object.values(riaSecDeltas), 1);
    Object.keys(riaSecDeltas).forEach(dim => {
      if (riaSecDeltas[dim] > 0) {
        updatedProfile.riaSecScores[dim] = Math.min(
          1.0,
          Math.max(0.2, Math.round((riaSecDeltas[dim] / maxDelta) * 90) / 100)
        );
      }
    });

    // Sort to determine primary Holland code
    const sortedDims = Object.entries(updatedProfile.riaSecScores).sort((a, b) => b[1] - a[1]);
    const primary = sortedDims[0][0] as RIASECDimension;
    const secondary = sortedDims[1][0] as RIASECDimension;
    const tertiary = sortedDims[2][0] as RIASECDimension;
    const code = `${primary}${secondary}${tertiary}`;

    updatedProfile.riaSecProfile = {
      scores: updatedProfile.riaSecScores,
      primary,
      secondary,
      tertiary,
      code,
      confidence: 0.92,
      description: `Holland Profile ${code}: High alignment in ${primary} and ${secondary}.`
    };

    updatedProfile.interests = newInterests;
    updatedProfile.skills = newSkills;
    updatedProfile.favoriteSubjects = newSubjects;
    updatedProfile.completenessPercentage = 100;
    updatedProfile.assessmentTimestamp = Date.now();

    onUpdateProfile(updatedProfile);
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Assessment Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {t.assessmentTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {t.ageGroup} {profile.ageGroup} ({profile.age} {language === 'vi' ? 'tuổi' : 'yrs'})
          </span>
        </div>
        <p className="text-xs text-slate-500">
          {t.assessmentDesc}
        </p>

        {/* Progress Bar */}
        <div className="pt-2 space-y-1">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>
              {language === 'vi'
                ? `Câu hỏi ${currentStep + 1} trên tổng số ${questions.length}`
                : `Question ${currentStep + 1} of ${questions.length}`}
            </span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Question Card */}
      {activeQuestion && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              {language === 'vi' ? 'HỌC PHẦN:' : 'MODULE:'} {activeQuestion.module.toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-slate-900">{activeQuestion.prompt}</h3>
            {activeQuestion.description && (
              <p className="text-xs text-slate-500">{activeQuestion.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {activeQuestion.options.map(option => {
              const currentVal = answers[activeQuestion.id];
              const isSelected =
                activeQuestion.type === 'single-choice'
                  ? currentVal === option.value
                  : Array.isArray(currentVal) && currentVal.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (activeQuestion.type === 'single-choice') {
                      handleSingleSelect(activeQuestion.id, option.value);
                    } else {
                      handleMultiSelect(activeQuestion.id, option.value);
                    }
                  }}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-semibold shadow-sm'
                      : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {option.emoji && <span className="text-xl">{option.emoji}</span>}
                    <span className="text-xs sm:text-sm">{option.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.previous}</span>
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>{t.next}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.submitAssessment}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Psychological Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
        <span className="font-semibold text-slate-800">
          {language === 'vi' ? 'Khuyến cáo Khoa học Hướng nghiệp:' : 'Scientific Compass Notice:'}
        </span>
        <p>
          {language === 'vi'
            ? 'EduPath AI hoạt động như một kim chỉ nam khám phá. Hồ sơ năng lực và sở thích của bạn sẽ liên tục phát triển qua các dự án cọ xát thực tế, học tập và trải nghiệm cá nhân.'
            : 'EduPath AI operates as an exploratory guide. Your vocational profile is dynamic and evolves with practice, curiosity, and hands-on projects. No algorithm can dictate your life choices.'}
        </p>
      </div>
    </div>
  );
};
