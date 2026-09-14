import React, { useState } from 'react';
import {
  BrainCircuit,
  Map,
  Scale,
  Sparkles,
  MessageSquare,
  Users,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Career, RecommendationScore } from '../types';
import { LearningRoadmapView } from './LearningRoadmapView';
import { CareerComparisonView } from './CareerComparisonView';
import { WhatIfSimulationView } from './WhatIfSimulationView';
import { AICounselorView } from './AICounselorView';
import { ParentTeacherView } from './ParentTeacherView';
import { useLanguage } from '../context/LanguageContext';

interface Step5DeepDiveViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
  onBackToStep4: () => void;
  onRestartWorkflow: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const Step5DeepDiveView: React.FC<Step5DeepDiveViewProps> = ({
  profile,
  recommendations,
  onSelectCareer,
  onBackToStep4,
  onRestartWorkflow,
  onUpdateProfile
}) => {
  const { language } = useLanguage();
  const [subTab, setSubTab] = useState<'roadmap' | 'compare' | 'whatif' | 'counselor' | 'family'>('roadmap');

  const topCareer = recommendations[0]?.career;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>{language === 'vi' ? 'BƯỚC 5: TẦNG RAG & CỐ VẤN AI GIẢI THÍCH CHUYÊN SÂU' : 'STEP 5: RAG & AI COUNSELOR DEEP DIVE'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'vi' ? 'Giải thích Chuyên sâu, Lộ trình & Mô phỏng' : 'In-depth Explanation, Roadmap & Simulations'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'vi'
              ? 'Mô hình RAG & Cố vấn AI phân tích vì sao nghề phù hợp, lập lộ trình 4 giai đoạn và giải đáp thắc mắc.'
              : 'RAG & AI Counselor explaining why careers fit, generating 4-phase roadmap and answering questions.'}
          </p>
        </div>

        {/* Rule note: LLM does not decide */}
        <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-[11px] font-semibold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{language === 'vi' ? 'LLM KHÔNG tự quyết định nghề từ đầu mà chỉ giải thích chuyên sâu' : 'LLM explains grounded data; does not decide ranking'}</span>
        </div>
      </div>

      {/* Sub-Tabs for the 5 Deep Dive Modules */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab('roadmap')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            subTab === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? '1. Lộ trình Học tập (Roadmap)' : '1. Learning Roadmap'}</span>
        </button>

        <button
          onClick={() => setSubTab('compare')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            subTab === 'compare'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? '2. So sánh Nghề nghiệp' : '2. Compare Careers'}</span>
        </button>

        <button
          onClick={() => setSubTab('whatif')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            subTab === 'whatif'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? '3. Mô phỏng What-If' : '3. What-If Simulation'}</span>
        </button>

        <button
          onClick={() => setSubTab('counselor')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            subTab === 'counselor'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? '4. Cố vấn AI RAG ("Vì sao phù hợp?")' : '4. AI Counselor RAG'}</span>
        </button>

        <button
          onClick={() => setSubTab('family')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            subTab === 'family'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? '5. Góc Cha Mẹ & Thầy Cô' : '5. Parent & Teacher'}</span>
        </button>
      </div>

      {/* SubTab Content Rendering */}
      <div>
        {subTab === 'roadmap' && (
          <LearningRoadmapView
            profile={profile}
            career={topCareer}
            onSelectCareer={onSelectCareer}
          />
        )}

        {subTab === 'compare' && (
          <CareerComparisonView
            profile={profile}
            selectedCareerIds={[
              recommendations[0]?.career.id || 'software-engineer',
              recommendations[1]?.career.id || 'robotics-engineer'
            ]}
            onToggleCareer={() => {}}
            onSelectCareer={onSelectCareer}
          />
        )}

        {subTab === 'whatif' && (
          <WhatIfSimulationView
            profile={profile}
            onApplyChanges={onUpdateProfile}
          />
        )}

        {subTab === 'counselor' && (
          <AICounselorView
            profile={profile}
            targetCareer={topCareer}
          />
        )}

        {subTab === 'family' && (
          <ParentTeacherView
            profile={profile}
            recommendations={recommendations}
          />
        )}
      </div>

      {/* Bottom Bar: Back to Step 4 or Restart Examination */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToStep4}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại Bước 4 (Báo cáo Kết quả)' : 'Back to Step 4'}</span>
        </button>

        <button
          id="btn-restart-workflow"
          onClick={onRestartWorkflow}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
          <span>{language === 'vi' ? '🔄 Khởi động lại Quy trình Khảo sát Mới' : '🔄 Start New Examination Cycle'}</span>
        </button>
      </div>
    </div>
  );
};
