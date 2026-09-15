import { CAREER_DATABASE } from './src/data/careers';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  console.log('Starting translation of CAREER_DATABASE...');
  
  const chunkArray = (arr: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const chunks = chunkArray(CAREER_DATABASE, 5); // Translate 5 careers at a time
  const translatedCareers = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Translating chunk ${i + 1}/${chunks.length}...`);
    
    const prompt = `Translate all English text values in the following JSON array of careers into natural Vietnamese. 
DO NOT translate IDs, hollandCode, riaSecProfile keys, mbtiCompatibility, source, lastUpdated.
Also, keep industry standard technical terms in English (e.g. Docker, Python, REST APIs) but translate the descriptive parts.
Do NOT output markdown. Your output must be purely a JSON array [ { ... } ].
JSON:
${JSON.stringify(chunk, null, 2)}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2
        }
      });
    } catch(e) {
      console.error('Error translating chunk:', e);
      // Wait and retry once
      await new Promise(r => setTimeout(r, 5000));
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2
        }
      });
    }

    let text = response.text().trim();
    if (text.startsWith('```json')) text = text.substring(7);
    if (text.startsWith('```')) text = text.substring(3);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    text = text.trim();
    
    try {
      const parsed = JSON.parse(text);
      translatedCareers.push(...parsed);
    } catch (e) {
      console.error('Failed to parse JSON for chunk', i);
      console.log(text);
      process.exit(1);
    }
  }

  const output = `import { Career } from '../types';\n\nexport const CAREER_DATABASE: Career[] = ${JSON.stringify(translatedCareers, null, 2)};\n`;
  fs.writeFileSync('./src/data/careers.ts', output, 'utf8');
  console.log('Translation complete!');
}

run();
