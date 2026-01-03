import { type Request, type Response } from "express";
import { analyzeGrievanceText } from "../services/master.service";

export async function analyzeGrievanceController(
  req: Request,
  res: Response
) {
  try {
    const { normalizedText } = req.body;

    // 1️⃣ Validation
    if (!normalizedText || typeof normalizedText !== "string") {
      return res.status(400).json({
        success: false,
        message: "normalizedText is required and must be a string",
      });
    }

    // 2️⃣ Call service
    const analysisResult = await analyzeGrievanceText(normalizedText);

    // 3️⃣ Response
    return res.status(200).json({
      success: true,
      data: analysisResult,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);

    if (error.message === "GEMINI_RATE_LIMIT") {
      return res.status(429).json({
        success: false,
        message: "AI service is busy. Please retry later.",
      });
    }

    if (error.message === "GEMINI_KEY_INVALID") {
      return res.status(500).json({
        success: false,
        message: "AI configuration error",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze complaint",
      error: error.message,
    });
  }
}
