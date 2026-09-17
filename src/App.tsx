import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { AdminDataPipelineModal } from './components/AdminDataPipelineModal';
import { DataTransparencyModal } from './components/DataTransparencyModal';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { ErrorBoundary } from './components/ErrorBoundary';

import { UserProfile, AgeGroup, Career, ScoringWeights, LLMConfig } from './types';
import { DEMO_PROFILES } from './data/demoProfiles';
import { CAREER_DATABASE } from './data/careers';
import { generateRecommendations, DEFAULT_SCORING_WEIGHTS } from './engine/recommendationEngine';
import { useLanguage } from './context/LanguageContext';
import { useAdminAuth } from './context/AdminAuthContext';
import { createEmptyProfile } from './utils/ageGroupUtils';
import { playClickSound, playSuccessSound, playTransitionSound } from './utils/soundUtils';

type AppViewMode = 'home' | 'exam' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const { language } = useLanguage();
  const { isAuthenticated, adminUser, isLoading: isAuthLoading } = useAdminAuth();

  // Mode: 'home' for Landing Page, 'exam' for the 4-step Sequential Pipeline, 'admin-login', 'admin-dashboard'
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.startsWith('/admin/login')) return 'admin-login';
      if (p.startsWith('/admin')) return 'admin-dashboard';
    }
    return 'home';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p.startsWith('/admin/login')) {
        setViewMode('admin-login');
      } else if (p.startsWith('/admin')) {
        setViewMode('admin-dashboard');
      } else {
        setViewMode(prev => (prev === 'admin-login' || prev === 'admin-dashboard' ? 'home' : prev));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  const [isDataPipelineModalOpen, setIsDataPipelineModalOpen] = useState<boolean>(false);
  const [isDataTransparencyOpen, setIsDataTransparencyOpen] = useState<boolean>(false);
  const [selectedCareerForModal, setSelectedCareerForModal] = useState<Career | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);

  // Security guard: Only authenticated ADMIN can open KHKT jury inspector mode
  useEffect(() => {
    if (!isAuthenticated || adminUser?.role !== 'ADMIN') {
      setIsDebugOpen(false);
    }
  }, [isAuthenticated, adminUser]);

  const handleSetIsDebugOpen = (open: boolean) => {
    if (open) {
      if (isAuthenticated && adminUser?.role === 'ADMIN') {
        setIsDebugOpen(true);
      } else {
        handleNavigateToAdminLogin();
      }
    } else {
      setIsDebugOpen(false);
    }
  };

  // Navigation helpers
  const handleGoHome = () => {
    setViewMode('home');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdminLogin = () => {
    setViewMode('admin-login');
    if (window.location.pathname !== '/admin/login') {
      window.history.pushState(null, '', '/admin/login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Immediate 1-click transition to admin dashboard upon successful credential validation
  const handleLoginSuccess = () => {
    setViewMode('admin-dashboard');
    if (window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdminDashboard = () => {
    if (isAuthenticated && adminUser?.role === 'ADMIN') {
      setViewMode('admin-dashboard');
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else {
      handleNavigateToAdminLogin();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset back to initial home page whenever admin logs out or auth is invalidated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && viewMode === 'admin-dashboard') {
      handleGoHome();
    }
  }, [isAuthenticated, isAuthLoading, viewMode]);

  // Deterministic recommendations recalculated whenever profile or weights change
  const recommendations = useMemo(() => {
    return generateRecommendations(activeProfile, CAREER_DATABASE, scoringWeights);
  }, [activeProfile, scoringWeights]);

  // Start examination from Home
  const handleStartExam = () => {
    playTransitionSound();
    setViewMode('exam');
    setCurrentStep(1);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Load a demo profile and unlock steps for rapid testing / evaluation
  const handleLoadDemoProfile = (profile: UserProfile) => {
    playSuccessSound();
    setActiveProfile(profile);
    setHighestUnlockedStep(4);
  };

  // Step advancement logic strictly enforcing sequential progression
  const handleAdvanceToStep2 = () => {
    playTransitionSound();
    setHighestUnlockedStep(prev => Math.max(prev, 2));
    setCurrentStep(2);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceToStep3 = () => {
    playTransitionSound();
    setHighestUnlockedStep(prev => Math.max(prev, 3));
    setCurrentStep(3);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceToStep4 = () => {
    playSuccessSound();
    setHighestUnlockedStep(prev => Math.max(prev, 4));
    setCurrentStep(4);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartExam = () => {
    playTransitionSound();
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
          if (step <= highestUnlockedStep) {
            setViewMode('exam');
            setCurrentStep(step);
          }
        }}
        activeProfile={activeProfile}
        onSelectProfile={handleLoadDemoProfile}
        onSelectAgeGroup={handleSelectAgeGroup}
        isDebugOpen={isDebugOpen}
        setIsDebugOpen={handleSetIsDebugOpen}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onOpenAIModelModal={() => setIsAIModelModalOpen(true)}
        onOpenDataPipelineModal={() => setIsDataPipelineModalOpen(true)}
        onOpenDataTransparency={() => setIsDataTransparencyOpen(true)}
        onNavigateToAdmin={handleNavigateToAdminDashboard}
        onNavigateToAdminLogin={handleNavigateToAdminLogin}
        onRestartWorkflow={handleRestartExam}
        llmConfig={llmConfig}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        {/* 0. CHẾ ĐỘ QUẢN TRỊ VIÊN (Admin Views) */}
        {viewMode === 'admin-login' && (
          <AdminLoginView
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={handleGoHome}
          />
        )}

        {viewMode === 'admin-dashboard' && (
          <AdminDashboardView
            onBackToHome={handleGoHome}
            onLogout={handleGoHome}
            onOpenDebugModal={() => setIsDebugOpen(true)}
          />
        )}

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
          <AnimatePresence mode="wait">
            {viewMode === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HomeLandingView
                  onStartExam={handleStartExam}
                  onLoadDemoProfile={handleLoadDemoProfile}
                  activeProfile={activeProfile}
                />
              </motion.div>
            )}

            {/* 2. QUY TRÌNH KIỂM TRA TUẦN TỰ 4 TRANG */}
            {viewMode === 'exam' && currentStep === 1 && (
              <motion.div
                key={`step1-${activeProfile.id}-${examSessionKey}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Step1ComprehensiveInfoView
                  profile={activeProfile}
                  onUpdateProfile={setActiveProfile}
                  onAdvanceToStep2={handleAdvanceToStep2}
                  onLoadDemoProfile={handleLoadDemoProfile}
                />
              </motion.div>
            )}

            {viewMode === 'exam' && currentStep === 2 && (
              <motion.div
                key={`step2-${activeProfile.id}-${examSessionKey}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Step2RIASECExamView
                  profile={activeProfile}
                  onUpdateProfile={setActiveProfile}
                  onBackToStep1={() => setCurrentStep(1)}
                  onAdvanceToStep3={handleAdvanceToStep3}
                />
              </motion.div>
            )}

            {viewMode === 'exam' && currentStep === 3 && (
              <motion.div
                key={`step3-${activeProfile.id}-${examSessionKey}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Step3MBTIExamView
                  profile={activeProfile}
                  onUpdateProfile={setActiveProfile}
                  onBackToStep2={() => setCurrentStep(2)}
                  onAdvanceToStep4={handleAdvanceToStep4}
                />
              </motion.div>
            )}

            {viewMode === 'exam' && currentStep === 4 && (
              <motion.div
                key={`step4-${activeProfile.id}-${examSessionKey}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <Step4ComprehensiveReportView
                  profile={activeProfile}
                  onBackToStep3={() => setCurrentStep(3)}
                  onRestartExam={handleRestartExam}
                  onViewCareerDetail={setSelectedCareerForModal}
                  llmConfig={llmConfig}
                  onUpdateLlmConfig={setLlmConfig}
                  onOpenAIModelModal={() => setIsAIModelModalOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
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

      {/* Scientific Research & Evaluation Inspector Modal (Admin / Jury Only) */}
      {isAuthenticated && adminUser?.role === 'ADMIN' && (
        <DebugResearchModal
          isOpen={isDebugOpen}
          onClose={() => setIsDebugOpen(false)}
          profile={activeProfile}
          recommendations={recommendations}
          weights={scoringWeights}
          onUpdateWeights={setScoringWeights}
        />
      )}

      {/* Public Admission Data Transparency Modal */}
      <DataTransparencyModal
        isOpen={isDataTransparencyOpen}
        onClose={() => setIsDataTransparencyOpen(false)}
      />

      {/* Admission & Career Data Update Pipeline Modal (For Admins) */}
      <AdminDataPipelineModal
        isOpen={isDataPipelineModalOpen}
        onClose={() => setIsDataPipelineModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="font-bold text-slate-800">Shape Your Future!</span>
            <span>— Hệ thống hỗ trợ khám phá sở thích & xu hướng nghề nghiệp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
