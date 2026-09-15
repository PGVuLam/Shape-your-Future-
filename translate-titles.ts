import { CAREER_DATABASE } from './src/data/careers';
import translate from 'translate-google';
import fs from 'fs';

async function translateString(text: string): Promise<string> {
  if (!text) return text;
  // Let's only translate if it doesn't already contain common Vietnamese words, but auto-detect is fine.
  try {
    return await translate(text, { to: 'vi' });
  } catch (e) {
    console.error("Error translating:", text.substring(0, 30));
    return text;
  }
}

async function run() {
  console.log('Translating titles, clusters, industries...');
  
  for (let i = 0; i < CAREER_DATABASE.length; i++) {
    const c = CAREER_DATABASE[i];
    console.log(`Processing ${c.title}...`);
    c.title = await translateString(c.title);
    c.careerCluster = await translateString(c.careerCluster);
    c.industry = await translateString(c.industry);
    await new Promise(r => setTimeout(r, 200));
  }

  const output = `import { Career } from '../types';\n\nexport const CAREER_DATABASE: Career[] = ${JSON.stringify(CAREER_DATABASE, null, 2)};\n`;
  fs.writeFileSync('./src/data/careers.ts', output, 'utf8');
  console.log('Title Translation complete!');
}

run();
