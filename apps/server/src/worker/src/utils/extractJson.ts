export function extractJsonFromText(text: string) {
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  // Remove markdown code fences if present
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Try direct JSON parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: extract first JSON object from text
    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON object found in response");
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      throw new Error("Failed to parse extracted JSON");
    }
  }
}
