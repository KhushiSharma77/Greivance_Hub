import { z } from "zod";

// ==================== Update Grievance Status ====================
export const updateGrievanceStatusSchema = z.object({
    status: z.enum(["PENDING", "ANALYZED", "IN_PROGRESS", "RESOLVED", "CLOSED"], {
        errorMap: () => ({ message: "Invalid status value" }),
    }),
});

export type UpdateGrievanceStatusInput = z.infer<typeof updateGrievanceStatusSchema>;
