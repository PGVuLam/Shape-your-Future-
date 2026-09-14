import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Zap,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UserProfile, AssessmentQuestion, RIASECDimension } from '../types';
import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { useLanguage } from '../context/LanguageContext';

interface Step1AssessmentViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onAdvanceToStep2: () => void;
  onLoadDemoProfile: (profile: UserProfile) => void;
}

export const Step1AssessmentView: React.FC<Step1AssessmentViewProps> = ({
  profile,
  onUpdateProfile,
  onAdvanceToStep2,
  onLoadDemoProfile
}) => {
  const { language } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  const questions = ASSESSMENT_QUESTIONS;
  const currentQuestion = questions[currentQIndex];

  const handleSelectOption = (questionId: string, val: string, isMulti: boolean) => {
    setAnswers(prev => {
      if (!isMulti) {
        return { ...prev, [questionId]: val };
      }
      const existing = (prev[questionId] as string[]) || [];
      if (existing.includes(val)) {
        return { ...prev, [questionId]: existing.filter(x => x !== val) };
      } else {
        return { ...prev, [questionId]: [...existing, val] };
      }
    });
  };

  const answeredCount = Object.keys(answers).filter(k => {
    const val = answers[k];
    return Array.isArray(val) ? val.length > 0 : Boolean(val);
  }).length;

  const isCompleted = answeredCount >= Math.min(4, questions.length);

  // Compile answers into structured profile
  const handleCompleteAssessment = () => {
    const updated: UserProfile = JSON.parse(JSON.stringify(profile));
    const riaSecDeltas: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const newInterests: string[] = [...(updated.interests || [])];
    const newSkills: string[] = [...(updated.skills || [])];
    const newSubjects: string[] = [...(updated.favoriteSubjects || [])];

    let mbtiTraits = { IE: 'I', SN: 'N', TF: 'T', JP: 'J' };

    questions.forEach(q => {
      const ans = answers[q.id];
      if (!ans) return;

      const chosenOptions = q.options.filter(opt =>
        Array.isArray(ans) ? ans.includes(opt.value) : ans === opt.value
      );

      chosenOptions.forEach(opt => {
        if (opt.riasecWeight) {
          Object.entries(opt.riasecWeight).forEach(([dim, weight]) => {
            riaSecDeltas[dim] = (riaSecDeltas[dim] || 0) + (weight || 0);
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
        if (opt.mbtiWeight) {
          const { dimension, value } = opt.mbtiWeight;
          mbtiTraits = { ...mbtiTraits, [dimension]: value };
        }
      });
    });

    // Normalize RIASEC
    const maxVal = Math.max(...Object.values(riaSecDeltas), 1);
    Object.keys(riaSecDeltas).forEach(dim => {
      if (riaSecDeltas[dim] > 0) {
        updated.riaSecScores[dim] = Math.min(
          1.0,
          Math.max(0.3, Math.round((riaSecDeltas[dim] / maxVal) * 95) / 100)
        );
      }
    });

    const sortedDims = Object.entries(updated.riaSecScores).sort((a, b) => b[1] - a[1]);
    const primary = sortedDims[0][0] as RIASECDimension;
    const secondary = sortedDims[1][0] as RIASECDimension;
    const tertiary = sortedDims[2][0] as RIASECDimension;
    const code = `${primary}${secondary}${tertiary}`;

    updated.riaSecProfile = {
      scores: updated.riaSecScores,
      primary,
      secondary,
      tertiary,
      code,
      confidence: 0.94,
      description: `Mã Holland ${code}: Ưu thế vượt trội ở ${primary} và ${secondary}.`
    };

    const mbtiString = `${mbtiTraits.IE}${mbtiTraits.SN}${mbtiTraits.TF}${mbtiTraits.JP}`;
    updated.mbtiType = mbtiString;
    if (updated.mbtiResult) {
      updated.mbtiResult.type = mbtiString;
    }

    updated.interests = newInterests.slice(0, 8);
    updated.skills = newSkills.slice(0, 8);
    updated.favoriteSubjects = newSubjects.slice(0, 6);
    updated.completenessPercentage = 100;
    updated.assessmentTimestamp = Date.now();

    onUpdateProfile(updated);
    onAdvanceToStep2();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Step Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>{language === 'vi' ? 'BƯỚC 1: KHẢO SÁT & ĐẦU VÀO NGƯỜI DÙNG' : 'STEP 1: USER INPUT / ASSESSMENT'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'vi' ? 'Thu thập Dữ liệu Năng lực & Tâm lý' : 'Collect Competency & Psychological Profile'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'vi'
              ? 'Khảo sát 6 chiều Holland RIASEC, MBTI phụ trợ, môn học thế mạnh, kỹ năng và mục tiêu nghề nghiệp.'
              : 'Assessing RIASEC 6 dimensions, supplementary MBTI, subjects, skills and career goals.'}
          </p>
        </div>

        {/* Quick Demo Loader for Judges / Students */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            {language === 'vi' ? 'Nạp hồ sơ mẫu thử nhanh:' : 'Quick demo profile:'}
          </span>
          <button
            onClick={() => {
              onLoadDemoProfile(DEMO_PROFILES['demo-hs-tech']);
              onAdvanceToStep2();
            }}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors text-[11px]"
          >
            Minh Tuấn (STEM)
          </button>
          <button
            onClick={() => {
              onLoadDemoProfile(DEMO_PROFILES['demo-college-cs']);
              onAdvanceToStep2();
            }}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors text-[11px]"
          >
            Khánh Linh (AI/Data)
          </button>
        </div>
      </div>

      {/* Progress meter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-700">
            {language === 'vi'
              ? `Tiến độ khảo sát: ${answeredCount}/${questions.length} tiêu chí`
              : `Survey progress: ${answeredCount}/${questions.length} criteria`}
          </span>
          <span className="text-indigo-600 font-bold">
            {Math.round((answeredCount / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Interactive Questions Carousel / Cards */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentQIndex;
          const userAns = answers[q.id];
          const isAnswered = Array.isArray(userAns) ? userAns.length > 0 : Boolean(userAns);
          const isMulti = q.type === 'multi-choice';

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                isCurrent
                  ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100'
                  : isAnswered
                  ? 'border-emerald-200/80 bg-emerald-50/20'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <span>MÔ-ĐUN: {q.module.toUpperCase()}</span>
                    <span>•</span>
                    <span>{isMulti ? (language === 'vi' ? 'Chọn nhiều' : 'Multi-choice') : (language === 'vi' ? 'Chọn một' : 'Single-choice')}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{q.prompt}</h3>
                  {q.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{q.description}</p>
                  )}
                </div>

                {isAnswered && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'vi' ? 'Đã chọn' : 'Answered'}
                  </span>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map(opt => {
                  const isSelected = isMulti
                    ? ((userAns as string[]) || []).includes(opt.value)
                    : userAns === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(q.id, opt.value, isMulti)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center space-x-2.5 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                          : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {opt.emoji && <span className="text-base">{opt.emoji}</span>}
                      <span className="flex-1">{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion & Advance Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4">
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-900 block sm:inline">
            {language === 'vi' ? 'Quy tắc thi cử:' : 'Examination Rule:'}
          </span>{' '}
          {isCompleted ? (
            <span className="text-emerald-700 font-semibold">
              {language === 'vi' ? 'Đã đủ điều kiện dữ liệu để chuẩn hóa hồ sơ.' : 'Ready to compile structured profile.'}
            </span>
          ) : (
            <span className="text-amber-700 font-semibold">
              {language === 'vi' ? 'Cần trả lời tối thiểu 4 câu hỏi để mở khóa Bước 2.' : 'Complete at least 4 questions to unlock Step 2.'}
            </span>
          )}
        </div>

        <button
          id="btn-advance-to-step2"
          onClick={handleCompleteAssessment}
          disabled={!isCompleted}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-sm ${
            isCompleted
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{language === 'vi' ? 'Xác nhận & Chuyển sang Bước 2: Chuẩn hóa Hồ sơ' : 'Confirm & Proceed to Step 2: Structured Profile'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
