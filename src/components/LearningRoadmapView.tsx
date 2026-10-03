import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  Layers,
  AlertTriangle,
  Lightbulb,
  Code2,
  FolderGit2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Bot,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { UserProfile, Career, RecommendationScore } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { generateLearningRoadmap } from '../engine/roadmapEngine';
import { analyzeSkillGap } from '../engine/skillGapEngine';
import { analyzeAIImpactAndFutureTrends } from '../engine/aiImpactEngine';
import { useLanguage } from '../context/LanguageContext';

interface LearningRoadmapViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
  onUpdateStudyHours?: (hours: number) => void;
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
  const [viewTab, setViewTab] = useState<'roadmap' | 'skillgap' | 'aiOutlook'>('roadmap');
  const [skillFilter, setSkillFilter] = useState<'all' | 'missing' | 'developing' | 'strong'>('all');

  const selectedCareer =
    CAREER_DATABASE.find(c => c.id === selectedCareerId) || CAREER_DATABASE[0];
  const skillGap = analyzeSkillGap(profile, selectedCareer);
  const roadmap = generateLearningRoadmap(profile, selectedCareer, skillGap);
  const aiOutlook = analyzeAIImpactAndFutureTrends(selectedCareer, profile, skillGap);

  const filteredSkills = [
    ...(skillFilter === 'all' || skillFilter === 'missing' ? skillGap.missingSkills : []),
    ...(skillFilter === 'all' || skillFilter === 'developing' ? skillGap.developingSkills : []),
    ...(skillFilter === 'all' || skillFilter === 'strong' ? skillGap.strongSkills : [])
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Lộ trình Rèn luyện & Phân tích Lỗ hổng Kỹ năng
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Lộ trình được tạo tự động dựa trực tiếp trên kết quả phân tích khoảng trống kỹ năng (Skill Gap) của bạn. Liên kết chặt chẽ theo chuỗi: <strong>Lỗ hổng kỹ năng ➔ Học khái niệm ➔ Bài tập nhỏ ➔ Dự án mini ➔ Cột mốc</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Career Selector */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto custom-scrollbar max-w-full">
              {recommendations.slice(0, 3).map(rec => {
                const c = CAREER_DATABASE.find(x => x.id === rec.careerId);
                if (!c) return null;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCareerId === c.id
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                    }`}
                  >
                    {getCareerTitle(c.id, c.title)}
                  </button>
                );
              })}

              <div className="h-4 w-px bg-slate-300 mx-1" />

              <select
                value={
                  !recommendations.slice(0, 3).find(r => r.careerId === selectedCareerId)
                    ? selectedCareerId
                    : ""
                }
                onChange={e => setSelectedCareerId(e.target.value)}
                className={`shrink-0 text-xs font-semibold px-2 py-1.5 rounded-lg border-none focus:outline-none cursor-pointer transition-all ${
                  !recommendations.slice(0, 3).find(r => r.careerId === selectedCareerId)
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <option value="" disabled>Ngành khác...</option>
                {CAREER_DATABASE.filter(c => !recommendations.slice(0, 3).find(r => r.careerId === c.id)).map(c => (
                  <option key={c.id} value={c.id}>
                    {getCareerTitle(c.id, c.title)}
                  </option>
                ))}
              </select>
            </div>

            {/* Study Hours Selector */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-slate-600 font-medium">Cường độ:</span>
              <select
                value={profile.availableStudyTimeHoursPerWeek || 10}
                onChange={e => onUpdateStudyHours && onUpdateStudyHours(Number(e.target.value))}
                className="font-bold text-indigo-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value={5}>5 giờ/tuần (Thong thả)</option>
                <option value={10}>10 giờ/tuần (Chuẩn mực)</option>
                <option value={20}>20 giờ/tuần (Tập trung cao độ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Switcher: Roadmap vs Skill Gap Breakdown */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewTab('roadmap')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Lộ trình Hành động (0–3m, 3–6m, 6–12m)</span>
            </button>
            <button
              onClick={() => setViewTab('skillgap')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewTab === 'skillgap'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chi tiết Lỗ hổng Kỹ năng ({skillGap.strongSkills.length + skillGap.developingSkills.length + skillGap.missingSkills.length} kỹ năng)</span>
            </button>
            <button
              onClick={() => setViewTab('aiOutlook')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewTab === 'aiOutlook'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chiến lược AI & Xu hướng 3–5 năm</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Chỉ số sẵn sàng:</span>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {skillGap.overallReadiness}%
            </span>
          </div>
        </div>

        {/* Personalized Tailored Note */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{roadmap.tailoredNote}</span>
        </div>
      </div>

      {/* VIEW 1: PHASED TIMELINE ROADMAP (0-3m, 3-6m, 6-12m) */}
      {viewTab === 'roadmap' && (
        <div className="space-y-6">
          {roadmap.phases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden hover:border-indigo-300 transition-all space-y-4"
            >
              {/* Phase Header */}
              <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                    0{phase.phaseNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{phase.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                        {phase.duration}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Thời lượng tiêu chuẩn: {phase.timeframe || phase.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cột mốc kiểm chứng đầu ra
                  </span>
                </div>
              </div>

              {/* Objectives & Skills Overview */}
              <div className="px-5 sm:px-6 grid md:grid-cols-2 gap-4 text-xs">
                {/* Objectives */}
                <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mục tiêu trọng tâm:</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {phase.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Activities & Milestone */}
                <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Hoạt động & Dự án thực nghiệm:</span>
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {phase.projects.map((proj, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Chain: Skill Gap → Learning → Practice → Project → Milestone */}
              {phase.actionSteps && phase.actionSteps.length > 0 && (
                <div className="px-5 sm:px-6 pb-2 space-y-3">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                      Quy trình Chuyển hóa Năng lực (Step-by-Step Chain):
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Lỗ hổng ➔ Học khái niệm ➔ Bài tập ➔ Dự án ➔ Cột mốc
                    </span>
                  </div>

                  <div className="space-y-3">
                    {phase.actionSteps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 text-xs space-y-2.5"
                      >
                        {/* Step Target Skill Header */}
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/80 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {step.skill}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                step.currentStatus === 'Strong'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : step.currentStatus === 'Developing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              Hiện tại: {step.currentStatus === 'Strong' ? 'Đã thành thạo' : step.currentStatus === 'Developing' ? 'Đang phát triển' : 'Còn thiếu'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 text-slate-700">
                              {step.requiredLevel}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Ưu tiên: {step.priority === 'High' ? 'Cao' : step.priority === 'Medium' ? 'Trung bình' : 'Tiêu chuẩn'}
                          </span>
                        </div>

                        {/* Visual 4-Step Chain */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                          {/* 1. Learning Concept */}
                          <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1">
                            <span className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-indigo-500" />
                              1. Học Khái niệm
                            </span>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              {step.learningConcept}
                            </p>
                          </div>

                          {/* 2. Small Exercises */}
                          <div className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1">
                            <span className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
                              <Code2 className="w-3 h-3 text-blue-500" />
                              2. Bài tập Thực hành
                            </span>
                            <ul className="text-[11px] text-slate-700 space-y-0.5 leading-snug">
                              {step.smallExercises.map((ex, ei) => (
                                <li key={ei}>• {ex}</li>
                              ))}
                            </ul>
                          </div>

                          {/* 3. Mini Project */}
                          <div className="p-2.5 bg-white rounded-lg border border-purple-100 space-y-1">
                            <span className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                              <FolderGit2 className="w-3 h-3 text-purple-500" />
                              3. Dự án Mini
                            </span>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              {step.miniProject}
                            </p>
                          </div>

                          {/* 4. Milestone Goal */}
                          <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              4. Cột mốc Đầu ra
                            </span>
                            <p className="text-[11px] text-emerald-950 font-medium leading-snug">
                              {step.milestoneGoal}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase Milestone Footer Banner */}
              <div className="p-4 bg-emerald-50/80 border-t border-emerald-100 flex items-start space-x-2 text-xs">
                <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-emerald-950 uppercase tracking-wide text-[10px]">
                    Cột mốc nghiệm thu giai đoạn ({phase.duration}):
                  </span>
                  <p className="text-emerald-900 leading-relaxed font-medium">
                    {phase.milestone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: FULL 9-DIMENSION SKILL GAP BREAKDOWN */}
      {viewTab === 'skillgap' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold mr-1">Bộ lọc trạng thái:</span>
              <button
                onClick={() => setSkillFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  skillFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({skillGap.missingSkills.length + skillGap.developingSkills.length + skillGap.strongSkills.length})
              </button>
              <button
                onClick={() => setSkillFilter('missing')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  skillFilter === 'missing'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Còn thiếu ({skillGap.missingSkills.length})
              </button>
              <button
                onClick={() => setSkillFilter('developing')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  skillFilter === 'developing'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Đang phát triển ({skillGap.developingSkills.length})
              </button>
              <button
                onClick={() => setSkillFilter('strong')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  skillFilter === 'strong'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Đã thành thạo ({skillGap.strongSkills.length})
              </button>
            </div>
            <span className="text-xs text-slate-400">
              Định dạng 9 chiều chuẩn mực • Không tự tạo score giả
            </span>
          </div>

          {/* Cards for each skill */}
          <div className="space-y-3">
            {filteredSkills.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 hover:border-indigo-300 transition-all"
              >
                {/* Header row: Skill, Status, Required Level, Priority */}
                <div className="flex items-start justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-extrabold text-slate-900">{item.skill}</h4>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Phân loại: {item.category === 'Soft' ? 'Kỹ năng Mềm' : item.category === 'Domain' ? 'Chuyên ngành' : 'Kỹ thuật'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Lý do bắt buộc:</strong> {item.reason || `Yêu cầu quan trọng của nghề ${selectedCareer.title}.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                        item.userLevel === 'Strong'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : item.userLevel === 'Developing'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {item.userLevel === 'Strong' ? 'Đã thành thạo (Strong)' : item.userLevel === 'Developing' ? 'Đang phát triển (Developing)' : 'Còn thiếu (Missing)'}
                    </span>
                    <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700">
                      Mức yêu cầu: {item.requiredLevel || 'Cốt lõi bắt buộc'}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-xl text-xs font-bold ${
                        item.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      Ưu tiên: {item.priority === 'High' ? 'Cao' : item.priority === 'Medium' ? 'Trung bình' : 'Tiêu chuẩn'}
                    </span>
                  </div>
                </div>

                {/* 3-Column Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Gap & Improvement Method */}
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      Khoảng cách & Phương pháp học
                    </span>
                    <p className="text-slate-600 text-[11px] italic">
                      {item.gap}
                    </p>
                    <p className="text-slate-800 text-[11px] font-medium pt-1 border-t border-slate-200/60 leading-relaxed">
                      {item.improvementMethod}
                    </p>
                  </div>

                  {/* Suggested Practice */}
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      Bài tập Thực hành Đề xuất
                    </span>
                    <p className="text-blue-950 text-[11px] leading-relaxed">
                      {item.suggestedPractice}
                    </p>
                  </div>

                  {/* Suggested Project */}
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
                    <span className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                      <FolderGit2 className="w-3.5 h-3.5 text-purple-600" />
                      Dự án Thực chiến Đề xuất
                    </span>
                    <p className="text-purple-950 text-[11px] leading-relaxed">
                      {item.suggestedProject}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: AI IMPACT & 3–5 YEAR FUTURE OUTLOOK */}
      {viewTab === 'aiOutlook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Phân tích Tác động AI & Triển vọng 3–5 năm: {getCareerTitle(selectedCareer.id, selectedCareer.title)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Khung thời gian định hướng: <strong>3–5 năm</strong> · Dựa trên CSDL nghề nghiệp chuẩn hóa và hồ sơ cá nhân của bạn
                  </p>
                </div>
              </div>
            </div>

            {/* 4-Card Grid for Dimensions 1 to 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. AI Automation */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>1. Tự động hóa & Tác vụ AI hỗ trợ</span>
                </div>
                {aiOutlook.aiAutomation.hasData ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-700 leading-relaxed">
                      {aiOutlook.aiAutomation.automatedAspectsSummary}
                    </p>
                    {aiOutlook.aiAutomation.assistableTasks.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Các tác vụ cụ thể AI có thể đẩy nhanh:
                        </span>
                        <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                          {aiOutlook.aiAutomation.assistableTasks.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs italic">Dữ liệu tự động hóa chưa có trong hệ thống</span>
                )}
              </div>

              {/* 2. Human Advantage */}
              <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70 space-y-3">
                <div className="flex items-center space-x-2 text-amber-950 font-bold text-xs">
                  <Brain className="w-4 h-4 text-amber-700" />
                  <span>2. Thế mạnh Con người (Khó bị thay thế)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-amber-900 leading-relaxed text-[11px]">
                    {aiOutlook.humanAdvantage.irreplaceableAspectsSummary}
                  </p>
                  {aiOutlook.humanAdvantage.coreAbilities.length > 0 && (
                    <div className="pt-2 border-t border-amber-200/50">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">
                        Năng lực cốt lõi con người vẫn quyết định:
                      </span>
                      <ul className="text-amber-900 space-y-1 text-[11px]">
                        {aiOutlook.humanAdvantage.coreAbilities.slice(0, 4).map((ab, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="font-bold text-amber-600 mt-0.5">•</span>
                            <span>{ab}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Skill Demand */}
              <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/70 space-y-3">
                <div className="flex items-center space-x-2 text-blue-950 font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>3. Nhu cầu Kỹ năng mới trong 3–5 năm</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-blue-900 leading-relaxed text-[11px]">
                    {aiOutlook.skillDemand.marketTrendSummary}
                  </p>
                  {aiOutlook.skillDemand.emergingSkills.length > 0 && (
                    <div className="pt-2 border-t border-blue-200/50">
                      <span className="text-[10px] font-bold text-blue-800 uppercase block mb-1.5">
                        Kỹ năng gia tăng sức hút tuyển dụng:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiOutlook.skillDemand.emergingSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white text-blue-900 font-semibold text-[11px] border border-blue-200 shadow-2xs"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Student Preparation */}
              <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/70 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-950 font-bold text-xs">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>4. Học sinh nên chuẩn bị gì (Personalized Preparation)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">
                    Đúc kết từ: Hồ sơ của bạn + Khoảng cách kỹ năng + Xu hướng ngành
                  </p>
                  <ul className="text-indigo-950 space-y-1.5 text-[11px]">
                    {aiOutlook.preparation.tailoredAdvice.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                  {aiOutlook.preparation.progressionAdvice && (
                    <div className="pt-2 border-t border-indigo-200/50 text-[11px] text-indigo-800 italic">
                      {aiOutlook.preparation.progressionAdvice}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Grounding & Uncertainty Partition */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <h4 className="font-bold text-slate-900 text-xs">
                  5. Phân định Căn cứ Dữ liệu & Tính Bất định Tương lai (Grounding & Uncertainty)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                {/* Known Data */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-800 uppercase block text-[10px]">
                    ✓ Dữ liệu xác thực (Known Data):
                  </span>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    {aiOutlook.groundingAndUncertainty.knownData.map((kd, idx) => (
                      <li key={idx}>{kd}</li>
                    ))}
                  </ul>
                </div>

                {/* Inferences */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-800 uppercase block text-[10px]">
                    💡 Suy luận tương quan (Inference):
                  </span>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    {aiOutlook.groundingAndUncertainty.inferences.map((inf, idx) => (
                      <li key={idx}>{inf}</li>
                    ))}
                  </ul>
                </div>

                {/* Future Uncertainty */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-amber-800 uppercase block text-[10px]">
                    ⏳ Yếu tố bất định 3–5 năm (Future Uncertainty):
                  </span>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    {aiOutlook.groundingAndUncertainty.uncertainties.map((unc, idx) => (
                      <li key={idx}>{unc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <strong>Lưu ý bảo chứng:</strong> {aiOutlook.groundingAndUncertainty.disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
