import {type Request,type Response } from "express";
import { normalizeComplaintText } from "../services/multilingual.service";

export async function normalizeComplaintController(
  req: Request,
  res: Response
) {
  try {
    const { complaintText } = req.body;

    // 1️⃣ Validation
    if (!complaintText || typeof complaintText !== "string") {
      return res.status(400).json({
        success: false,
        message: "complaintText is required and must be a string",
      });
    }

    // 2️⃣ Call service
    const normalizedResult = await normalizeComplaintText(complaintText);

    // 3️⃣ Response
    return res.status(200).json({
      success: true,
      data: normalizedResult,
    });
  } catch (error: any) {
    console.error("Normalization Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to normalize complaint",
      error: error.message,
    });
  }
}

