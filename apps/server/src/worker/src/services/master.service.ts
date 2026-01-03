import { geminiModel } from "./gemini.service";
import { ANALYSIS_PROMPT } from "../prompts/master.prompt";
import { extractJsonFromText } from "../utils/extractJson";

export async function analyzeGrievanceText(normalizedText: string) {
  const result = await geminiModel.generateContent(
    ANALYSIS_PROMPT(normalizedText)
  );

  const responseText = result.response.text();

  try {
    return ((extractJsonFromText(responseText)).data);
  } catch (err) {
    console.error("Raw Gemini Response:", responseText);
    throw new Error("Invalid JSON from Gemini (analysis stage)");
  }
}

