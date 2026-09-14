import React from 'react';
import { CheckCircle2, Lock, ArrowRight, Network, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface WorkflowStep {
  id: number;
  key: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    key: 'step-1-info',
    titleVi: '1. Thông tin & Học tập',
    titleEn: '1. User Profile & Exams',
    descVi: 'Điểm GPA, HSA, V-ACT, TSA, THPT, Kỹ năng',
    descEn: 'GPA, HSA, V-ACT, TSA, THPT, Skills'
  },
  {
    id: 2,
    key: 'step-2-riasec',
    titleVi: '2. Đánh giá RIASEC',
    titleEn: '2. RIASEC Assessment',
    descVi: 'Mã Holland, 6 nhóm sở thích (chưa tư vấn nghề)',
    descEn: 'Holland code, 6 dimensions'
  },
  {
    id: 3,
    key: 'step-3-mbti',
    titleVi: '3. Đánh giá MBTI',
    titleEn: '3. MBTI Assessment',
    descVi: '16 nhóm tính cách, tư duy (chưa tư vấn nghề)',
    descEn: '16 MBTI archetypes & cognitive styles'
  },
  {
    id: 4,
    key: 'step-4-report',
    titleVi: '4. Báo cáo & Cố vấn AI',
    titleEn: '4. Top Careers, Unis & AI',
    descVi: 'Tính điểm khoa học, Top trường & Chatbot Local LLM',
    descEn: 'Scientific matching, Top Unis & Local LLM'
  }
];

interface WorkflowStepperProps {
  currentStep: number;
  highestUnlockedStep: number;
  onSelectStep: (stepId: number) => void;
  onGoHome: () => void;
  onOpenArchitectureModal: () => void;
  isHomeActive: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  highestUnlockedStep,
  onSelectStep,
  onGoHome,
  onOpenArchitectureModal,
  isHomeActive
}) => {
  const { language } = useLanguage();
  const [lockedNotice, setLockedNotice] = React.useState<string | null>(null);

  const handleStepClick = (stepId: number) => {
    if (stepId > highestUnlockedStep) {
      const msg =
        language === 'vi'
          ? `🔒 Quy tắc thi cử tuần tự: Vui lòng hoàn thành Trang ${stepId - 1} để mở khóa trang này!`
          : `🔒 Sequential rule: Please complete Step ${stepId - 1} to unlock this step!`;
      setLockedNotice(msg);
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }
    onSelectStep(stepId);
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs mb-6">
      {/* Top bar with architecture diagram and home button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={onGoHome}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              isHomeActive
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang Chủ</span>
          </button>

          <span className="text-slate-300">|</span>

          <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            {language === 'vi' ? 'Quy trình Khảo sát Tuần tự 4 Trang' : '4-Step Sequential Examination Flow'}
          </span>

          {!isHomeActive && (
            <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold">
              {language === 'vi' ? `Trang hiện tại: ${currentStep} / 4` : `Page: ${currentStep} / 4`}
            </span>
          )}
        </div>

        <button
          id="btn-view-system-architecture"
          onClick={onOpenArchitectureModal}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors border border-indigo-200/60 cursor-pointer"
          title={language === 'vi' ? 'Xem sơ đồ kiến trúc hệ thống' : 'View system architecture diagram'}
        >
          <Network className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Sơ đồ Kiến trúc' : 'Architecture'}</span>
        </button>
      </div>

      {/* Locked step notification toast */}
      {lockedNotice && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center justify-between animate-in fade-in duration-200">
          <span>{lockedNotice}</span>
          <button
            onClick={() => setLockedNotice(null)}
            className="text-amber-600 hover:text-amber-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Sequential Steps Pipeline Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {WORKFLOW_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = !isHomeActive && step.id === currentStep;
          const isLocked = step.id > highestUnlockedStep;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                  : isCompleted
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-800 hover:bg-emerald-100/60'
                  : isLocked
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {/* Step Status Badge & Number */}
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isCurrent
                      ? 'bg-indigo-500/80 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  TRANG {step.id}
                </span>

                <div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-indigo-300 animate-ping" />
                  )}
                </div>
              </div>

              {/* Step Title */}
              <div className="font-bold text-xs leading-tight line-clamp-1">
                {language === 'vi' ? step.titleVi : step.titleEn}
              </div>

              {/* Step Subtitle */}
              <div
                className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                  isCurrent ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                {language === 'vi' ? step.descVi : step.descEn}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
