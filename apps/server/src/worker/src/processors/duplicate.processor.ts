import prisma from "@team-call-of-code/db";
import { detectDuplicateGrievance } from "../services/duplicate.service";
import type { ExistingComplaint } from "@/worker/src/types/duplicatesIssue";

type DuplicateProcessorResult = {
  isDuplicate: boolean;
  matched_grievance_id: string | null;
  similarity_score: number;
};

export async function processDuplicateDetection(
  grievanceId: string
): Promise<DuplicateProcessorResult> {

  // 1️⃣ Fetch current grievance (already stored)
  const currentGrievance = await prisma.grievance.findUnique({
    where: { id: grievanceId },
    select: {
      id: true,
      translatedText: true,
      departmentId: true,
    },
  });

  if (!currentGrievance || !currentGrievance.departmentId) {
    throw new Error("Invalid grievance or department not assigned");
  }

  if (!currentGrievance.translatedText) {
    throw new Error("Translated text missing for duplicate detection");
  }

  // 2️⃣ Fetch existing grievances from SAME department
  const existingGrievances = await prisma.grievance.findMany({
    where: {
      departmentId: currentGrievance.departmentId,
      status: { not: "CLOSED" },
      id: { not: grievanceId }, // exclude current grievance
    },
    select: {
      id: true,
      translatedText: true,
    },
  });

  // 3️⃣ Prepare Gemini input
  const existingComplaints: ExistingComplaint[] = existingGrievances
    .filter(g => g.translatedText)
    .map(g => ({
      grievance_id: g.id,
      text: g.translatedText!,
    }));

  // 4️⃣ Call Gemini duplicate detection
  const duplicateResult = await detectDuplicateGrievance(
    currentGrievance.translatedText,
    existingComplaints
  );

  return duplicateResult;
}
