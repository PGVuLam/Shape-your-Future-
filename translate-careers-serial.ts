import { CAREER_DATABASE } from './src/data/careers';
import translate from 'translate-google';
import fs from 'fs';

async function translateString(text: string): Promise<string> {
  if (!text) return text;
  try {
    return await translate(text, { to: 'vi' });
  } catch (e) {
    return text;
  }
}

async function translateArray(arr: string[]): Promise<string[]> {
  const result = [];
  for (const item of arr) {
    result.push(await translateString(item));
  }
  return result;
}

async function run() {
  console.log('Starting translation with translate-google (SERIAL)...');
  
  const translatedCareers = [];

  for (let i = 0; i < CAREER_DATABASE.length; i++) {
    const c = CAREER_DATABASE[i];
    console.log(`Translating career ${i + 1}/${CAREER_DATABASE.length}: ${c.title}...`);
    const t = JSON.parse(JSON.stringify(c));

    t.description = await translateString(c.description);
    t.tasks = await translateArray(c.tasks);
    t.responsibilities = await translateArray(c.responsibilities);
    t.workEnvironment = await translateArray(c.workEnvironment);
    t.requiredSkills = await translateArray(c.requiredSkills);
    t.recommendedSkills = await translateArray(c.recommendedSkills);
    t.softSkills = await translateArray(c.softSkills);
    t.relevantSubjects = await translateArray(c.relevantSubjects);
    t.relevantInterests = await translateArray(c.relevantInterests);
    t.relatedMajors = await translateArray(c.relatedMajors);
    t.vocationalPaths = await translateArray(c.vocationalPaths);
    t.certifications = await translateArray(c.certifications);
    t.portfolioExamples = await translateArray(c.portfolioExamples);
    t.beginnerProjects = await translateArray(c.beginnerProjects);
    t.challenges = await translateArray(c.challenges);
    t.advantages = await translateArray(c.advantages);
    t.futureTrends = await translateString(c.futureTrends);
    
    t.salaryInfo = {
      rangeDescription: await translateString(c.salaryInfo.rangeDescription),
      disclaimer: await translateString(c.salaryInfo.disclaimer),
      levelIndicator: await translateString(c.salaryInfo.levelIndicator),
    };

    t.progressionPath = {
      entry: await translateString(c.progressionPath.entry),
      mid: await translateString(c.progressionPath.mid),
      senior: await translateString(c.progressionPath.senior),
    };

    t.educationPaths = [];
    for (const p of c.educationPaths) {
      t.educationPaths.push({
        type: await translateString(p.type),
        duration: await translateString(p.duration),
        description: await translateString(p.description),
        tradeoffs: await translateString(p.tradeoffs),
      });
    }

    t.experiments = [];
    for (const exp of c.experiments) {
      t.experiments.push({
        title: await translateString(exp.title),
        duration: await translateString(exp.duration),
        difficulty: await translateString(exp.difficulty),
        description: await translateString(exp.description),
        steps: await translateArray(exp.steps),
        expectedOutcome: await translateString(exp.expectedOutcome),
      });
    }

    t.alternativeCareers = [];
    for (const alt of c.alternativeCareers) {
      t.alternativeCareers.push({
        careerId: alt.careerId,
        title: alt.title,
        similarityReason: await translateString(alt.similarityReason),
        distinction: await translateString(alt.distinction),
      });
    }

    console.log(`Done translating career ${i + 1}`);
    translatedCareers.push(t);
  }

  const output = `import { Career } from '../types';\n\nexport const CAREER_DATABASE: Career[] = ${JSON.stringify(translatedCareers, null, 2)};\n`;
  fs.writeFileSync('./src/data/careers.ts', output, 'utf8');
  console.log('Translation complete!');
}

run();
