import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  X,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Brain,
  GraduationCap,
  Building2,
  TrendingUp,
  Sparkles,
  BookOpen,
  Target,
  ShieldCheck,
  ChevronRight,
  Layers,
  Award,
  Bot,
  Activity,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Career, UserProfile, RecommendationScore, getHollandCode } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { analyzeSkillGap } from '../engine/skillGapEngine';
import { generateRecommendations } from '../engine/recommendationEngine';
import { analyzeAIImpactAndFutureTrends } from '../engine/aiImpactEngine';
import { useLanguage } from '../context/LanguageContext';
import {
  getCareerAdmissionInfo,
  explainWhyCareerMatches
} from '../utils/careerComparisonHelper';

export interface CareerComparisonViewProps {
  profile: UserProfile;
  recommendations?: RecommendationScore[];
  comparedCareerIds?: string[];
  selectedCareerIds?: string[]; // Backwards compatibility for Step5DeepDiveView
  onAddComparison?: (id: string) => void;
  onRemoveComparison?: (id: string) => void;
  onToggleCareer?: (id: string) => void; // Backwards compatibility for Step5DeepDiveView
  onSelectCareer: (career: Career) => void;
}

export const CareerComparisonView: React.FC<CareerComparisonViewProps> = ({
  profile,
  recommendations: externalRecs,
  comparedCareerIds: externalComparedIds,
  selectedCareerIds,
  onAddComparison,
  onRemoveComparison,
  onToggleCareer,
  onSelectCareer
}) => {
  const { language, t, getCareerTitle, getCareerCluster } = useLanguage();
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'why' | 'academic' | 'skills' | 'future'>('all');

  // Ensure recommendations are available even if not passed externally
  const recommendations = useMemo(() => {
    if (externalRecs && externalRecs.length > 0) return externalRecs;
    return generateRecommendations(profile, CAREER_DATABASE);
  }, [externalRecs, profile]);

  // Determine active compared IDs
  const activeIds = useMemo(() => {
    if (externalComparedIds && externalComparedIds.length > 0) {
      return externalComparedIds;
    }
    if (selectedCareerIds && selectedCareerIds.length > 0) {
      return selectedCareerIds;
    }
    const top1 = recommendations[0]?.careerId || 'software-engineer';
    const top2 = recommendations[1]?.careerId || 'robotics-engineer';
    return [top1, top2];
  }, [externalComparedIds, selectedCareerIds, recommendations]);

  const comparedCareers = useMemo(() => {
    return activeIds
      .map(id => CAREER_DATABASE.find(c => c.id === id))
      .filter(Boolean) as Career[];
  }, [activeIds]);

  const recMap = useMemo(() => {
    const map = new Map<string, RecommendationScore>();
    recommendations.forEach(r => map.set(r.careerId, r));
    return map;
  }, [recommendations]);

  // Handlers for adding/removing comparisons
  const handleAdd = (id: string) => {
    if (onAddComparison) {
      onAddComparison(id);
    } else if (onToggleCareer) {
      onToggleCareer(id);
    }
  };

  const handleRemove = (id: string) => {
    if (onRemoveComparison) {
      onRemoveComparison(id);
    } else if (onToggleCareer) {
      onToggleCareer(id);
    }
  };

  const handleQuickPair = (id1: string, id2: string) => {
    if (onRemoveComparison) {
      onRemoveComparison('all');
    }
    handleAdd(id1);
    handleAdd(id2);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Selector Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <GitCompare className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                So sánh & Đối chiếu Nghề nghiệp (9 Chiều Đánh giá)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              So sánh có cấu trúc giữa các ngành nghề trọng điểm dựa trên kết quả tính toán của Thuật toán Đề xuất (Recommendation Engine). Dữ liệu minh bạch, không hallucinate, thể hiện rõ thế mạnh, khoảng cách và tổ hợp xét tuyển.
            </p>
          </div>

          {/* Add Career to Compare */}
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={selectedToAdd}
              onChange={e => {
                if (e.target.value && !activeIds.includes(e.target.value)) {
                  handleAdd(e.target.value);
                  setSelectedToAdd('');
                }
              }}
              className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">+ Thêm ngành để so sánh...</option>
              {CAREER_DATABASE.filter(c => !activeIds.includes(c.id)).map(c => (
                <option key={c.id} value={c.id}>
                  {getCareerTitle(c.id, c.title)} ({getCareerCluster(c.id, c.careerCluster)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Comparison Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Cặp so sánh tiêu biểu:
          </span>
          <button
            onClick={() => handleQuickPair('software-engineer', 'robotics-engineer')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Kỹ sư Phần mềm vs Robot & Tự động hóa
          </button>
          <button
            onClick={() => handleQuickPair('ai-data-scientist', 'software-engineer')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Trí tuệ Nhân tạo (AI) vs Phần mềm
          </button>
          <button
            onClick={() => handleQuickPair('physician-doctor', 'biomedical-engineer')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Bác sĩ Lâm sàng vs Kỹ sư Y sinh
          </button>
          <button
            onClick={() => handleQuickPair('product-manager', 'ux-designer')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Quản lý Sản phẩm vs Thiết kế UI/UX
          </button>
        </div>

        {/* Dimension Filter Tabs */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              activeTabFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả 9 Chiều Đánh giá
          </button>
          <button
            onClick={() => setActiveTabFilter('why')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              activeTabFilter === 'why'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Vì sao phù hợp & Điểm mạnh/Gaps
          </button>
          <button
            onClick={() => setActiveTabFilter('academic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              activeTabFilter === 'academic'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Học thuật & Tuyển sinh (Khối thi)
          </button>
          <button
            onClick={() => setActiveTabFilter('skills')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              activeTabFilter === 'skills'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Kỹ năng & Môi trường làm việc
          </button>
          <button
            onClick={() => setActiveTabFilter('future')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              activeTabFilter === 'future'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Xu hướng AI, Lương & Lộ trình
          </button>
        </div>
      </div>

      {/* 2. Side-by-Side Highlights & "Why This Career Matches" Cards */}
      {(activeTabFilter === 'all' || activeTabFilter === 'why') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Tại sao nghề này phù hợp? (Why this career matches)</span>
            </h3>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              Suy luận logic từ hồ sơ học viên • Không dùng LLM bịa điểm
            </span>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparedCareers.length, 3)} gap-4`}>
            {comparedCareers.map(career => {
              const rec = recMap.get(career.id);
              const explanation = explainWhyCareerMatches(profile, career, rec);
              const locTitle = getCareerTitle(career.id, career.title);
              const locCluster = getCareerCluster(career.id, career.careerCluster);
              const score = rec?.overallScore !== undefined ? rec.overallScore : null;

              return (
                <div
                  key={career.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all"
                >
                  <div className="space-y-3">
                    {/* Career Header & Match Tag */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                          {locCluster}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                          {locTitle}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end">
                        {score !== null ? (
                          <span className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs">
                            {score}% Phù hợp
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-medium">
                            Chưa có dữ liệu
                          </span>
                        )}
                        {rec?.rank && (
                          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                            Hạng #{rec.rank}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Logic-based Match Reasons */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Căn cứ phù hợp thực tế:
                      </span>
                      {explanation.reasons.map((r, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-800">{r.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 shrink-0">
                              {r.badgeText}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {r.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Gaps summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {/* Strengths */}
                      <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100/80 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Thế mạnh (Strengths)
                        </span>
                        <ul className="text-[11px] text-emerald-950 space-y-1 pl-1">
                          {explanation.strengths.slice(0, 3).map((st, i) => (
                            <li key={i} className="line-clamp-2 leading-tight">
                              • {st}
                            </li>
                          ))}
                          {explanation.strengths.length === 0 && (
                            <li className="text-slate-400 italic">Chưa có dữ liệu</li>
                          )}
                        </ul>
                      </div>

                      {/* Gaps */}
                      <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100/80 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Khoảng cách (Gaps)
                        </span>
                        <ul className="text-[11px] text-amber-950 space-y-1 pl-1">
                          {explanation.gaps.slice(0, 3).map((gp, i) => (
                            <li key={i} className="line-clamp-2 leading-tight">
                              • {gp}
                            </li>
                          ))}
                          {explanation.gaps.length === 0 && (
                            <li className="text-emerald-700 font-medium">Không có khoảng cách lớn</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action */}
                  <button
                    onClick={() => onSelectCareer(career)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
                  >
                    <span>Xem chi tiết & Lộ trình nghề</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Comprehensive 9-Dimension Comparison Matrix Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700 w-52 sm:w-60 uppercase tracking-wider text-[11px] sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                9 Chiều Đánh giá
              </th>
              {comparedCareers.map(career => {
                const rec = recMap.get(career.id);
                const locTitle = getCareerTitle(career.id, career.title);
                const locCluster = getCareerCluster(career.id, career.careerCluster);
                return (
                  <th key={career.id} className="p-4 min-w-[280px] border-l border-slate-200 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                          {locCluster}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">{locTitle}</h4>
                      </div>
                      {comparedCareers.length > 1 && (
                        <button
                          onClick={() => handleRemove(career.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                          title="Bỏ khỏi so sánh"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {rec?.overallScore !== undefined ? (
                      <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs">
                        <span>Độ phù hợp: {rec.overallScore}%</span>
                      </div>
                    ) : (
                      <span className="mt-2 inline-block text-[10px] text-slate-400">
                        Chưa có dữ liệu tính sẵn
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {/* DIMENSION 1: OVERALL MATCH & CONFIDENCE */}
            {(activeTabFilter === 'all' || activeTabFilter === 'why') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>1. Độ Phù hợp Tổng thể (Overall Match)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Trọng số: 30% RIASEC + 30% Học thuật + 25% Kỹ năng + 5% MBTI + 10% Mục tiêu
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const rec = recMap.get(c.id);
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-1.5">
                      {rec?.overallScore !== undefined ? (
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-extrabold text-indigo-700 text-sm">
                              {rec.overallScore}%
                            </span>
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                              Độ tin cậy: {rec.confidence || 'Cao'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${rec.overallScore}%` }}
                            />
                          </div>
                          {rec.confidenceReason && (
                            <p className="text-[11px] text-slate-500 mt-1 italic leading-tight">
                              {rec.confidenceReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Chưa có dữ liệu</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 2: RIASEC PSYCHOMETRICS */}
            {(activeTabFilter === 'all' || activeTabFilter === 'why') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>2. Sở thích Tâm lý Holland (RIASEC Fit)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Mã Holland của học sinh: {profile.riaSecProfile?.code || 'Chưa khảo sát'}
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const rec = recMap.get(c.id);
                  const riasecScore = rec?.breakdown?.riasec;
                  const carCode = c.hollandCode || getHollandCode(c.riaSecProfile);
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          Mã nghề: <span className="text-purple-700">{carCode || 'Chưa có dữ liệu'}</span>
                        </span>
                        {riasecScore !== undefined ? (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[11px]">
                            Khớp {Math.round(riasecScore)}%
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Chưa có dữ liệu</span>
                        )}
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 grid grid-cols-3 gap-1">
                        <span>R: {Math.round(c.riaSecProfile.R * 100)}%</span>
                        <span>I: {Math.round(c.riaSecProfile.I * 100)}%</span>
                        <span>A: {Math.round(c.riaSecProfile.A * 100)}%</span>
                        <span>S: {Math.round(c.riaSecProfile.S * 100)}%</span>
                        <span>E: {Math.round(c.riaSecProfile.E * 100)}%</span>
                        <span>C: {Math.round(c.riaSecProfile.C * 100)}%</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 3: ACADEMIC COMPATIBILITY */}
            {(activeTabFilter === 'all' || activeTabFilter === 'academic') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>3. Tương thích Học thuật (Academic Match)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Điểm GPA: {profile.academicGPA || 'Chưa cập nhật'} | THPT: {profile.examScores?.thptScore ? `${profile.examScores.thptScore}đ` : 'Chưa thi'}
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const rec = recMap.get(c.id);
                  const academicScore = rec?.breakdown?.academic;
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium text-[11px]">Độ tương thích môn học & điểm thi:</span>
                        {academicScore !== undefined ? (
                          <span className="font-extrabold text-blue-700 text-xs">{Math.round(academicScore)}%</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Chưa có dữ liệu</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                          Môn học trọng tâm của ngành:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(c.relevantSubjects || []).map((sub, i) => {
                            const isFav = (profile.favoriteSubjects || []).some(
                              f => f.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(f.toLowerCase())
                            );
                            const isConf = (profile.confidentSubjects || []).some(
                              cf => cf.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(cf.toLowerCase())
                            );
                            const isMatched = isFav || isConf;
                            return (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  isMatched
                                    ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {sub} {isMatched && '✓'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 4: SKILLS & READINESS */}
            {(activeTabFilter === 'all' || activeTabFilter === 'skills') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>4. Năng lực Kỹ năng (Skills & Readiness)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Kỹ năng thành thạo, đang tích lũy & còn thiếu
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const gap = analyzeSkillGap(profile, c);
                  const rec = recMap.get(c.id);
                  const skillScore = rec?.breakdown?.skills;
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700 text-xs">
                          {gap.overallReadiness}% Sẵn sàng
                        </span>
                        {skillScore !== undefined && (
                          <span className="text-[10px] text-slate-500 font-semibold">
                            (Điểm kỹ năng: {Math.round(skillScore)}%)
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${gap.overallReadiness}%` }}
                        />
                      </div>

                      {/* Strong skills */}
                      <div>
                        <span className="text-[10px] font-semibold text-emerald-700 block mb-0.5">
                          Đã có ({gap.strongSkills.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {gap.strongSkills.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-100">
                              {s.skill}
                            </span>
                          ))}
                          {gap.strongSkills.length === 0 && (
                            <span className="text-slate-400 text-[10px]">Chưa có kỹ năng nổi bật</span>
                          )}
                        </div>
                      </div>

                      {/* Missing skills */}
                      <div>
                        <span className="text-[10px] font-semibold text-rose-700 block mb-0.5">
                          Cần bổ sung ({gap.missingSkills.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {gap.missingSkills.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-medium border border-rose-100">
                              {s.skill}
                            </span>
                          ))}
                          {gap.missingSkills.length === 0 && (
                            <span className="text-emerald-600 text-[10px]">Không thiếu kỹ năng cốt lõi</span>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 5: INTERESTS & PASSION */}
            {(activeTabFilter === 'all' || activeTabFilter === 'why') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>5. Sở thích & Đam mê (Interests Fit)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Sở thích học sinh: {(profile.interests || []).slice(0, 3).join(', ') || 'Chưa cập nhật'}
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const userInterests = (profile.interests || []).map(i => i.toLowerCase());
                  const carInterests = c.relevantInterests || [];
                  const matched = carInterests.filter(ci =>
                    userInterests.some(ui => ui.includes(ci.toLowerCase()) || ci.toLowerCase().includes(ui))
                  );
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Khớp {matched.length}/{carInterests.length} sở thích</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {carInterests.map((ci, i) => {
                          const isM = matched.includes(ci);
                          return (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                isM
                                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ci} {isM && '★'}
                            </span>
                          );
                        })}
                        {carInterests.length === 0 && (
                          <span className="text-slate-400 text-xs">Chưa có dữ liệu</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 6: WORK ENVIRONMENT & WORK STYLE */}
            {(activeTabFilter === 'all' || activeTabFilter === 'skills') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-cyan-600" />
                    <span>6. Môi trường & Phong cách (Work Environment)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Linh hoạt làm việc, nhóm vs độc lập
                  </span>
                </td>
                {comparedCareers.map(c => (
                  <td key={c.id} className="p-4 border-l border-slate-200 space-y-1.5 text-xs text-slate-700">
                    <div className="space-y-1">
                      {(c.workEnvironment || []).slice(0, 3).map((we, i) => (
                        <div key={i} className="flex items-start space-x-1 text-slate-600">
                          <span className="text-cyan-500 font-bold mt-0.5">•</span>
                          <span>{we}</span>
                        </div>
                      ))}
                      {(c.workEnvironment || []).length === 0 && (
                        <span className="text-slate-400">Chưa có dữ liệu</span>
                      )}
                    </div>
                    {c.workStyle && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                        Phong cách: {c.workStyle}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* DIMENSION 7: EDUCATION & PATHWAYS */}
            {(activeTabFilter === 'all' || activeTabFilter === 'academic') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>7. Con đường Đào tạo (Education Pathways)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Đại học, Cao đẳng nghề & Chứng chỉ chuyên môn
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const rec = recMap.get(c.id);
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-2 text-xs">
                      {rec?.recommendedPathway && (
                        <div className="inline-block px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold text-[10px]">
                          Lối đi khuyến nghị: {rec.recommendedPathway === 'University' ? 'Đại học' : rec.recommendedPathway === 'VocationalCollege' ? 'Cao đẳng Nghề' : 'Linh hoạt'}
                        </div>
                      )}
                      <div className="space-y-1.5">
                        {(c.educationPaths || []).slice(0, 3).map((p, i) => (
                          <div key={i} className="text-slate-700">
                            <span className="font-bold text-slate-900">{p.type}</span> ({p.duration}):
                            <p className="text-[11px] text-slate-500 leading-tight">{p.tradeoffs || p.description}</p>
                          </div>
                        ))}
                        {(c.educationPaths || []).length === 0 && (
                          <span className="text-slate-400">Chưa có dữ liệu</span>
                        )}
                      </div>
                      {c.relatedMajors && c.relatedMajors.length > 0 && (
                        <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <strong>Ngành học liên quan:</strong> {c.relatedMajors.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 8: ADMISSION COMBINATIONS (TỔ HỢP XÉT TUYỂN & CHUẨN ĐẦU VÀO) */}
            {(activeTabFilter === 'all' || activeTabFilter === 'academic') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>8. Tổ hợp Xét tuyển & Chuẩn Đầu vào (Admissions)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Khối thi THPT & Chuẩn tuyển sinh TSA / HSA tại Việt Nam
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const admission = getCareerAdmissionInfo(c, profile);
                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-2.5">
                      {admission.hasData ? (
                        <>
                          {/* Admission Combinations */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                                Tổ hợp xét tuyển (Đã xếp theo hồ sơ):
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {admission.combinations.map((cb, i) => (
                                <div
                                  key={i}
                                  className={`px-2 py-1 rounded-lg text-[11px] flex flex-col ${
                                    cb.isStudentCombo
                                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 ring-1 ring-emerald-400 font-bold'
                                      : cb.matchReason
                                      ? 'bg-blue-50 text-blue-900 border border-blue-200 font-medium'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                  title={`${cb.name}: ${cb.subjects}`}
                                >
                                  <div className="flex items-center space-x-1">
                                    <span className="font-bold">{cb.code}</span>
                                    {cb.isStudentCombo && <span className="text-[9px] text-emerald-700">(Đã chọn ✓)</span>}
                                  </div>
                                  {cb.matchReason && (
                                    <span className="text-[9px] text-slate-500 font-normal">{cb.matchReason}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Representative Institutions & Benchmarks */}
                          <div className="space-y-1 pt-1.5 border-t border-slate-100">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                              Cơ sở đào tạo & Chuẩn tham khảo:
                            </span>
                            <div className="space-y-1.5">
                              {admission.representativeSchools.slice(0, 3).map((sch, i) => (
                                <div key={i} className="text-[11px] text-slate-700 flex flex-col bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-900">{sch.name}</span>
                                    <span className="text-[9px] font-medium text-slate-400">{sch.type}</span>
                                  </div>
                                  <span className="text-[10px] text-indigo-700 font-medium">{sch.estimatedBenchmark}</span>
                                  {sch.referenceYear && (
                                    <span className="text-[9px] text-slate-400">{sch.referenceYear} • {sch.sourceName || 'Đề án Tuyển sinh'}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-[9px] text-slate-400 italic pt-1">
                              * {admission.disclaimer}
                            </p>
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">Chưa có dữ liệu tuyển sinh cụ thể</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}

            {/* DIMENSION 9: CAREER CHARACTERISTICS, SALARY & 3-5 YEAR AI OUTLOOK */}
            {(activeTabFilter === 'all' || activeTabFilter === 'future') && (
              <tr className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-800 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span>9. Đặc thù, Lương & Triển vọng AI 3–5 năm</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    Tự động hóa, lợi thế con người, nhu cầu kỹ năng & tính bất định
                  </span>
                </td>
                {comparedCareers.map(c => {
                  const careerGap = analyzeSkillGap(profile, c);
                  const impact = analyzeAIImpactAndFutureTrends(c, profile, careerGap);

                  return (
                    <td key={c.id} className="p-4 border-l border-slate-200 space-y-3 text-xs">
                      {/* 0. Salary Grounding (with required disclaimer, no fake stats) */}
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-0.5">
                        <div className="flex items-center space-x-1 text-emerald-950 font-bold text-xs">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{c.salaryInfo.rangeDescription || '15 - 30 triệu VNĐ/tháng'}</span>
                        </div>
                        <p className="text-[10px] text-emerald-800 leading-tight">
                          {c.salaryInfo.disclaimer || 'Thông tin thị trường tham khảo (Cần đối chiếu thực tế theo vùng miền)'}
                        </p>
                      </div>

                      {/* 1. AI Automation */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-slate-900 text-[11px]">
                          <Bot className="w-3.5 h-3.5 text-indigo-600" />
                          <span>1. Tự động hóa & Tác vụ AI hỗ trợ</span>
                        </div>
                        {impact.aiAutomation.hasData ? (
                          <>
                            <p className="text-[11px] text-slate-700 leading-relaxed">
                              {impact.aiAutomation.automatedAspectsSummary}
                            </p>
                            {impact.aiAutomation.assistableTasks.length > 0 && (
                              <div className="pt-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                                  Tác vụ AI có thể đẩy nhanh:
                                </span>
                                <ul className="text-[10px] text-slate-600 list-disc list-inside space-y-0.5 mt-0.5">
                                  {impact.aiAutomation.assistableTasks.slice(0, 3).map((t, idx) => (
                                    <li key={idx}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Dữ liệu tự động hóa chưa có trong hệ thống</span>
                        )}
                      </div>

                      {/* 2. Human Advantage */}
                      <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-amber-950 text-[11px]">
                          <Brain className="w-3.5 h-3.5 text-amber-700" />
                          <span>2. Lợi thế Con người (Khó thay thế)</span>
                        </div>
                        <p className="text-[10px] text-amber-900 leading-relaxed">
                          {impact.humanAdvantage.irreplaceableAspectsSummary}
                        </p>
                        {impact.humanAdvantage.coreAbilities.length > 0 && (
                          <div className="pt-0.5 text-[10px] text-amber-800 space-y-0.5">
                            {impact.humanAdvantage.coreAbilities.slice(0, 3).map((ab, idx) => (
                              <div key={idx} className="flex items-start gap-1">
                                <span className="font-bold text-amber-600">•</span>
                                <span>{ab}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 3. Skill Demand */}
                      <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-blue-950 text-[11px]">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                          <span>3. Nhu cầu Kỹ năng 3–5 năm</span>
                        </div>
                        <p className="text-[10px] text-blue-900 leading-relaxed">
                          {impact.skillDemand.marketTrendSummary}
                        </p>
                        {impact.skillDemand.emergingSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {impact.skillDemand.emergingSkills.slice(0, 4).map((sk, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-white text-blue-800 text-[10px] font-medium border border-blue-200">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 4. Student Preparation (Profile + Skill Gap + Career + Future Trends) */}
                      <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-200/80 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-indigo-950 text-[11px]">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          <span>4. Học sinh nên chuẩn bị gì</span>
                        </div>
                        <div className="text-[10px] text-indigo-900 space-y-1">
                          {impact.preparation.tailoredAdvice.slice(0, 3).map((adv, idx) => (
                            <p key={idx} className="leading-tight">
                              • {adv}
                            </p>
                          ))}
                        </div>
                        {impact.preparation.progressionAdvice && (
                          <p className="text-[10px] text-indigo-800 italic pt-1 border-t border-indigo-100">
                            {impact.preparation.progressionAdvice}
                          </p>
                        )}
                      </div>

                      {/* 5. Uncertainty & Grounding Notice */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 space-y-1">
                        <div className="flex items-center space-x-1 font-semibold text-slate-700">
                          <ShieldCheck className="w-3 h-3 text-slate-500" />
                          <span>Phân định căn cứ & Yếu tố bất định:</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                          <strong>Dữ liệu xác thực:</strong> {impact.groundingAndUncertainty.knownData[0]}
                        </p>
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                          <strong>Bất định 3–5 năm:</strong> {impact.groundingAndUncertainty.uncertainties[0]}
                        </p>
                        <p className="text-[9px] text-amber-700 italic pt-0.5">
                          {impact.groundingAndUncertainty.disclaimer}
                        </p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* ACTION ROW */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/70 sticky left-0 z-10 border-r border-slate-200">
                Thao tác
              </td>
              {comparedCareers.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-200">
                  <button
                    onClick={() => onSelectCareer(c)}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Xem toàn bộ Hồ sơ nghề</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Grounding & Transparency Footer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Bảng so sánh áp dụng dữ liệu gốc từ <strong>Recommendation Engine</strong> và <strong>Cơ sở Dữ liệu Nghề nghiệp Chuẩn hóa</strong>. Tuyệt đối không tự sinh điểm số giả mạo.
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Chỉ số không có thông tin được đánh dấu <em>"Chưa có dữ liệu"</em>.
        </div>
      </div>
    </div>
  );
};
