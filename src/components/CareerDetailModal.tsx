import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Sparkles,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import { Career, UserProfile, RecommendationScore } from '../types';
import { analyzeSkillGap } from '../engine/skillGapEngine';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'education' | 'experiments'>('overview');

  if (!career) return null;

  const skillGap = analyzeSkillGap(profile, career);
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

          {/* TAB 3: EDUCATION */}
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
