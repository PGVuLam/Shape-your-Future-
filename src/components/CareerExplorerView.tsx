import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Career, UserProfile, RecommendationScore, getHollandCode } from '../types';
import { CAREER_DATABASE } from '../data/careers';
import { CAREER_CLUSTERS } from '../data/clusters';
import { useLanguage } from '../context/LanguageContext';

interface CareerExplorerViewProps {
  profile: UserProfile;
  recommendations: RecommendationScore[];
  onSelectCareer: (career: Career) => void;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  profile,
  recommendations,
  onSelectCareer
}) => {
  const { language, t, getCareerTitle, getCareerCluster, getCareerDesc } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedHolland, setSelectedHolland] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'fit' | 'title'>('fit');

  // Map careerId to recommendation score for instant lookup
  const recMap = useMemo(() => {
    const map = new Map<string, RecommendationScore>();
    recommendations.forEach(r => map.set(r.careerId, r));
    return map;
  }, [recommendations]);

  // Filter and sort careers
  const filteredCareers = useMemo(() => {
    return CAREER_DATABASE.filter(c => {
      const locTitle = getCareerTitle(c.id, c.title);
      const locDesc = getCareerDesc(c.id, c.description);
      const locCluster = getCareerCluster(c.id, c.careerCluster);

      // Search
      const matchesSearch =
        searchQuery === '' ||
        locTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        locDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        locCluster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.careerCluster.toLowerCase().includes(searchQuery.toLowerCase());

      // Cluster filter
      const matchesCluster =
        selectedCluster === 'all' ||
        c.careerCluster.toLowerCase().includes(selectedCluster.toLowerCase());

      // Holland filter
      const hollandCode = c.hollandCode || getHollandCode(c.riaSecProfile);
      const matchesHolland =
        selectedHolland === 'all' || hollandCode.includes(selectedHolland);

      return matchesSearch && matchesCluster && matchesHolland;
    }).sort((a, b) => {
      if (sortBy === 'fit') {
        const fitA = recMap.get(a.id)?.overallScore || 0;
        const fitB = recMap.get(b.id)?.overallScore || 0;
        return fitB - fitA;
      }
      return getCareerTitle(a.id, a.title).localeCompare(getCareerTitle(b.id, b.title));
    });
  }, [searchQuery, selectedCluster, selectedHolland, sortBy, recMap, language]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>{t.explorerTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.explorerDesc}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">
              {'Sắp xếp:'}
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'fit' | 'title')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-2xs focus:outline-none"
            >
              <option value="fit">{t.sortByFit}</option>
              <option value="title">{t.sortByName}</option>
            </select>
          </div>
        </div>

        {/* Search and Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search bar */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Cluster Dropdown */}
          <div>
            <select
              value={selectedCluster}
              onChange={e => setSelectedCluster(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-none"
            >
              <option value="all">{t.allClusters}</option>
              {CAREER_CLUSTERS.map(cluster => (
                <option key={cluster.id} value={cluster.name}>
                  {cluster.name}
                </option>
              ))}
            </select>
          </div>

          {/* Holland RIASEC Dropdown */}
          <div>
            <select
              value={selectedHolland}
              onChange={e => setSelectedHolland(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-none"
            >
              <option value="all">{t.allHolland}</option>
              <option value="R">R - {t.riasecR}</option>
              <option value="I">I - {t.riasecI}</option>
              <option value="A">A - {t.riasecA}</option>
              <option value="S">S - {t.riasecS}</option>
              <option value="E">E - {t.riasecE}</option>
              <option value="C">C - {t.riasecC}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCareers.map(career => {
          const rec = recMap.get(career.id);
          const score = rec?.overallScore || 0;
          const locTitle = getCareerTitle(career.id, career.title);
          const locCluster = getCareerCluster(career.id, career.careerCluster);
          const locDesc = getCareerDesc(career.id, career.description);

          return (
            <div
              key={career.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {locCluster}
                  </span>
                  {rec && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {score}% {'Hợp'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {locTitle}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{locDesc}</p>
                </div>

                {/* Key Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {career.requiredSkills.slice(0, 3).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {t.hollandCode} {career.hollandCode || getHollandCode(career.riaSecProfile)}
                </span>
                <button
                  onClick={() => onSelectCareer(career)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-all"
                >
                  <span>{t.detailsButton}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCareers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-2">
          <p>{t.noCareersFound}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCluster('all');
              setSelectedHolland('all');
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {t.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
