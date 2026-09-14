import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { WorkflowStepper } from './components/WorkflowStepper';
import { HomeLandingView } from './components/HomeLandingView';
import { Step1ComprehensiveInfoView } from './components/Step1ComprehensiveInfoView';
import { Step2RIASECExamView } from './components/Step2RIASECExamView';
import { Step3MBTIExamView } from './components/Step3MBTIExamView';
import { Step4ComprehensiveReportView } from './components/Step4ComprehensiveReportView';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { CareerDetailModal } from './components/CareerDetailModal';
import { DebugResearchModal } from './components/DebugResearchModal';
import { AIModelManagerModal } from './components/AIModelManagerModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { UserProfile, AgeGroup, Career, ScoringWeights, LLMConfig } from './types';
import { DEMO_PROFILES } from './data/demoProfiles';
import { CAREER_DATABASE } from './data/careers';
import { generateRecommendations, DEFAULT_SCORING_WEIGHTS } from './engine/recommendationEngine';
import { useLanguage } from './context/LanguageContext';
import { createEmptyProfile } from './utils/ageGroupUtils';

export default function App() {
  const { language } = useLanguage();

  // Mode: 'home' for Landing Page, 'exam' for the 4-step Sequential Pipeline
  const [viewMode, setViewMode] = useState<'home' | 'exam'>('home');

  // Sequential Steps: 1 (Info/Exams), 2 (RIASEC), 3 (MBTI), 4 (Summary & AI Counselor)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highestUnlockedStep, setHighestUnlockedStep] = useState<number>(1);

  // Active user profile - starts strictly empty with placeholders as requested
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => createEmptyProfile('15-18'));
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  const [examSessionKey, setExamSessionKey] = useState<number>(0);

  // AI LLM Manager state
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'gemini',
    modelName: 'gemini-3.8-flash',
    customEndpoint: 'http://localhost:11434',
    temperature: 0.7,
    systemPromptStyle: 'balanced'
  });
  const [isAIModelModalOpen, setIsAIModelModalOpen] = useState<boolean>(false);

  // Modals
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [selectedCareerForModal, setSelectedCareerForModal] = useState<Career | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);

  // Deterministic recommendations recalculated whenever profile or weights change
  const recommendations = useMemo(() => {
    return generateRecommendations(activeProfile, CAREER_DATABASE, scoringWeights);
  }, [activeProfile, scoringWeights]);

  // Start examination from Home
  const handleStartExam = () => {
    setViewMode('exam');
    setCurrentStep(1);
  };

  // Load a demo profile and unlock steps for rapid testing / evaluation
  const handleLoadDemoProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
    setHighestUnlockedStep(4);
  };

  // Step advancement logic strictly enforcing sequential progression
  const handleAdvanceToStep2 = () => {
    setHighestUnlockedStep(prev => Math.max(prev, 2));
    setCurrentStep(2);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceToStep3 = () => {
    setHighestUnlockedStep(prev => Math.max(prev, 3));
    setCurrentStep(3);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceToStep4 = () => {
    setHighestUnlockedStep(prev => Math.max(prev, 4));
    setCurrentStep(4);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartExam = () => {
    // 1. Completely reset profile to a fresh blank profile without lingering data
    const freshProfile = createEmptyProfile('15-18');
    setActiveProfile(freshProfile);

    // 2. Reset step progression
    setHighestUnlockedStep(1);
    setCurrentStep(1);
    setViewMode('home');

    // 3. Wipe all browser storage to ensure nothing is retained
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear error:', e);
    }

    // 4. Invalidate session key to unmount and destroy all internal step state
    setExamSessionKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch age group
  const handleSelectAgeGroup = (ageGroup: AgeGroup) => {
    if (ageGroup === '7-10') handleLoadDemoProfile(DEMO_PROFILES['demo-kid-explorer']);
    else if (ageGroup === '11-14') {
      const p = {
        ...DEMO_PROFILES['demo-kid-explorer'],
        age: 13,
        ageGroup: '11-14' as AgeGroup,
        name: 'Minh Khang (THCS Khám phá)'
      };
      handleLoadDemoProfile(p);
    } else if (ageGroup === '15-18') handleLoadDemoProfile(DEMO_PROFILES['demo-hs-tech']);
    else if (ageGroup === '19-24') handleLoadDemoProfile(DEMO_PROFILES['demo-college-cs']);
    else handleLoadDemoProfile(DEMO_PROFILES['demo-adult-changer']);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        highestUnlockedStep={highestUnlockedStep}
        onSelectStep={step => {
          setViewMode('exam');
          setCurrentStep(step);
        }}
        activeProfile={activeProfile}
        onSelectProfile={handleLoadDemoProfile}
        onSelectAgeGroup={handleSelectAgeGroup}
        isDebugOpen={isDebugOpen}
        setIsDebugOpen={setIsDebugOpen}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onOpenAIModelModal={() => setIsAIModelModalOpen(true)}
        onRestartWorkflow={handleRestartExam}
        llmConfig={llmConfig}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        {/* Rule-based 4-Step Sequential Stepper Bar - Only shown in examination mode */}
        {viewMode === 'exam' && (
          <WorkflowStepper
            currentStep={currentStep}
            highestUnlockedStep={highestUnlockedStep}
            onSelectStep={step => {
              setViewMode('exam');
              setCurrentStep(step);
            }}
            onGoHome={handleGoHome}
            onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
            isHomeActive={viewMode === 'home'}
          />
        )}

        {/* 1. GIAO DIỆN TRANG CHỦ (Home Landing) */}
        <ErrorBoundary fallbackTitle="Không thể tải nội dung khảo sát" onReset={handleRestartExam}>
          {viewMode === 'home' && (
            <HomeLandingView
              onStartExam={handleStartExam}
              onLoadDemoProfile={handleLoadDemoProfile}
              activeProfile={activeProfile}
            />
          )}

          {/* 2. QUY TRÌNH KIỂM TRA TUẦN TỰ 4 TRANG */}
          {viewMode === 'exam' && currentStep === 1 && (
            <Step1ComprehensiveInfoView
              key={`step1-${activeProfile.id}-${examSessionKey}`}
              profile={activeProfile}
              onUpdateProfile={setActiveProfile}
              onAdvanceToStep2={handleAdvanceToStep2}
              onLoadDemoProfile={handleLoadDemoProfile}
            />
          )}

          {viewMode === 'exam' && currentStep === 2 && (
            <Step2RIASECExamView
              key={`step2-${activeProfile.id}-${examSessionKey}`}
              profile={activeProfile}
              onUpdateProfile={setActiveProfile}
              onBackToStep1={() => setCurrentStep(1)}
              onAdvanceToStep3={handleAdvanceToStep3}
            />
          )}

          {viewMode === 'exam' && currentStep === 3 && (
            <Step3MBTIExamView
              key={`step3-${activeProfile.id}-${examSessionKey}`}
              profile={activeProfile}
              onUpdateProfile={setActiveProfile}
              onBackToStep2={() => setCurrentStep(2)}
              onAdvanceToStep4={handleAdvanceToStep4}
            />
          )}

          {viewMode === 'exam' && currentStep === 4 && (
            <Step4ComprehensiveReportView
              key={`step4-${activeProfile.id}-${examSessionKey}`}
              profile={activeProfile}
              onBackToStep3={() => setCurrentStep(3)}
              onRestartExam={handleRestartExam}
              onViewCareerDetail={setSelectedCareerForModal}
              llmConfig={llmConfig}
              onUpdateLlmConfig={setLlmConfig}
              onOpenAIModelModal={() => setIsAIModelModalOpen(true)}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* AI Model Manager & Local LLM Connector Modal */}
      <AIModelManagerModal
        isOpen={isAIModelModalOpen}
        onClose={() => setIsAIModelModalOpen(false)}
        config={llmConfig}
        onSaveConfig={setLlmConfig}
      />

      {/* System Architecture Diagram Modal */}
      <SystemArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        currentStep={currentStep}
      />

      {/* Career Detail Modal */}
      <CareerDetailModal
        career={selectedCareerForModal}
        profile={activeProfile}
        recScore={
          selectedCareerForModal
            ? recommendations.find(r => r.careerId === selectedCareerForModal.id)
            : undefined
        }
        onClose={() => setSelectedCareerForModal(null)}
        onOpenCounselor={() => {
          setSelectedCareerForModal(null);
          setCurrentStep(4);
          setViewMode('exam');
        }}
        onToggleCompare={() => {}}
        isCompared={false}
      />

      {/* Scientific Research & Evaluation Inspector Modal */}
      <DebugResearchModal
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        profile={activeProfile}
        recommendations={recommendations}
        weights={scoringWeights}
        onUpdateWeights={setScoringWeights}
      />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">EduPath AI</span>
            <span>— Quy trình Khảo sát Hướng nghiệp Tuần tự 4 Bước Chuẩn mực</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Sơ đồ Kiến trúc Hệ thống
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDebugOpen(true)}
              className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
            >
              Hội đồng & Trọng số
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
