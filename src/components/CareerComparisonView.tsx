import React, { useState } from 'react';
import {
  GitCompare,
  X,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Career, UserProfile, RecommendationScore, getHollandCode } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { analyzeSkillGap } from '../engine/skillGapEngine';
import { useLanguage } from '../context/LanguageContext';

interface CareerComparisonViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  comparedCareerIds: string[];
  onAddComparison: (id: string) => void;
  onRemoveComparison: (id: string) => void;
  onSelectCareer: (career: Career) => void;
}

export const CareerComparisonView: React.FC<CareerComparisonViewProps> = ({
  profile,
  recommendations,
  comparedCareerIds,
  onAddComparison,
  onRemoveComparison,
  onSelectCareer
}) => {
  const { language, t, getCareerTitle, getCareerCluster } = useLanguage();
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');

  // Fallback default compared careers if empty
  const activeIds =
    comparedCareerIds.length > 0
      ? comparedCareerIds
      : [recommendations[0]?.careerId || 'software-engineer', recommendations[1]?.careerId || 'ai-data-scientist'];

  const comparedCareers = activeIds
    .map(id => CAREER_DATABASE.find(c => c.id === id))
    .filter(Boolean) as Career[];

  const recMap = new Map<string, RecommendationScore>();
  recommendations.forEach(r => recMap.set(r.careerId, r));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Career Selectors */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.compareTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.compareDesc}
            </p>
          </div>

          {/* Add Career to Matrix */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedToAdd}
              onChange={e => {
                if (e.target.value && !activeIds.includes(e.target.value)) {
                  onAddComparison(e.target.value);
                  setSelectedToAdd('');
                }
              }}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-sm focus:outline-none"
            >
              <option value="">{t.addCareerToCompare}</option>
              {CAREER_DATABASE.filter(c => !activeIds.includes(c.id)).map(c => (
                <option key={c.id} value={c.id}>
                  {getCareerTitle(c.id, c.title)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">{t.quickComparisons}</span>
          <button
            onClick={() => {
              onRemoveComparison('all');
              onAddComparison('software-engineer');
              onAddComparison('robotics-engineer');
              onAddComparison('ai-data-scientist');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            {'Phần mềm vs Robot vs AI'}
          </button>
          <button
            onClick={() => {
              onRemoveComparison('all');
              onAddComparison('product-manager');
              onAddComparison('ux-designer');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            {'Quản lý Sản phẩm vs Thiết kế UI/UX'}
          </button>
          <button
            onClick={() => {
              onRemoveComparison('all');
              onAddComparison('physician-doctor');
              onAddComparison('biomedical-engineer');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            {'Bác sĩ Lâm sàng vs Kỹ sư Y sinh'}
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-600 w-48 uppercase tracking-wider text-[11px]">
                {t.dimension}
              </th>
              {comparedCareers.map(career => {
                const rec = recMap.get(career.id);
                const locTitle = getCareerTitle(career.id, career.title);
                const locCluster = getCareerCluster(career.id, career.careerCluster);
                return (
                  <th key={career.id} className="p-4 min-w-[260px] border-l border-slate-200 align-top">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                          {locCluster}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{locTitle}</h4>
                      </div>
                      {comparedCareers.length > 1 && (
                        <button
                          onClick={() => onRemoveComparison(career.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {rec && (
                      <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs">
                        <span>{'Mức hợp:'} {rec.overallScore}%</span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* Row 1: Holland RIASEC */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.hollandPsychometrics}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200">
                  <span className="font-semibold text-slate-900">{c.hollandCode || getHollandCode(c.riaSecProfile)}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    R={c.riaSecProfile.R}, I={c.riaSecProfile.I}, A={c.riaSecProfile.A}, S={c.riaSecProfile.S}, E={c.riaSecProfile.E}, C={c.riaSecProfile.C}
                  </p>
                </td>
              ))}
            </tr>

            {/* Row 2: Skill Readiness Index */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.skillReadinessGap}</td>
              {comparedCareers.map(c => {
                const gap = analyzeSkillGap(profile, c);
                return (
                  <td key={c.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-700">{gap.overallReadiness}% {'Sẵn sàng'}</span>
                      <span className="text-[10px] text-rose-600 font-semibold">
                        {gap.missingSkills.length} {'kỹ năng cần bù'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${gap.overallReadiness}%` }}
                      ></div>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 3: Daily Responsibilities */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.coreDailyTasks}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200 space-y-1.5">
                  {c.tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Row 4: Required Technical Skills */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.requiredCompetencies}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200">
                  <div className="flex flex-wrap gap-1">
                    {c.requiredSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 5: Educational Pathways */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.educationPaths}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200 space-y-2">
                  {c.educationPaths.map((p, i) => (
                    <div key={i} className="text-slate-700">
                      <span className="font-semibold text-slate-900">{p.type}</span> ({p.duration}):
                      <p className="text-[11px] text-slate-500">{p.tradeoffs}</p>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Row 6: Compensation Tier & Disclaimer */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.compensationMarket}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200 space-y-1">
                  <div className="flex items-center space-x-1 font-bold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.salaryTier} {c.salaryInfo.levelIndicator}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {true ? t.salaryDisclaimer : c.salaryInfo.disclaimer}
                  </p>
                </td>
              ))}
            </tr>

            {/* Row 7: "Try Before You Decide" */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{t.discoveryExperiment}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200">
                  {c.experiments[0] ? (
                    <div className="p-2 bg-sky-50 rounded-lg border border-sky-100 text-sky-900 space-y-1">
                      <span className="font-semibold">{c.experiments[0].title}</span>
                      <p className="text-[11px]">{c.experiments[0].description}</p>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
              ))}
            </tr>

            {/* Row 8: Action row */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{'Thao tác'}</td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200">
                  <button
                    onClick={() => onSelectCareer(c)}
                    className="w-full py-2 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold text-xs transition-colors"
                  >
                    {t.viewFullProfile}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
