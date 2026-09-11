import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = `Geocode the following address: "Chandori village road, Niphad, Nashik, Maharashtra".
Return ONLY a JSON object with:
{
  "lat": <number>,
  "lng": <number>,
  "isValid": <boolean, true if the address seems like a real place that can be mapped, false if it's completely fake/nonsense>,
  "displayName": "<formatted full address>"
}`;
ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt
}).then(res => {
  console.log(res.text);
}).catch(console.error);
