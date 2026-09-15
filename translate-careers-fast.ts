import { CAREER_DATABASE } from './src/data/careers';
import translate from 'translate-google';
import fs from 'fs';

// Helper to batch process
const pMap = async (arr: any[], fn: any) => {
  const results = [];
  for (const item of arr) {
    results.push(await fn(item));
  }
  return results;
};

async function translateString(text: string): Promise<string> {
  if (!text) return text;
  try {
    return await translate(text, { to: 'vi' });
  } catch (e) {
    return text;
  }
}

async function translateArray(arr: string[]): Promise<string[]> {
  return Promise.all(arr.map(item => translateString(item)));
}

async function run() {
  console.log('Starting translation with translate-google...');
  
  const translatedCareers = await Promise.all(CAREER_DATABASE.map(async (c, i) => {
    console.log(`Translating career ${i + 1}/${CAREER_DATABASE.length}: ${c.title}...`);
    const t = JSON.parse(JSON.stringify(c));

    const [
      description, tasks, responsibilities, workEnvironment, requiredSkills, recommendedSkills, softSkills, relevantSubjects, relevantInterests,
      relatedMajors, vocationalPaths, certifications, portfolioExamples, beginnerProjects, challenges, advantages, futureTrends,
      rangeDescription, disclaimer, levelIndicator
    ] = await Promise.all([
      translateString(c.description),
      translateArray(c.tasks),
      translateArray(c.responsibilities),
      translateArray(c.workEnvironment),
      translateArray(c.requiredSkills),
      translateArray(c.recommendedSkills),
      translateArray(c.softSkills),
      translateArray(c.relevantSubjects),
      translateArray(c.relevantInterests),
      translateArray(c.relatedMajors),
      translateArray(c.vocationalPaths),
      translateArray(c.certifications),
      translateArray(c.portfolioExamples),
      translateArray(c.beginnerProjects),
      translateArray(c.challenges),
      translateArray(c.advantages),
      translateString(c.futureTrends),
      translateString(c.salaryInfo.rangeDescription),
      translateString(c.salaryInfo.disclaimer),
      translateString(c.salaryInfo.levelIndicator)
    ]);

    t.description = description;
    t.tasks = tasks;
    t.responsibilities = responsibilities;
    t.workEnvironment = workEnvironment;
    t.requiredSkills = requiredSkills;
    t.recommendedSkills = recommendedSkills;
    t.softSkills = softSkills;
    t.relevantSubjects = relevantSubjects;
    t.relevantInterests = relevantInterests;
    t.relatedMajors = relatedMajors;
    t.vocationalPaths = vocationalPaths;
    t.certifications = certifications;
    t.portfolioExamples = portfolioExamples;
    t.beginnerProjects = beginnerProjects;
    t.challenges = challenges;
    t.advantages = advantages;
    t.futureTrends = futureTrends;
    
    t.salaryInfo = {
      rangeDescription,
      disclaimer,
      levelIndicator,
    };

    t.progressionPath = {
      entry: await translateString(c.progressionPath.entry),
      mid: await translateString(c.progressionPath.mid),
      senior: await translateString(c.progressionPath.senior),
    };

    t.educationPaths = await Promise.all(c.educationPaths.map(async (p: any) => ({
      type: await translateString(p.type),
      duration: await translateString(p.duration),
      description: await translateString(p.description),
      tradeoffs: await translateString(p.tradeoffs),
    })));

    t.experiments = await Promise.all(c.experiments.map(async (exp: any) => ({
      title: await translateString(exp.title),
      duration: await translateString(exp.duration),
      difficulty: await translateString(exp.difficulty),
      description: await translateString(exp.description),
      steps: await translateArray(exp.steps),
      expectedOutcome: await translateString(exp.expectedOutcome),
    })));

    t.alternativeCareers = await Promise.all(c.alternativeCareers.map(async (alt: any) => ({
      careerId: alt.careerId,
      title: alt.title,
      similarityReason: await translateString(alt.similarityReason),
      distinction: await translateString(alt.distinction),
    })));

    console.log(`Done translating career ${i + 1}`);
    return t;
  }));

  const output = `import { Career } from '../types';\n\nexport const CAREER_DATABASE: Career[] = ${JSON.stringify(translatedCareers, null, 2)};\n`;
  fs.writeFileSync('./src/data/careers.ts', output, 'utf8');
  console.log('Translation complete!');
}

run();
