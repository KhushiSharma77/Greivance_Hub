import { z } from "zod";

// ==================== Create Grievance ====================
export const createGrievanceSchema = z.object({
    originalText: z.string().min(10, "Grievance text must be at least 10 characters"),
    category: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrl: z.string().optional(),
});

export type CreateGrievanceInput = z.infer<typeof createGrievanceSchema>;

// ==================== Update Grievance ====================
export const updateGrievanceSchema = z.object({
    originalText: z.string().min(10, "Grievance text must be at least 10 characters"),
});

export type UpdateGrievanceInput = z.infer<typeof updateGrievanceSchema>;

// ==================== Grievance ID Param ====================
export const grievanceIdSchema = z.object({
    id: z.string().uuid("Invalid grievance ID"),
});

export type GrievanceIdParam = z.infer<typeof grievanceIdSchema>;
