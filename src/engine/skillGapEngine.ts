import { Career, UserProfile, SkillGapAnalysis, SkillGapItem } from '../types';

export function analyzeSkillGap(profile: UserProfile, career: Career): SkillGapAnalysis {
  const userSkillMap = new Map<string, { level: 'Strong' | 'Developing' | 'Beginner'; category: string }>();

  // Extract from selfRatedSkills
  profile.selfRatedSkills?.forEach(s => {
    userSkillMap.set(s.skill.toLowerCase(), {
      level: s.level === 'Expert' || s.level === 'Strong' ? 'Strong' : s.level === 'Developing' ? 'Developing' : 'Beginner',
      category: s.category
    });
  });

  // Extract from general skills array
  profile.skills?.forEach(s => {
    if (!userSkillMap.has(s.toLowerCase())) {
      userSkillMap.set(s.toLowerCase(), { level: 'Developing', category: 'Technical' });
    }
  });

  const strongSkills: SkillGapItem[] = [];
  const developingSkills: SkillGapItem[] = [];
  const missingSkills: SkillGapItem[] = [];

  // 1. Process Required Skills (High / Medium Priority)
  career.requiredSkills.forEach((reqSkill, idx) => {
    const reqLower = reqSkill.toLowerCase();
    let foundLevel: 'Strong' | 'Developing' | 'Beginner' | null = null;

    for (const [uSkill, data] of userSkillMap.entries()) {
      if (uSkill.includes(reqLower) || reqLower.includes(uSkill)) {
        foundLevel = data.level;
        break;
      }
    }

    if (foundLevel === 'Strong') {
      strongSkills.push({
        skill: reqSkill,
        userLevel: 'Strong',
        priority: 'Low', // Already mastered
        category: 'Technical',
        recommendedAction: 'Maintain mastery through complex real-world capstone projects.'
      });
    } else if (foundLevel === 'Developing' || foundLevel === 'Beginner') {
      developingSkills.push({
        skill: reqSkill,
        userLevel: 'Developing',
        priority: idx < 2 ? 'High' : 'Medium',
        category: 'Technical',
        recommendedAction: 'Strengthen intermediate problem-solving and build standalone modules.'
      });
    } else {
      missingSkills.push({
        skill: reqSkill,
        userLevel: 'Missing',
        priority: 'High', // Missing a required skill is always High priority
        category: 'Technical',
        recommendedAction: `Start Phase 1 foundation: complete beginner tutorial and guided exercise in ${reqSkill}.`
      });
    }
  });

  // 2. Process Technical Skills
  career.technicalSkills.forEach(techSkill => {
    const techLower = techSkill.toLowerCase();
    // Skip if already in list
    if ([...strongSkills, ...developingSkills, ...missingSkills].some(s => s.skill.toLowerCase() === techLower)) {
      return;
    }

    let foundLevel: 'Strong' | 'Developing' | 'Beginner' | null = null;
    for (const [uSkill, data] of userSkillMap.entries()) {
      if (uSkill.includes(techLower) || techLower.includes(uSkill)) {
        foundLevel = data.level;
        break;
      }
    }

    if (foundLevel === 'Strong') {
      strongSkills.push({
        skill: techSkill,
        userLevel: 'Strong',
        priority: 'Low',
        category: 'Technical',
        recommendedAction: 'Integrate into portfolio projects to demonstrate applied competence.'
      });
    } else if (foundLevel === 'Developing') {
      developingSkills.push({
        skill: techSkill,
        userLevel: 'Developing',
        priority: 'Medium',
        category: 'Technical',
        recommendedAction: 'Practice intermediate exercises and standard workflows.'
      });
    } else {
      missingSkills.push({
        skill: techSkill,
        userLevel: 'Missing',
        priority: 'Medium',
        category: 'Technical',
        recommendedAction: `Follow a 10-hour crash course to gain functional fluency in ${techSkill}.`
      });
    }
  });

  // 3. Process Soft Skills
  career.softSkills.forEach(softSkill => {
    const softLower = softSkill.toLowerCase();
    let foundLevel: 'Strong' | 'Developing' | 'Beginner' | null = null;

    for (const [uSkill, data] of userSkillMap.entries()) {
      if (uSkill.includes(softLower) || softLower.includes(uSkill)) {
        foundLevel = data.level;
        break;
      }
    }

    if (foundLevel === 'Strong') {
      strongSkills.push({
        skill: softSkill,
        userLevel: 'Strong',
        priority: 'Low',
        category: 'Soft',
        recommendedAction: 'Demonstrate leadership in group collaboration and presentations.'
      });
    } else {
      developingSkills.push({
        skill: softSkill,
        userLevel: 'Developing',
        priority: 'Medium',
        category: 'Soft',
        recommendedAction: 'Actively volunteer for team presentation or project coordinator roles.'
      });
    }
  });

  // Overall readiness: percentage of weighted skill points attained
  const totalSkills = strongSkills.length + developingSkills.length + missingSkills.length;
  const points = (strongSkills.length * 1.0) + (developingSkills.length * 0.5);
  const overallReadiness = totalSkills > 0 ? Math.round((points / totalSkills) * 100) : 40;

  return {
    careerId: career.id,
    careerTitle: career.title,
    overallReadiness,
    strongSkills,
    developingSkills,
    missingSkills,
    highPriorityCount: missingSkills.filter(s => s.priority === 'High').length
  };
}
