import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/shared/auth/middleware";

const verificationSchema = z.object({
  documents: z.array(
    z.object({
      base64Data: z.string().min(1),
      mimeType: z.string(),
      fileName: z.string(),
    })
  ).length(3),
});

export const verifyOwnerDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => verificationSchema.parse(data))
  .handler(async ({ data }) => {
    // Hardcoded logic to replace Gemini API
    return {
      success: true,
      isValidDocument: true,
      extractedName: "Demo Operator",
      extractedIdNumber: "WDRA-1234-5678",
      documentType: "Title Deed, Capacity Doc, WDRA",
      reasoning: "API removed. Returning mocked authentic verification data."
    };
  });
