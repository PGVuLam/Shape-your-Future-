import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Career, UserProfile, RecommendationScore } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { analyzeSkillGap } from '../engine/skillGapEngine';
import { useLanguage } from '../context/LanguageContext';

interface SkillGapViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
  onNavigateTab: (tab: string) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  profile,
  recommendations,
  onSelectCareer,
  onNavigateTab
}) => {
  const { language, t, getCareerTitle, getCareerCluster } = useLanguage();
  const defaultCareerId = recommendations[0]?.careerId || 'software-engineer';
  const [selectedCareerId, setSelectedCareerId] = useState<string>(defaultCareerId);

  const selectedCareer =
    CAREER_DATABASE.find(c => c.id === selectedCareerId) || CAREER_DATABASE[0];
  const skillGap = analyzeSkillGap(profile, selectedCareer);
  const locTitle = getCareerTitle(selectedCareer.id, selectedCareer.title);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Target Career Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.skillGapTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.skillGapDesc}
          </p>
        </div>

        {/* Career Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-600">{t.targetCareer}</span>
          <select
            value={selectedCareerId}
            onChange={e => setSelectedCareerId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-sm focus:outline-none"
          >
            {CAREER_DATABASE.map(career => (
              <option key={career.id} value={career.id}>
                {getCareerTitle(career.id, career.title)} ({getCareerCluster(career.id, career.careerCluster)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Readiness Overview Metric */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            {language === 'vi' ? `Chỉ số tương thích nghề: ${locTitle}` : `${selectedCareer.title} Readiness`}
          </span>
          <h3 className="text-2xl font-bold">
            {language === 'vi'
              ? `Bạn đã đạt ${skillGap.overallReadiness}% năng lực yêu cầu của nghề`
              : `You match ${skillGap.overallReadiness}% of target competencies`}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            {skillGap.overallReadiness >= 75
              ? t.readinessHigh
              : skillGap.overallReadiness >= 50
              ? t.readinessMedium
              : t.readinessLow}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center flex flex-col items-center justify-center space-y-1">
          <span className="text-4xl font-extrabold text-indigo-300">{skillGap.overallReadiness}%</span>
          <span className="text-xs text-slate-300">{t.readinessTitle}</span>
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="mt-2 w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
          >
            <span>{t.viewRoadmap}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Categorized Skills Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Missing Skills (High Priority) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-700 flex items-center space-x-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.missingSkills} ({skillGap.missingSkills.length})</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
              {t.actionRequired}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'vi' ? 'Các kỹ năng cốt lõi hiện chưa có trong hồ sơ tự đánh giá của bạn.' : 'Prerequisites currently absent from your documented profile.'}
          </p>

          <div className="space-y-3">
            {skillGap.missingSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950">{item.skill}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.priority === 'High'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.priority === 'High' ? t.priorityHigh : item.priority === 'Medium' ? t.priorityMedium : t.priorityLow}
                  </span>
                </div>
                <p className="text-rose-800 text-[11px]">{item.recommendedAction}</p>
              </div>
            ))}
            {skillGap.missingSkills.length === 0 && (
              <p className="text-xs text-slate-400 italic">
                {language === 'vi' ? 'Không có kỹ năng còn thiếu!' : 'No missing skills detected!'}
              </p>
            )}
          </div>
        </div>

        {/* Developing Skills */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-700 flex items-center space-x-1.5 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>{t.developingSkills} ({skillGap.developingSkills.length})</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
              {t.inProgress}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'vi' ? 'Bạn đã có nền tảng cơ bản, cần thực hành thêm dự án để đạt mức chuyên sâu.' : 'Competencies where you possess preliminary exposure or theory.'}
          </p>

          <div className="space-y-3">
            {skillGap.developingSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{item.skill}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-medium">
                    {language === 'vi' ? 'Cần thực hành' : 'Expand Practice'}
                  </span>
                </div>
                <p className="text-amber-800 text-[11px]">{item.recommendedAction}</p>
              </div>
            ))}
            {skillGap.developingSkills.length === 0 && (
              <p className="text-xs text-slate-400 italic">
                {language === 'vi' ? 'Không có kỹ năng đang phát triển.' : 'No skills currently marked as developing.'}
              </p>
            )}
          </div>
        </div>

        {/* Strong Skills */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-700 flex items-center space-x-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.strongSkills} ({skillGap.strongSkills.length})</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              {t.mastered}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'vi' ? 'Thế mạnh đã được chứng minh qua học tập hoặc sản phẩm thực tế.' : 'Verified competencies meeting or exceeding professional requirements.'}
          </p>

          <div className="space-y-3">
            {skillGap.strongSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs"
              >
                <span className="font-bold text-emerald-950">{item.skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-semibold">
                  {t.mastered}
                </span>
              </div>
            ))}
            {skillGap.strongSkills.length === 0 && (
              <p className="text-xs text-slate-400 italic">
                {language === 'vi' ? 'Chưa có kỹ năng ghi nhận thế mạnh.' : 'No strong competencies mapped yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
