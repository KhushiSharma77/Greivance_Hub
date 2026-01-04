import { z } from "zod";
import { GrievanceStatus } from "@team-call-of-code/db";

// ==================== Update Grievance Status ====================
export const updateGrievanceStatusSchema = z.object({
    status: z.nativeEnum(GrievanceStatus, {
        error: "Invalid status value",
    }),
});

export type UpdateGrievanceStatusInput = z.infer<typeof updateGrievanceStatusSchema>;
