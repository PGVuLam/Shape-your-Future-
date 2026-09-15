import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { UserProfile, Career, RecommendationScore } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { generateLearningRoadmap } from '../engine/roadmapEngine';
import { analyzeSkillGap } from '../engine/skillGapEngine';
import { useLanguage } from '../context/LanguageContext';

interface LearningRoadmapViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
  onUpdateStudyHours: (hours: number) => void;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({
  profile,
  recommendations,
  onSelectCareer,
  onUpdateStudyHours
}) => {
  const { language, t, getCareerTitle, getCareerCluster } = useLanguage();
  const defaultCareerId = recommendations[0]?.careerId || 'software-engineer';
  const [selectedCareerId, setSelectedCareerId] = useState<string>(defaultCareerId);

  const selectedCareer =
    CAREER_DATABASE.find(c => c.id === selectedCareerId) || CAREER_DATABASE[0];
  const skillGap = analyzeSkillGap(profile, selectedCareer);
  const roadmap = generateLearningRoadmap(profile, selectedCareer, skillGap);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.roadmapTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {true
                ? `Lộ trình theo giai đoạn được tối ưu riêng cho nhóm tuổi ${profile.ageGroup}, thời gian tự học và khoảng trống kỹ năng.`
                : `Phased roadmap calibrated for your age group (${profile.ageGroup}), available study time, and current skill gaps.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Career Selector (Tabs for top recommendations) */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto custom-scrollbar max-w-full">
              {recommendations.slice(0, 3).map(rec => {
                const c = CAREER_DATABASE.find(x => x.id === rec.careerId);
                if (!c) return null;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedCareerId === c.id
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                    }`}
                  >
                    {getCareerTitle(c.id, c.title)}
                  </button>
                );
              })}
              
              <div className="h-4 w-px bg-slate-300 mx-1"></div>
              
              <select
                value={
                  !recommendations.slice(0, 3).find(r => r.careerId === selectedCareerId)
                    ? selectedCareerId
                    : ""
                }
                onChange={e => setSelectedCareerId(e.target.value)}
                className={`shrink-0 text-xs font-semibold px-2 py-1.5 rounded-lg border-none focus:outline-none cursor-pointer transition-all ${
                  !recommendations.slice(0, 3).find(r => r.careerId === selectedCareerId) 
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' 
                    : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <option value="" disabled>Nghề khác...</option>
                {CAREER_DATABASE.filter(c => !recommendations.slice(0, 3).find(r => r.careerId === c.id)).map(c => (
                  <option key={c.id} value={c.id}>
                    {getCareerTitle(c.id, c.title)}
                  </option>
                ))}
              </select>
            </div>

            {/* Study Hours Slider */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-slate-600 font-medium">{t.studyPace}</span>
              <select
                value={profile.availableStudyTimeHoursPerWeek || 10}
                onChange={e => onUpdateStudyHours(Number(e.target.value))}
                className="font-bold text-indigo-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value={5}>{t.lightPace}</option>
                <option value={10}>{t.standardPace}</option>
                <option value={20}>{t.intensivePace}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Age group adaptation note */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span>{roadmap.tailoredNote}</span>
        </div>
      </div>

      {/* Phased Roadmap Timeline */}
      <div className="space-y-6">
        {roadmap.phases.map((phase, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-300 transition-all"
          >
            {/* Phase Header */}
            <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {phase.phaseNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{phase.name}</h3>
                  <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{t.duration} {phase.duration}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {'Có cột mốc đánh giá'}
                </span>
              </div>
            </div>

            {/* Phase Body */}
            <div className="p-6 grid md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Objectives & Skills */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    {t.objectives}
                  </h4>
                  <ul className="space-y-2 text-slate-600">
                    {phase.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    {t.skillsToLearn}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.skillsToLearn.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 font-semibold border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Concrete Projects & Milestone */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    {t.concreteProjects}
                  </h4>
                  <div className="space-y-2">
                    {phase.projects.map((proj, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                      >
                        {proj}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone Banner */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.milestone}:</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">{phase.milestone}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
