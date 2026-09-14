import { UserProfile, WhatIfAdjustments, WhatIfComparisonResult } from '../types';
import { generateRecommendations } from './recommendationEngine';
import { CAREER_DATABASE } from '../data/careers';

export function runWhatIfSimulation(
  baseProfile: UserProfile,
  adjustments: WhatIfAdjustments
): WhatIfComparisonResult {
  // 1. Run baseline recommendation
  const beforeRecs = generateRecommendations(baseProfile, CAREER_DATABASE);
  const beforeTop = beforeRecs.slice(0, 5).map(r => ({
    careerId: r.careerId,
    title: r.career.title,
    score: r.overallScore
  }));

  // 2. Clone and modify profile based on adjustments
  const modifiedProfile: UserProfile = JSON.parse(JSON.stringify(baseProfile));

  // Modify subjects
  if (adjustments.addedSubjects && adjustments.addedSubjects.length > 0) {
    adjustments.addedSubjects.forEach(sub => {
      if (!modifiedProfile.favoriteSubjects.includes(sub)) {
        modifiedProfile.favoriteSubjects.push(sub);
      }
    });
  }
  if (adjustments.removedSubjects && adjustments.removedSubjects.length > 0) {
    modifiedProfile.favoriteSubjects = modifiedProfile.favoriteSubjects.filter(
      sub => !adjustments.removedSubjects.includes(sub)
    );
  }

  // Modify skills
  if (adjustments.addedSkills && adjustments.addedSkills.length > 0) {
    adjustments.addedSkills.forEach(sk => {
      if (!modifiedProfile.skills.includes(sk)) {
        modifiedProfile.skills.push(sk);
      }
      const existing = modifiedProfile.selfRatedSkills?.find(s => s.skill.toLowerCase() === sk.toLowerCase());
      if (existing) {
        existing.level = 'Strong';
      } else {
        modifiedProfile.selfRatedSkills?.push({
          skill: sk,
          level: 'Strong',
          category: 'Technical'
        });
      }
    });
  }

  // Remote preference
  if (adjustments.preferredRemote && adjustments.preferredRemote !== 'Any') {
    modifiedProfile.workPreferences.remotePreference = adjustments.preferredRemote;
  }

  // Teamwork boost
  if (adjustments.higherTeamwork) {
    modifiedProfile.workPreferences.teamworkVsSolo = 'Team';
    modifiedProfile.riaSecScores.S = Math.min(1.0, modifiedProfile.riaSecScores.S + 0.25);
  }

  // No University preference
  if (adjustments.noUniversity) {
    modifiedProfile.educationPreferences = ['College/Vocational', 'Self-Taught / Portfolio', 'Apprenticeship'];
  }

  // Priority High Income
  if (adjustments.priorityHighIncome) {
    if (!modifiedProfile.careerPriorities.includes('High income')) {
      modifiedProfile.careerPriorities.push('High income');
    }
  }

  // 3. Run modified recommendation
  const afterRecs = generateRecommendations(modifiedProfile, CAREER_DATABASE);
  const afterTop = afterRecs.slice(0, 5).map(r => {
    const beforeMatch = beforeTop.find(b => b.careerId === r.careerId);
    const prevScore = beforeMatch ? beforeMatch.score : 0;
    return {
      careerId: r.careerId,
      title: r.career.title,
      score: r.overallScore,
      delta: r.overallScore - (prevScore || r.overallScore)
    };
  });

  // 4. Generate structured explanations
  const explanation: string[] = [];

  if (adjustments.addedSkills?.includes('Programming (Python, JS/TS, or Java)')) {
    explanation.push(
      'Improving programming skills significantly boosts software, AI, and robotics career scores (+4% to +10%).'
    );
  }

  if (adjustments.addedSubjects?.includes('Physics') && adjustments.removedSubjects?.includes('Biology')) {
    explanation.push(
      'Switching from Biology to Physics elevates Semiconductor, Robotics, and Architecture, while lowering Clinical Medicine.'
    );
  }

  if (adjustments.preferredRemote === 'Remote') {
    explanation.push(
      'A strict remote-work preference favors Software Engineering and UI/UX Design over laboratory or hospital-based occupations.'
    );
  }

  if (adjustments.higherTeamwork) {
    explanation.push(
      'Increasing preference for people and teamwork elevated Social-oriented careers like Product Management and Clinical Psychology.'
    );
  }

  if (adjustments.noUniversity) {
    explanation.push(
      'Filtering for non-university options elevated Precision Automation, Skilled Trades, and Web Development with portfolio pathways.'
    );
  }

  if (adjustments.priorityHighIncome) {
    explanation.push(
      'Prioritizing high income increased weighting for Quantitative Finance, Semiconductor Engineering, and Corporate Law.'
    );
  }

  if (explanation.length === 0) {
    explanation.push('Adjustments caused subtle shifts in scoring weighting across candidate careers.');
  }

  return {
    beforeRankings: beforeTop,
    afterRankings: afterTop,
    explanation
  };
}
