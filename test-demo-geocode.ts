import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

async function geocodeWithGemini(address: string, city: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in .env");
    return null;
  }
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Geocode the following address accurately: "${address}, ${city}, Maharashtra, India".
Return ONLY a JSON object with:
{
  "lat": <number>,
  "lng": <number>,
  "isValid": <boolean>
}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });
    const text = response.text || "{}";
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
    const parsed = JSON.parse(jsonMatch[1].trim());
    return parsed;
  } catch (e) {
    console.error("Geocoding failed:", e);
    return null;
  }
}

const demoFacilities = [
  { address: "Chandori village road", city: "Niphad" },
  { address: "Ozar highway", city: "Nashik" },
  { address: "Ahmednagar Road", city: "Kopargaon" },
  { address: "APMC yard", city: "Lasalgaon" },
  { address: "Pimpalgaon Baswant bypass", city: "Pimpalgaon" },
  { address: "Ghoti Road, Igatpuri ghat", city: "Igatpuri" }
];
async function run() {
  for (const f of demoFacilities) {
    const res = await geocodeWithGemini(f.address, f.city);
    console.log(f.address, "->", res);
  }
}
run();
