import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: 'Say hello in vietnamese'
  });
  console.log(response.text());
}
run().catch(e => console.log(e.message));
