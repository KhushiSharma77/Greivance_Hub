import { geminiModel } from "./gemini.service";
import { ROUTING_PROMPT } from "../prompts/routing.prompts";
import { extractJsonFromText } from "../utils/extractJson";


type RoutingResult = {
  city: string;
  department: string;
  confidence: number;
};

export async function routeGrievanceText(params: {
  normalizedText: string;
  category: string;
  latitude: number;
  longitude: number;
}): Promise<RoutingResult> {
  const { normalizedText, category, latitude, longitude } = params;

  const result = await geminiModel.generateContent(
    ROUTING_PROMPT(
      normalizedText,
      category,
      latitude,
      longitude
    )
  );

  const responseText = result.response.text();

  try {
    const data = extractJsonFromText(responseText) as RoutingResult;

    // 🔐 Validate confidence
    if (
      typeof data.confidence !== "number" ||
      data.confidence < 0 ||
      data.confidence > 1
    ) {
      throw new Error("Invalid confidence score from Gemini");
    }

    return {
      city: data.city || "Unknown",
      department: data.department,
      confidence: data.confidence,
    };
  } catch (err) {
    console.error("Raw Gemini Response:", responseText);
    throw new Error("Invalid JSON from Gemini (routing stage)");
  }
}
