import { UserProfile, RecommendationScore } from '../types';

export interface ParentTeacherSummary {
  studentName: string;
  age: number;
  developmentStage: string;
  identifiedStrengths: string[];
  prominentInterests: string[];
  recommendedExplorationDomains: string[];
  suggestedHomeAndSchoolActivities: string[];
  conversationStartersForParents: string[];
  guidingPhilosophy: string;
}

export function generateParentTeacherSummary(
  profile: UserProfile,
  topRecommendations: RecommendationScore[]
): ParentTeacherSummary {
  const topCareers = topRecommendations.slice(0, 3).map(r => r.career.title);

  const strengths = [
    ...(profile.selfRatedSkills?.filter(s => s.level === 'Strong' || s.level === 'Expert').map(s => s.skill) || []),
    `Strong affinity for ${profile.favoriteSubjects.slice(0, 2).join(' and ') || 'academic curiosity'}`
  ];

  const developmentStage =
    profile.age <= 10
      ? 'Early Discovery & Experiential Play (Ages 7–10)'
      : profile.age <= 14
      ? 'Middle School Curiosity & Hobby Exploration (Ages 11–14)'
      : profile.age <= 18
      ? 'High School Competency Building & Pathway Choice (Ages 15–18)'
      : 'Young Adult / Professional Growth';

  const suggestedActivities =
    profile.age <= 10
      ? [
          'Encourage unstructured tinkering with LEGO, blocks, cardboard, or safe kitchen science experiments',
          'Read illustrated books about great inventors, explorers, and artists together',
          'Praise their persistence and curiosity when trying difficult puzzles rather than just correct answers'
        ]
      : profile.age <= 14
      ? [
          'Support enrollment in school clubs (robotics, art, chess, debate, or coding)',
          'Visit science centers, art galleries, and maker fairs as weekend family outings',
          'Encourage short 2-hour mini-projects they can complete and feel proud of'
        ]
      : [
          'Facilitate informational interviews with trusted family friends working in their fields of interest',
          'Explore university campus open days and vocational exhibitions together without pressure',
          'Support their participation in regional youth science, technology, or business competitions'
        ];

  const conversationStarters = [
    `"I noticed you really enjoy working on ${profile.interests[0] || 'projects'}. What is your favorite part of that activity?"`,
    `"What kind of problems or puzzles make you feel most excited when you figure them out?"`,
    `"If you could build or design any machine or project without any limits, what would it be?"`
  ];

  return {
    studentName: profile.name || 'Student',
    age: profile.age,
    developmentStage,
    identifiedStrengths: strengths.slice(0, 4),
    prominentInterests: profile.interests.slice(0, 5),
    recommendedExplorationDomains: topCareers,
    suggestedHomeAndSchoolActivities: suggestedActivities,
    conversationStartersForParents: conversationStarters,
    guidingPhilosophy:
      'The purpose of this evaluation is not to lock the student into a rigid career box, but to celebrate their current curiosity and provide supportive, low-pressure pathways to explore their potential.'
  };
}
