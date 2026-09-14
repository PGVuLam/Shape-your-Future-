import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, WhatIfAdjustments, WhatIfComparisonResult } from '../types';
import { runWhatIfSimulation } from '../engine/simulationEngine';
import { useLanguage } from '../context/LanguageContext';

interface WhatIfSimulationViewProps {
  profile: UserProfile;
}

export const WhatIfSimulationView: React.FC<WhatIfSimulationViewProps> = ({ profile }) => {
  const { language, t, getCareerTitle } = useLanguage();
  const [adjustments, setAdjustments] = useState<WhatIfAdjustments>({
    addedSubjects: [],
    removedSubjects: [],
    addedSkills: [],
    preferredRemote: 'Any',
    higherTeamwork: false,
    noUniversity: false,
    priorityHighIncome: false
  });

  const simulation: WhatIfComparisonResult = runWhatIfSimulation(profile, adjustments);

  const handleReset = () => {
    setAdjustments({
      addedSubjects: [],
      removedSubjects: [],
      addedSkills: [],
      preferredRemote: 'Any',
      higherTeamwork: false,
      noUniversity: false,
      priorityHighIncome: false
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.simulatorTitle}
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetVariables}</span>
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {t.simulatorDesc}
        </p>
      </div>

      {/* Control Knobs & Variable Toggles */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t.controlVariables}
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Knob 1: Programming Skill Boost */}
          <div
            onClick={() => {
              const skill = 'Programming (Python, JS/TS, or Java)';
              const exists = adjustments.addedSkills?.includes(skill);
              setAdjustments(prev => ({
                ...prev,
                addedSkills: exists
                  ? prev.addedSkills?.filter(s => s !== skill)
                  : [...(prev.addedSkills || []), skill]
              }));
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              adjustments.addedSkills?.includes('Programming (Python, JS/TS, or Java)')
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
              💻
            </div>
            <div>
              <span className="font-bold block">{t.boostProgramming}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.boostProgrammingDesc}
              </p>
            </div>
          </div>

          {/* Knob 2: Subject Switch: Physics over Biology */}
          <div
            onClick={() => {
              const hasPhysics = adjustments.addedSubjects?.includes('Physics');
              setAdjustments(prev => ({
                ...prev,
                addedSubjects: hasPhysics
                  ? prev.addedSubjects?.filter(s => s !== 'Physics')
                  : [...(prev.addedSubjects || []), 'Physics'],
                removedSubjects: hasPhysics
                  ? prev.removedSubjects?.filter(s => s !== 'Biology')
                  : [...(prev.removedSubjects || []), 'Biology']
              }));
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              adjustments.addedSubjects?.includes('Physics')
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs">
              ⚡
            </div>
            <div>
              <span className="font-bold block">{t.focusPhysics}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.focusPhysicsDesc}
              </p>
            </div>
          </div>

          {/* Knob 3: Remote Work Preference */}
          <div
            onClick={() => {
              setAdjustments(prev => ({
                ...prev,
                preferredRemote: prev.preferredRemote === 'Remote' ? 'Any' : 'Remote'
              }));
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              adjustments.preferredRemote === 'Remote'
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs">
              🌐
            </div>
            <div>
              <span className="font-bold block">{t.remoteOnly}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.remoteOnlyDesc}
              </p>
            </div>
          </div>

          {/* Knob 4: High Teamwork & People */}
          <div
            onClick={() => {
              setAdjustments(prev => ({
                ...prev,
                higherTeamwork: !prev.higherTeamwork
              }));
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              adjustments.higherTeamwork
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center shrink-0 text-xs">
              👥
            </div>
            <div>
              <span className="font-bold block">{t.highSocial}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.highSocialDesc}
              </p>
            </div>
          </div>

          {/* Knob 5: No 4-Year University */}
          <div
            onClick={() => {
              setAdjustments(prev => ({
                ...prev,
                noUniversity: !prev.noUniversity
              }));
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              adjustments.noUniversity
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs">
              🛠️
            </div>
            <div>
              <span className="font-bold block">{t.vocationalOnly}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.vocationalOnlyDesc}
              </p>
            </div>
          </div>

          {/* Knob 6: Maximize Earning Potential */}
          <div
            onClick={() => {
              setAdjustments(prev => ({
                ...prev,
                priorityHighIncome: !prev.priorityHighIncome
              }));
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              adjustments.priorityHighIncome
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-green-600 text-white flex items-center justify-center shrink-0 text-xs">
              💰
            </div>
            <div>
              <span className="font-bold block">{t.maxIncome}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.maxIncomeDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Tables: BEFORE vs AFTER */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* BEFORE CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.baselineBefore}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {t.originalProfile}
            </span>
          </div>

          <div className="space-y-3">
            {simulation.beforeRankings.map((item, idx) => (
              <div
                key={item.careerId}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900">{getCareerTitle(item.careerId, item.title)}</span>
                </div>
                <span className="font-bold text-slate-700">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-300 shadow-sm space-y-4 ring-2 ring-indigo-500/10">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              {t.recalculatedAfter}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              {t.dynamicSensitivity}
            </span>
          </div>

          <div className="space-y-3">
            {simulation.afterRankings.map((item, idx) => (
              <div
                key={item.careerId}
                className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 font-bold text-white flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-indigo-950">{getCareerTitle(item.careerId, item.title)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-indigo-700">{item.score}%</span>
                  {item.delta !== undefined && item.delta !== 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                        item.delta > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.delta > 0 ? `+${item.delta}%` : `${item.delta}%`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attribution & Explanation Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl text-white shadow-md space-y-2">
        <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t.whyRankingsShifted}</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {simulation.explanation.map((exp, i) => (
            <li key={i} className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{exp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
