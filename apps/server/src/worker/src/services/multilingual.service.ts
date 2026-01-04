import { geminiModel } from "./gemini.service";
import { MULTILINGUAL_PROMPT } from "../prompts/multilingual.prompts";

export async function normalizeComplaintText(rawText: string) {
  
  const result = await geminiModel.generateContent(
    MULTILINGUAL_PROMPT(rawText)
  );
  
  
  const responseText = result.response.text();
  try{
  
    return (JSON.parse(responseText));
  } catch(err) {
    
    throw new Error("Invalid JSON from Gemini (multilingual stage)");
  }
}
