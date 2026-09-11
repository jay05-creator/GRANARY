import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { authMiddleware } from "@/shared/auth/middleware";

const verificationSchema = z.object({
  base64Image: z.string().min(1),
  mimeType: z.string()
});

export const verifyOwnerDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => verificationSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Fallback if no API key
      return {
        success: true,
        isValidDocument: true,
        extractedName: "Demo User",
        extractedIdNumber: "DOC-1234-5678",
        documentType: "Demo Document",
        reasoning: "No Gemini API Key found. Returning mock verification data."
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a document verification AI for a warehouse management system.
Analyze the provided document image (e.g. Aadhaar, PAN, Land Record, or ID card).
Extract the following information and return ONLY a JSON object with this exact structure:
{
  "isValidDocument": <boolean (true if it looks like a valid official document)>,
  "extractedName": "<string (the person's name found on document, or null)>",
  "extractedIdNumber": "<string (the ID number found, or null)>",
  "documentType": "<string (e.g. 'Aadhaar', 'PAN', 'Land Record', or 'Unknown')>",
  "reasoning": "<string (1 sentence explaining what was found)>"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: data.base64Image,
                  mimeType: data.mimeType
                }
              }
            ]
          }
        ]
      });

      const text = response.text || "{}";
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
      const parsed = JSON.parse(jsonMatch[1].trim());

      return {
        success: true,
        isValidDocument: Boolean(parsed.isValidDocument),
        extractedName: parsed.extractedName || null,
        extractedIdNumber: parsed.extractedIdNumber || null,
        documentType: parsed.documentType || "Unknown",
        reasoning: parsed.reasoning || "Analysis complete"
      };
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      return {
        success: false,
        error: e.message || "Failed to verify document with AI."
      };
    }
  });
