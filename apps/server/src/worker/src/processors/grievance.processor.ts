import { routeGrievanceToDepartment } from "./routing.processor";

import type { GrievanceDTO, PriorityLevel } from "@/types/Grievance";
import { createGrievance } from "../services/routing.service";

type GrievanceProcessorInput = {
    userId: string;
    originalText: string;
    translatedText: string;
    category: string;
    priority: PriorityLevel;
    city: string;
    latitude?: number;
    longitude?: number;
};

export async function processGrievance(
    input: GrievanceProcessorInput
): Promise<GrievanceDTO> {
    const {
        userId,
        originalText,
        translatedText,
        category,
        priority,
        city,
        latitude,
        longitude,
    } = input;

    // 1️⃣ Route grievance → department
    const routingResult = routeGrievanceToDepartment(category, city);

    const { departmentName } = routingResult;

    // 2️⃣ Persist grievance
    const grievance = await createGrievance({
        departmentName,
        grievance: {
            userId,
            originalText,
            translatedText,
            category,
            priority,
            latitude,
            longitude,
        },
    });

    return grievance;
}
