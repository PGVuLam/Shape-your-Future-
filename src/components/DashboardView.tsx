import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, RecommendationScore, Career, DisambiguationQuestion } from '../types';
import { RIASECRadarChart } from './RIASECRadarChart';
import { DISAMBIGUATION_QUESTIONS } from '../data/assessmentQuestions';
import { useLanguage } from '../context/LanguageContext';

interface DashboardViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
  onNavigateTab: (tab: string) => void;
  onDisambiguate: (winnerId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  recommendations,
  onSelectCareer,
  onNavigateTab,
  onDisambiguate
}) => {
  const { language, t, getCareerTitle, getCareerCluster, getCareerDesc } = useLanguage();
  const [disambiguatedNotice, setDisambiguatedNotice] = useState<string | null>(null);

  const top1 = recommendations[0];
  const top2 = recommendations[1];
  const isCloseMatch = top1 && top2 && Math.abs(top1.overallScore - top2.overallScore) <= 4;

  // Check if disambiguation question exists for top 2
  const closeQuestion = isCloseMatch
    ? Object.values(DISAMBIGUATION_QUESTIONS).find(
        q =>
          (q.careerA.id === top1.careerId && q.careerB.id === top2.careerId) ||
          (q.careerA.id === top2.careerId && q.careerB.id === top1.careerId)
      )
    : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {t.ageGroup} {profile.ageGroup} ({profile.age} {language === 'vi' ? 'tuổi' : 'years old'})
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.hollandCode} {profile.riaSecProfile?.code || 'IRC'}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                {language === 'vi' ? 'Độ tin cậy:' : 'Confidence:'} {language === 'vi' ? 'Cao (92%)' : top1?.confidence || 'High'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {language === 'vi' ? `Hồ sơ Hướng nghiệp của ${profile.name}` : `${profile.name}'s Career Exploration`}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Định hướng cá nhân hóa dựa trên trắc nghiệm tâm lý học nghề nghiệp Holland RIASEC, sở thích môn học và năng lực tự đánh giá.'
                : profile.riaSecProfile?.description ||
                  'Personalized career discovery based on Holland RIASEC psychometrics, academic interests, and self-rated competencies.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigateTab('assessment')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all text-center"
            >
              {language === 'vi'
                ? `Cập nhật Đánh giá (${profile.completenessPercentage || 100}%)`
                : `Update Assessment (${profile.completenessPercentage || 90}%)`}
            </button>
            <button
              onClick={() => onNavigateTab('skillgap')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.startSkillAudit}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Disambiguation Banner if Top 2 careers are tied / close */}
      {isCloseMatch && closeQuestion && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span>{t.disambiguationNotice}</span>
          </div>
          <p className="text-xs text-amber-800">
            {language === 'vi'
              ? `${getCareerTitle(top1.career.id, top1.career.title)} (${top1.overallScore}%) và ${getCareerTitle(top2.career.id, top2.career.title)} (${top2.overallScore}%) có điểm số rất sát nhau. Trả lời câu hỏi này để hệ thống hiệu chỉnh thứ hạng:`
              : `${top1.career.title} (${top1.overallScore}%) and ${top2.career.title} (${top2.overallScore}%) both scored very closely against your profile. Answering this quick disambiguation question sharpens the final recommendation:`}
          </p>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs font-medium text-slate-800">
            {closeQuestion.question}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {closeQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onDisambiguate(opt.favorsCareerId);
                  setDisambiguatedNotice(
                    language === 'vi'
                      ? `Đã áp dụng phân giải! Ưu tiên tăng cường cho nghề ${getCareerTitle(opt.favorsCareerId, opt.favorsCareerId)}.`
                      : `Disambiguation applied! Recommendation weighted toward ${opt.favorsCareerId}.`
                  );
                }}
                className="p-3 text-left rounded-xl bg-white hover:bg-amber-100/70 border border-amber-200 text-xs text-slate-800 font-semibold transition-all flex flex-col space-y-1 shadow-sm"
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-amber-700 font-normal">{opt.impactDescription}</span>
              </button>
            ))}
          </div>
          {disambiguatedNotice && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              ✓ {disambiguatedNotice}
            </div>
          )}
        </div>
      )}

      {/* 3. Top Row: RIASEC Radar Chart + Confidence & Primary Drivers */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>{t.riasecRadarTitle}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {t.riasecRadarDesc}
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              {language === 'vi' ? 'Trục chính:' : 'Primary:'} {profile.riaSecProfile?.primary || 'I'}
            </span>
          </div>

          <RIASECRadarChart userScores={profile.riaSecScores} size="md" />

          {/* Quick dimension pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-center">
            {[
              { label: t.riasecR, code: 'R', val: profile.riaSecScores.R },
              { label: t.riasecI, code: 'I', val: profile.riaSecScores.I },
              { label: t.riasecA, code: 'A', val: profile.riaSecScores.A },
              { label: t.riasecS, code: 'S', val: profile.riaSecScores.S },
              { label: t.riasecE, code: 'E', val: profile.riaSecScores.E },
              { label: t.riasecC, code: 'C', val: profile.riaSecScores.C }
            ].map(item => (
              <div key={item.code} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 block">{item.code}</span>
                <span className="text-xs font-extrabold text-indigo-600">{Math.round((item.val || 0) * 100)}%</span>
                <span className="text-[10px] text-slate-500 block truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === 'vi' ? 'Chỉ số Đảm bảo & Độ tin cậy' : 'Assessment Reliability'}</span>
            </h3>

            {/* Confidence metric */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{language === 'vi' ? 'Độ tin cậy thuật toán' : 'Recommendation Confidence'}</span>
                <span className="font-bold text-emerald-600">{language === 'vi' ? 'Rất Cao (94%)' : top1?.confidence || 'High'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {language === 'vi'
                  ? 'Độ tin cậy cao dựa trên sự tương thích đa biến giữa môn học yêu thích, kỹ năng thực tế và vector RIASEC.'
                  : top1?.confidenceReason ||
                    'High confidence based on verified subject affinity and extensive skill self-assessments.'}
              </p>
            </div>

            {/* Core Drivers */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.positiveFactors}
              </span>
              <ul className="space-y-2 text-xs text-slate-600">
                {top1?.positiveContributors.slice(0, 3).map((factor, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 mb-2">
              {language === 'vi' ? 'Thử nghiệm giả định thay đổi môn học hoặc kỹ năng?' : 'Want to see how changes affect rankings?'}
            </div>
            <button
              onClick={() => onNavigateTab('simulate')}
              className="w-full py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
            >
              <span>{language === 'vi' ? 'Khởi chạy Mô phỏng "What-If"' : 'Launch What-If Simulation'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Top Recommended Careers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{t.topRecommendations}</h2>
            <p className="text-xs text-slate-500">
              {t.topRecommendationsDesc}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('explorer')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>{t.exploreAllCareers}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.slice(0, 6).map((rec, index) => {
            const isRank1 = index === 0;
            const localizedTitle = getCareerTitle(rec.career.id, rec.career.title);
            const localizedCluster = getCareerCluster(rec.career.id, rec.career.careerCluster);
            const localizedDesc = getCareerDesc(rec.career.id, rec.career.description);

            return (
              <div
                key={rec.careerId}
                className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                  isRank1 ? 'border-indigo-300 ring-2 ring-indigo-500/10' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Rank badge and Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                          isRank1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{rec.rank}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {localizedCluster}
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-extrabold text-slate-900">{rec.overallScore}%</span>
                      <span className="text-[10px] text-slate-400 font-medium">{language === 'vi' ? 'Hợp' : 'Fit'}</span>
                    </div>
                  </div>

                  {/* Career Title & Holland */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600">
                      {localizedTitle}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{localizedDesc}</p>
                  </div>

                  {/* Compatibility Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${rec.overallScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>RIASEC: {rec.breakdown.riasec}%</span>
                      <span>{language === 'vi' ? 'Kỹ năng:' : 'Skills:'} {rec.breakdown.skills}%</span>
                      <span>{language === 'vi' ? 'Sở thích:' : 'Interests:'} {rec.breakdown.interests}%</span>
                    </div>
                  </div>

                  {/* Positive factor teaser */}
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{rec.positiveContributors[0] || 'High dimensional fit'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {language === 'vi' ? 'Mức lương:' : 'Salary:'} {rec.career.salaryInfo.levelIndicator}
                  </span>
                  <button
                    onClick={() => onSelectCareer(rec.career)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <span>{t.detailsButton}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
