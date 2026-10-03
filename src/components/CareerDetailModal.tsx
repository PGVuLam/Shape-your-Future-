import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Sparkles,
  FlaskConical,
  GraduationCap,
  Map,
  TrendingUp,
  Bot,
  Milestone,
  Brain,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Career, UserProfile, RecommendationScore } from '../types';
import { analyzeSkillGap } from '../engine/skillGapEngine';
import { generateLearningRoadmap } from '../engine/roadmapEngine';
import { analyzeAIImpactAndFutureTrends } from '../engine/aiImpactEngine';
import { RIASECRadarChart } from './RIASECRadarChart';
import { useLanguage } from '../context/LanguageContext';

interface CareerDetailModalProps {
  career: Career | null;
  profile: UserProfile;
  recScore?: RecommendationScore;
  onClose: () => void;
  onOpenCounselor: (career: Career) => void;
  onToggleCompare: (careerId: string) => void;
  isCompared: boolean;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  profile,
  recScore,
  onClose,
  onOpenCounselor,
  onToggleCompare,
  isCompared
}) => {
  const { language, t, getCareerTitle, getCareerCluster, getCareerDesc } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'roadmap' | 'education' | 'experiments'>('overview');

  if (!career) return null;

  const skillGap = analyzeSkillGap(profile, career);
  const roadmap = generateLearningRoadmap(profile, career, skillGap);
  const aiImpactAnalysis = analyzeAIImpactAndFutureTrends(career, profile, skillGap);
  const locTitle = getCareerTitle(career.id, career.title);
  const locCluster = getCareerCluster(career.id, career.careerCluster);
  const locDesc = getCareerDesc(career.id, career.description);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {locCluster}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                Holland: {career.hollandCode}
              </span>
              {recScore && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {recScore.overallScore}% {'Độ tương thích'}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{locTitle}</h2>
            <p className="text-slate-300 text-sm max-w-2xl">{locDesc}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/90 px-3 sm:px-6 overflow-x-auto shrink-0 min-h-[50px] items-stretch scrollbar-thin scrollbar-thumb-slate-300">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {'Tổng quan & Nhiệm vụ'}
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {`Kiểm toán Kỹ năng (${skillGap.overallReadiness}%)`}
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            {'Lộ trình Rèn luyện (Roadmap)'}
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'education'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {'Hướng Đào tạo & Ngành học'}
          </button>
          <button
            onClick={() => setActiveTab('experiments')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'experiments'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {'Thử nghiệm "Try-Before-Decide"'}
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-7 text-sm bg-white">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 pt-2">
              {/* Daily Tasks */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.coreTasks}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {career.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start space-x-2.5 hover:border-slate-300 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="text-slate-800 text-xs leading-relaxed">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIASEC Overlay Chart */}
              <div className="grid md:grid-cols-2 gap-6 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    {'Đối chiếu Tương quan Holland RIASEC'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    {true
                      ? `So sánh hồ sơ Holland của bạn (xanh lam) với mô hình chuẩn của nghề ${locTitle} (hổ phách).`
                      : `Comparing your personal Holland profile (blue) with target profile for ${career.title} (amber).`}
                  </p>
                  <RIASECRadarChart
                    userScores={profile.riaSecScores}
                    careerScores={career.riaSecProfile}
                    careerTitle={locTitle}
                    size="sm"
                  />
                </div>

                <div className="space-y-4 flex flex-col justify-center">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">{t.workEnvironment}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {career.workEnvironment.map((env, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {env}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">
                      {'Phong cách làm việc & Áp lực'}
                    </span>
                    <p className="text-xs text-slate-700 mt-1">{career.workStyle}</p>
                  </div>

                  {/* Compensation Disclaimer Notice */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-amber-900 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{t.salaryTier} {career.salaryInfo.levelIndicator}</span>
                    </div>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      {true ? t.salaryDisclaimer : career.salaryInfo.disclaimer}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Impact & Future Market Trends (3-5 Years Outlook) */}
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                      Phân tích Tác động AI & Triển vọng 3–5 năm
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Định hướng kỹ năng thích ứng
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {/* 1. AI Automation */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-[11px]">
                      <Bot className="w-3.5 h-3.5 text-indigo-600" />
                      <span>1. Tự động hóa & Tác vụ AI hỗ trợ</span>
                    </div>
                    {aiImpactAnalysis.aiAutomation.hasData ? (
                      <div className="space-y-1 text-[11px] text-slate-700">
                        <p className="leading-relaxed">
                          {aiImpactAnalysis.aiAutomation.automatedAspectsSummary}
                        </p>
                        {aiImpactAnalysis.aiAutomation.assistableTasks.length > 0 && (
                          <div className="pt-1 text-[10px] text-slate-500">
                            <strong>Tác vụ AI hỗ trợ đẩy nhanh:</strong> {aiImpactAnalysis.aiAutomation.assistableTasks.slice(0, 3).join('; ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Dữ liệu tự động hóa chưa có trong hệ thống</span>
                    )}
                  </div>

                  {/* 2. Human Advantage */}
                  <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-amber-950 font-bold text-[11px]">
                      <Brain className="w-3.5 h-3.5 text-amber-700" />
                      <span>2. Lợi thế Con người (Khó thay thế)</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      {aiImpactAnalysis.humanAdvantage.irreplaceableAspectsSummary}
                    </p>
                    {aiImpactAnalysis.humanAdvantage.coreAbilities.length > 0 && (
                      <div className="text-[10px] text-amber-800 pt-1 space-y-0.5">
                        {aiImpactAnalysis.humanAdvantage.coreAbilities.slice(0, 2).map((ab, idx) => (
                          <div key={idx}>• {ab}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Skill Demand */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-blue-950 font-bold text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>3. Nhu cầu Kỹ năng 3–5 năm</span>
                    </div>
                    <p className="text-[11px] text-blue-900 leading-relaxed">
                      {aiImpactAnalysis.skillDemand.marketTrendSummary}
                    </p>
                    {aiImpactAnalysis.skillDemand.emergingSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {aiImpactAnalysis.skillDemand.emergingSkills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-medium border border-blue-100">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Student Preparation */}
                  <div className="p-3 bg-white rounded-xl border border-indigo-200/80 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-indigo-950 font-bold text-[11px]">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      <span>4. Chuẩn bị cho học sinh</span>
                    </div>
                    <ul className="text-[10px] text-indigo-900 space-y-1 leading-tight">
                      {aiImpactAnalysis.preparation.tailoredAdvice.slice(0, 2).map((adv, idx) => (
                        <li key={idx}>• {adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. Uncertainty Disclaimer */}
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[10px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Phân định căn cứ:</strong> Dữ liệu đã xác thực: {aiImpactAnalysis.groundingAndUncertainty.knownData[0]}. {aiImpactAnalysis.groundingAndUncertainty.disclaimer}
                  </div>
                </div>
              </div>

              {/* Career Progression Ladder */}
              {career.progressionPath && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {'Lộ trình Thăng tiến & Nấc thang Sự nghiệp'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Khởi đầu (Entry-level):</span>
                      <p className="text-slate-800 font-medium">{career.progressionPath.entry}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-indigo-200 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Trung cấp (Mid-level):</span>
                      <p className="text-indigo-950 font-medium">{career.progressionPath.mid}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Chuyên gia / Quản lý (Senior):</span>
                      <p className="text-emerald-950 font-medium">{career.progressionPath.senior}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Advantages & Challenges */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                {career.advantages && career.advantages.length > 0 && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                    <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Điểm mạnh & Lợi thế của ngành:</span>
                    </h5>
                    <ul className="list-disc list-inside text-emerald-950 space-y-1 text-[11px]">
                      {career.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {career.challenges && career.challenges.length > 0 && (
                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                    <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Thách thức cần lưu ý:</span>
                    </h5>
                    <ul className="list-disc list-inside text-amber-950 space-y-1 text-[11px]">
                      {career.challenges.map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 pt-2">
              {/* Readiness bar */}
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">
                    {'Chỉ số Sẵn sàng Năng lực'}
                  </h4>
                  <p className="text-xs text-indigo-700">
                    {true
                      ? `Được tính dựa trên kỹ năng tự đánh giá và yêu cầu của nghề ${locTitle}.`
                      : `Based on your verified skills and self-ratings relative to ${career.title}.`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-indigo-600">{skillGap.overallReadiness}%</span>
                  <p className="text-[10px] text-indigo-500">{t.readinessTitle}</p>
                </div>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-4">
                {/* Missing Skills */}
                {skillGap.missingSkills.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t.missingSkills} ({skillGap.missingSkills.length})</span>
                    </h5>
                    <div className="space-y-2">
                      {skillGap.missingSkills.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-rose-950">{item.skill}</span>
                            <p className="text-rose-700 text-[11px] mt-0.5">{item.recommendedAction}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-rose-200/80 text-rose-900 text-[10px] font-bold">
                            {item.priority === 'High' ? t.priorityHigh : item.priority === 'Medium' ? t.priorityMedium : t.priorityLow}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Already Strong Skills */}
                {skillGap.strongSkills.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.strongSkills} ({skillGap.strongSkills.length})</span>
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {skillGap.strongSkills.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-emerald-950">{item.skill}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-semibold">
                            {t.mastered}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 pt-2">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Map className="w-4 h-4 text-indigo-600" />
                    <span>Lộ trình Rèn luyện Cá nhân hóa theo Lứa tuổi</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    {roadmap.phases.length} giai đoạn rèn luyện
                  </span>
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  {roadmap.tailoredNote}
                </p>
              </div>

              {/* Roadmap Phases */}
              <div className="space-y-4">
                {roadmap.phases.map((phase) => (
                  <div
                    key={phase.phaseNumber}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {phase.phaseNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {phase.name}
                        </h5>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 self-start sm:self-center">
                        Thời lượng: {phase.duration}
                      </span>
                    </div>

                    {/* Objectives */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MỤC TIÊU GIAI ĐOẠN:</span>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        {phase.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills to Learn */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">KỸ NĂNG CẦN TÍCH LŨY:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.skillsToLearn.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-900 text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Projects or Recommended Activities */}
                    {phase.projects && phase.projects.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-800 text-[11px]">Dự án rèn luyện thực tế:</span>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                          {phase.projects.map((proj, i) => (
                            <li key={i}>{proj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Milestone */}
                    {phase.milestone && (
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center space-x-2 text-emerald-900">
                        <Milestone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>Cột mốc hoàn thành:</strong> {phase.milestone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.educationAndTraining}
                </h4>
                <div className="space-y-3">
                  {career.educationPaths.map((path, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-slate-900 text-xs">{path.type}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{path.duration}</span>
                      </div>
                      <p className="text-xs text-slate-700">{path.description}</p>
                      <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {'Đặc điểm & Đánh đổi:'}
                        </span>{' '}
                        {path.tradeoffs}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Majors */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-700 mb-2">
                  {'Các ngành học Đại học / Cao đẳng liên quan'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {career.relatedMajors.map((major, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800">
                      {major}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIMENTS */}
          {activeTab === 'experiments' && (
            <div className="space-y-6 pt-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {t.microExperiments}
                </h4>
                <p className="text-xs text-slate-500">
                  {true
                    ? 'Thực hiện thử nghiệm vi mô không tốn kém giúp bạn trải nghiệm thực tế công việc trước khi đầu tư thời gian học tập nhiều năm.'
                    : 'Completing a low-risk micro-experiment helps you discover whether you actually enjoy daily reality before committing years of education.'}
                </p>
              </div>

              <div className="space-y-3">
                {career.experiments.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FlaskConical className="w-4 h-4 text-sky-700" />
                        <span className="font-bold text-sky-950 text-xs">{exp.title}</span>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                        {'Thời gian:'} {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs text-sky-900 leading-relaxed">{exp.description}</p>
                    <div className="pt-2 border-t border-sky-200/80 text-[11px] text-sky-800">
                      <span className="font-bold">{'Câu hỏi Tự đánh giá sau trải nghiệm:'}</span> {exp.evaluationQuestion}
                    </div>
                  </div>
                ))}
              </div>

              {/* Starter Projects */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-800">
                  {'Dự án Khởi đầu Gợi ý'}
                </h5>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {career.beginnerProjects.map((proj, i) => (
                    <li key={i}>{proj}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onToggleCompare(career.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isCompared
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isCompared ? `✓ ${t.removeFromCompare}` : `+ ${t.addToCompare}`}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenCounselor(career);
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.askAICounselor}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
