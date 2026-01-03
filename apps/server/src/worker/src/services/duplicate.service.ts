import { geminiModel } from "./gemini.service";
import { DUPLICATE_DETECTION_PROMPT } from "../prompts/duplicate.prompts";
import { extractJsonFromText } from "../utils/extractJson";
import type { ExistingComplaint } from "@/types/duplicatesIssue";



export async function detectDuplicateGrievance(
    currentComplaintText: string,
    existingComplaints: ExistingComplaint[]
) {
    // Guard: nothing to compare
    if (!existingComplaints.length) {
        return {
            isDuplicate: false,
            matched_grievance_id: null,
            similarity_score: 0,
        };
    }

    const result = await geminiModel.generateContent(
        DUPLICATE_DETECTION_PROMPT(
            currentComplaintText,
            existingComplaints
        )
    );

    const responseText = result.response.text();

    try {
        return extractJsonFromText(responseText);
    } catch (err) {
        console.error("Raw Gemini Duplicate Response:", responseText);
        throw new Error("Invalid JSON from Gemini (duplicate detection stage)");
    }
}
