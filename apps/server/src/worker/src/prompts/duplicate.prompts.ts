import type { ExistingComplaint } from "../types/duplicatesIssue";

export const DUPLICATE_DETECTION_PROMPT = (
  currentComplaint: string,
  existingComplaints: ExistingComplaint[]
) => `
You are an AI system designed to detect duplicate citizen grievances.

Goal:
Determine whether the CURRENT complaint refers to the SAME real-world issue
as any of the EXISTING open complaints from the same department and location.

Instructions:
- Compare meaning, not just keywords.
- Minor wording differences are allowed.
- If multiple complaints match, choose the BEST match.
- If no meaningful match exists, return no duplication.

Rules:
- Return ONLY valid JSON.
- No explanations.
- No markdown.
- Do NOT invent grievance IDs.

CURRENT COMPLAINT:
"${currentComplaint}"

EXISTING OPEN COMPLAINTS:
${existingComplaints
  .map(
    (c, i) => `
${i + 1}. grievance_id: "${c.id}"
   text: "${c.translatedText}"
`
  )
  .join("\n")}

Return JSON in exactly this format:

If a duplicate is found:
{
  "isDuplicate": true,
  "matched_grievance_id": "",
  "similarity_score": 0
}

If NO duplicate is found:
{
  "isDuplicate": false,
  "matched_grievance_id": null,
  "similarity_score": 0
}

Notes:
- similarity_score must be between 0 and 1
- similarity_score represents semantic similarity
`;
