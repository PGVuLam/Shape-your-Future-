import { Career, UserProfile, LearningRoadmap, RoadmapPhase, SkillGapAnalysis } from '../types';

export function generateLearningRoadmap(
  profile: UserProfile,
  career: Career,
  skillGap?: SkillGapAnalysis
): LearningRoadmap {
  const ageGroup = profile.ageGroup;
  const hoursPerWeek = profile.availableStudyTimeHoursPerWeek || 10;
  const durationMultiplier = hoursPerWeek < 8 ? 1.5 : hoursPerWeek > 15 ? 0.75 : 1.0;

  let phases: RoadmapPhase[] = [];
  let tailoredNote = '';

  if (ageGroup === '7-10') {
    tailoredNote = `Childhood Exploration Journey (Ages 7–10): Focusing on play, curiosity, hands-on building, and discoverable fun rather than formal academic pressures.`;
    phases = [
      {
        phaseNumber: 0,
        name: 'Phase 0: Play & Curiosity',
        duration: '1–2 Months',
        objectives: [
          `Discover the joyful wonders of ${career.careerCluster}`,
          'Try fun hands-on building activities without stress of right or wrong answers',
          'Explore stories, books, and cartoons about inventors and creators'
        ],
        skillsToLearn: ['Creative Imagination', 'Curiosity', 'Safe Tool Handling'],
        projects: ['Build a dream machine out of cardboard and recycled boxes', 'Draw an illustrated comic book about a day in this career'],
        recommendedActivities: [
          'Visit a local science center, maker museum, or botanical garden',
          'Watch educational YouTube channels (SciShow Kids, Mark Rober, Nat Geo Kids)'
        ],
        milestone: 'Complete a fun showcase at home to explain your creation to parents!'
      },
      {
        phaseNumber: 1,
        name: 'Phase 1: Junior Maker & Discoverer',
        duration: '2–3 Months',
        objectives: [
          'Learn basic visual building blocks (LEGO robotics, Scratch coding, or clay modeling)',
          'Follow simple guided experiment kits with parents'
        ],
        skillsToLearn: ['Pattern Recognition', 'Basic Trial & Error', 'Sharing Ideas with Friends'],
        projects: ['Create a mini interactive Scratch animation or game', 'Conduct 3 simple home science experiments'],
        recommendedActivities: [
          'Join a school art, robotics, or nature club',
          'Play puzzle games (Minecraft creative mode, Lightbot)'
        ],
        milestone: 'Show a friend how to play the game or look at the project you created!'
      },
      {
        phaseNumber: 2,
        name: 'Phase 2: Fun Challenge Quests',
        duration: 'Ongoing',
        objectives: [
          'Team up with siblings or classmates for playful creative challenges',
          'Celebrate learning from failed attempts without giving up'
        ],
        skillsToLearn: ['Teamwork', 'Patience', 'Observation'],
        projects: ['Build a cardboard marble run with 3 ramps and a loop', 'Grow a mini indoor garden and record daily leaf heights'],
        recommendedActivities: ['Read age-appropriate biographies of scientists, artists, and builders'],
        milestone: 'Earn a junior explorer badge for curiosity and kindness!'
      }
    ];
  } else if (ageGroup === '11-14') {
    tailoredNote = `Middle School Exploration (Ages 11–14): Building foundational strengths, exploring hobby clubs, and trying micro-projects to uncover personal passions.`;
    phases = [
      {
        phaseNumber: 0,
        name: 'Phase 0: Exploration & First Taste',
        duration: '3–4 Weeks',
        objectives: [
          `Test whether you actually enjoy the daily reality of ${career.title}`,
          'Complete the recommended Career Experiment micro-project',
          'Interview or watch day-in-the-life vlogs of professionals in this field'
        ],
        skillsToLearn: ['Foundational Concepts', 'Beginner Vocabulary'],
        projects: career.experiments.map(e => e.title),
        recommendedActivities: [
          'Explore online introductory workshops (Code.org, Khan Academy)',
          'Read popular science or industry articles'
        ],
        milestone: 'Decide if you want to invest 3 months of hobby time into building skills here.'
      },
      {
        phaseNumber: 1,
        name: 'Phase 1: Core Fundamentals & Tools',
        duration: `${Math.round(2 * durationMultiplier)} Months`,
        objectives: [
          `Master fundamental tools: ${career.requiredSkills.slice(0, 2).join(', ')}`,
          'Strengthen relevant school subjects (Math, Sciences, or Arts)'
        ],
        skillsToLearn: career.requiredSkills.slice(0, 2),
        projects: career.beginnerProjects.slice(0, 2),
        recommendedActivities: [
          'Participate in school STEM, Debate, or Arts club',
          'Complete 2 interactive online courses'
        ],
        milestone: 'A working beginner project you can demonstrate to teachers and classmates.'
      },
      {
        phaseNumber: 2,
        name: 'Phase 2: Competitions & Team Collaborations',
        duration: `${Math.round(3 * durationMultiplier)} Months`,
        objectives: [
          'Collaborate with peers on a team project or school science fair',
          'Learn to take constructive feedback and iterate'
        ],
        skillsToLearn: ['Team Communication', 'Presentation', 'Basic Versioning / Documentation'],
        projects: ['A community science fair entry or game jam submission'],
        recommendedActivities: [
          'Enter a regional youth competition (FIRST LEGO League, youth hackathons, art exhibitions)'
        ],
        milestone: 'Submit an entry into a youth competition or school exhibition!'
      }
    ];
  } else if (ageGroup === '15-18') {
    // High School Core Research Cohort
    tailoredNote = `High School Decision & Foundation Track (Ages 15–18): Rigorous skill preparation, academic subject alignment, competitive portfolio building, and university/vocational pathway decisions.`;
    phases = [
      {
        phaseNumber: 0,
        name: 'Phase 0: Reality Check & Micro-Experimentation',
        duration: '2–3 Weeks',
        objectives: [
          `Validate your true affinity for ${career.title} beyond romanticized impressions`,
          'Complete hands-on micro-experiments and evaluate frustration tolerance'
        ],
        skillsToLearn: ['Basic Industry Workflows', 'Fundamental Terminology'],
        projects: [career.experiments[0]?.title || 'Introductory Hands-on Mini Project'],
        recommendedActivities: [
          'Watch 3 unfiltered day-in-the-life industry videos',
          'Audit free introductory university lectures (MIT OpenCourseWare / Coursera)'
        ],
        milestone: 'Personal validation essay: Why this field aligns with my RIASEC and career values.'
      },
      {
        phaseNumber: 1,
        name: 'Phase 1: Academic & Foundational Mastery',
        duration: `${Math.round(3 * durationMultiplier)} Months`,
        objectives: [
          `Strengthen foundational academic subjects: ${career.relevantSubjects.slice(0, 2).join(', ')}`,
          `Acquire primary technical competency: ${career.requiredSkills.slice(0, 2).join(', ')}`
        ],
        skillsToLearn: career.requiredSkills.slice(0, 3),
        projects: career.beginnerProjects.slice(0, 2),
        recommendedActivities: [
          'Form or lead a specialized school study group',
          'Dedicate 4 hours every weekend to structured project building'
        ],
        milestone: 'Complete two standalone guided projects with documented GitHub/Behance repositories.'
      },
      {
        phaseNumber: 2,
        name: 'Phase 2: Substantive Portfolio & Competitions',
        duration: `${Math.round(4 * durationMultiplier)} Months`,
        objectives: [
          'Build an original, non-trivial capstone project addressing a real problem',
          'Prepare for regional or national science/technology/business competitions'
        ],
        skillsToLearn: career.recommendedSkills.slice(0, 2),
        projects: [career.portfolioExamples[0] || 'Original community capstone project'],
        recommendedActivities: [
          'Compete in Intel ISEF / National Science Fair / Hackathons',
          'Reach out to university faculty or alumni for informational interviews'
        ],
        milestone: 'Publicly hosted portfolio with live demo or verified competition certificate.'
      },
      {
        phaseNumber: 3,
        name: 'Phase 3: Pathway & Admissions Preparation',
        duration: `${Math.round(3 * durationMultiplier)} Months`,
        objectives: [
          `Select target educational paths: ${career.educationPaths.map(p => p.type).join(' or ')}`,
          `Align university major selections (${career.relatedMajors.slice(0, 2).join(', ')}) with scholarship criteria`,
          'Draft compelling personal statements highlighting unique project journey'
        ],
        skillsToLearn: ['Professional Interviewing', 'Academic Portfolio Presentation'],
        projects: ['Consolidated personal digital portfolio showcasing complete progression'],
        recommendedActivities: [
          'Attend university open days and admissions webinars',
          'Prepare scholarship applications and portfolio dossiers'
        ],
        milestone: 'Finalized college/vocational application dossier and clear backup roadmap.'
      }
    ];
  } else if (ageGroup === '19-24') {
    // College / Early Career
    tailoredNote = `University & Early Career Job-Readiness Track (Ages 19–24): Bridging academic knowledge to professional industry benchmarks, targeting internships, and assembling production portfolios.`;
    phases = [
      {
        phaseNumber: 0,
        name: 'Phase 0: Professional Gap Diagnostic',
        duration: '2 Weeks',
        objectives: [
          'Audit current resume and GitHub/Figma against current market job descriptions',
          `Identify critical missing skills: ${skillGap?.missingSkills.slice(0, 2).map(s => s.skill).join(', ') || 'Industry frameworks'}`
        ],
        skillsToLearn: ['Industry Git Workflows', 'Clean Architecture Standards'],
        projects: ['Refactor an existing college project into production code standards'],
        recommendedActivities: ['Review 10 entry-level job specs on LinkedIn for required tech stacks'],
        milestone: 'Actionable 6-month skill sprint checklist.'
      },
      {
        phaseNumber: 1,
        name: 'Phase 1: Production-Grade Project Sprint',
        duration: `${Math.round(3 * durationMultiplier)} Months`,
        objectives: [
          `Master high-priority missing skills: ${career.technicalSkills.slice(0, 3).join(', ')}`,
          'Build an end-to-end full lifecycle project with testing and deployment'
        ],
        skillsToLearn: career.technicalSkills.slice(0, 3),
        projects: career.portfolioExamples.slice(0, 2),
        recommendedActivities: [
          'Contribute an accepted pull request to a reputable open-source repository',
          'Write technical documentation and architectural rationale for each project'
        ],
        milestone: 'Live deployed application or published design case study with verifiable metrics.'
      },
      {
        phaseNumber: 2,
        name: 'Phase 2: Internship & Interview Readiness',
        duration: `${Math.round(2 * durationMultiplier)} Months`,
        objectives: [
          'Master technical interview coding questions (LeetCode / System Design / Case Studies)',
          'Conduct behavioral mock interviews with alumni or peers',
          'Target 20 curated internship / junior role applications'
        ],
        skillsToLearn: ['Technical Interviewing', 'System Design Basics', 'STAR Storytelling'],
        projects: ['Curated 1-page resume + polished LinkedIn profile + live portfolio site'],
        recommendedActivities: [
          'Participate in company hackathons and university recruitment career fairs',
          'Conduct 5 cold-outreach informational coffee chats with practitioners'
        ],
        milestone: 'Secured professional internship or first junior career offer!'
      }
    ];
  } else {
    // Age 25+ Adult Career Changer / Reskilling
    tailoredNote = `Adult Career Transition & Reskilling Track (Age 25+): Leveraging existing professional transferable skills, focused time-efficient study, and targeted portfolio evidence to pivot careers.`;
    phases = [
      {
        phaseNumber: 0,
        name: 'Phase 0: Transferable Skills & Feasibility Audit',
        duration: '2–3 Weeks',
        objectives: [
          `Map previous experience (${profile.currentOccupation || 'Current domain'}) to ${career.title}`,
          'Identify transferable soft skills: communication, stakeholder management, project delivery',
          `Schedule realistic study hours (${hoursPerWeek} hrs/week) without risking burnout`
        ],
        skillsToLearn: ['Domain Terminology', 'Modern Digital Tooling'],
        projects: ['A 1-page Career Transition Strategy Brief'],
        recommendedActivities: ['Informational interviews with 2 career changers who made this exact pivot'],
        milestone: 'Clear timeline commitment and baseline tool installation.'
      },
      {
        phaseNumber: 1,
        name: 'Phase 1: Targeted High-Leverage Reskilling',
        duration: `${Math.round(4 * durationMultiplier)} Months`,
        objectives: [
          `Focus exclusively on the highest priority missing skills: ${skillGap?.missingSkills.slice(0, 3).map(s => s.skill).join(', ') || career.requiredSkills.slice(0, 2).join(', ')}`,
          'Skip low-utility academic theory in favor of practical applied frameworks'
        ],
        skillsToLearn: career.requiredSkills.slice(0, 3),
        projects: [career.beginnerProjects[0] || 'Applied real-world workflow automation'],
        recommendedActivities: [
          'Enroll in an intensive, project-driven certificate course or cohort bootcamp',
          'Dedicate structured mornings/evenings to hands-on coding/designing'
        ],
        milestone: 'Complete first capstone project bridging your previous domain knowledge with new tech!'
      },
      {
        phaseNumber: 2,
        name: 'Phase 2: Hybrid Portfolio & Strategic Networking',
        duration: `${Math.round(3 * durationMultiplier)} Months`,
        objectives: [
          'Create 2 hybrid portfolio case studies that prove your cross-domain superiority over entry-level grads',
          'Pivot resume narrative from past identity to future value proposition',
          'Target specialized roles that value your prior industry background'
        ],
        skillsToLearn: ['Personal Branding', 'Strategic Career Transition Pitching'],
        projects: [career.portfolioExamples[0] || 'Comprehensive business/tech bridge case study'],
        recommendedActivities: [
          'Attend local industry meetups and participate in specialized Discord/Slack communities',
          'Offer freelance or volunteer pro-bono work for non-profits to gain real domain references'
        ],
        milestone: 'First contractor, freelance, or full-time transitional job offer secured!'
      }
    ];
  }

  return {
    careerId: career.id,
    careerTitle: career.title,
    targetAgeGroup: ageGroup,
    phases,
    tailoredNote
  };
}
