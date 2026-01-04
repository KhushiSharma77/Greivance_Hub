<<<<<<< HEAD
import type {
  CreateGrievanceInput,
  GrievanceDTO,
} from "@/types/grievance";
import prisma from "@team-call-of-code/db";

export async function createGrievance(
  input: CreateGrievanceInput
): Promise<GrievanceDTO> {
  const { departmentName, grievance } = input;
=======
import { geminiModel } from "./gemini.service";
import { ROUTING_PROMPT } from "../prompts/routing.prompts";
import { extractJsonFromText } from "../utils/extractJson";

>>>>>>> origin

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

<<<<<<< HEAD
  // 3️⃣ Map Prisma model → Domain DTO
  return {
    id: created.id,
    userId: created.userId,
    originalText: created.originalText,
    translatedText: created.translatedText,
    category: created.category,
    priority: created.priority as any,
    status: created.status as any,
    departmentId: created.departmentId,
    assignedOfficerId: created.assignedOfficerId,
    duplicateOfId: created.duplicateOfId,
    latitude: created.latitude,
    longitude: created.longitude,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  };
=======
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
>>>>>>> origin
}
