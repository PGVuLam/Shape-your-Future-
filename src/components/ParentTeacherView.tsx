import React from 'react';
import {
  Users,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Home,
  Compass,
  Lightbulb
} from 'lucide-react';
import { UserProfile, RecommendationScore } from '../types';
import { generateParentTeacherSummary } from '../engine/parentTeacherEngine';
import { useLanguage } from '../context/LanguageContext';

interface ParentTeacherViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
}

export const ParentTeacherView: React.FC<ParentTeacherViewProps> = ({
  profile,
  recommendations
}) => {
  const { language, t } = useLanguage();
  const summary = generateParentTeacherSummary(profile, recommendations);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.parentTeacherTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          {t.parentTeacherDesc}
        </p>
      </div>

      {/* Core Philosophy Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl text-white shadow-md flex items-start space-x-3">
        <HeartHandshake className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
            {t.explorationPrinciple}
          </span>
          <p className="text-slate-100 leading-relaxed">
            {language === 'vi'
              ? 'Hướng nghiệp là một hành trình dài hạn tìm kiếm sự hòa hợp giữa đam mê, năng lực cá nhân và nhu cầu xã hội — tuyệt đối không nên vội vã quyết định một chiều. Vai trò của gia đình và thầy cô là khơi gợi, đồng hành và tạo không gian an toàn để con tự tin trải nghiệm.'
              : summary.guidingPhilosophy}
          </p>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Strengths & Development Stage */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.growthStageTitle}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-indigo-700">
              {language === 'vi' ? 'Giai đoạn phát triển nhận thức:' : 'Stage of Growth:'}
            </span>
            <p className="text-slate-800 font-semibold">{summary.developmentStage}</p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              {t.observedStrengths}
            </span>
            <div className="space-y-1.5">
              {summary.identifiedStrengths.map((str, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Recommended Exploration Domains */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>{t.suggestedDirections}</span>
          </div>

          <p className="text-slate-500">
            {language === 'vi'
              ? 'Dựa trên xu hướng tính cách Holland và thế mạnh môn học, các lĩnh vực sau mang lại nhiều cơ hội phát huy tiềm năng:'
              : 'Based on current psychometric curiosity, these fields offer enriching opportunities to explore:'}
          </p>

          <div className="space-y-2">
            {summary.recommendedExplorationDomains.map((domain, idx) => (
              <div
                key={idx}
                className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 font-bold text-indigo-950 flex items-center justify-between"
              >
                <span>{domain}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-200/80 text-indigo-800 font-semibold">
                  {language === 'vi' ? 'Rất tiềm năng' : 'Promising Fit'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Home & School Activities */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
          <Home className="w-4 h-4 text-sky-600" />
          <span>{t.homeSchoolActivities}</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          {summary.suggestedHomeAndSchoolActivities.map((act, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start space-x-2 text-slate-800">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{act}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Starters for Parents */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
          <MessageCircle className="w-4 h-4 text-purple-600" />
          <span>{t.conversationStarters}</span>
        </div>

        <div className="space-y-3 text-xs">
          {summary.conversationStartersForParents.map((starter, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 text-purple-950 font-medium italic"
            >
              "{starter}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
