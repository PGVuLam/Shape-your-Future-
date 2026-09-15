import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: 'Say hello in vietnamese'
  });
  console.log(response.text());
}
run();
