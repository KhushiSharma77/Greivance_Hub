import { z } from "zod";

// ==================== Create Department ====================
export const createDepartmentSchema = z.object({
    name: z.string().min(2, "Department name must be at least 2 characters"),
    City: z.string().min(2, "City must be at least 2 characters"),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

// ==================== Create User (Officer) ====================
export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["officer", "admin"], {
        message: "Role must be either officer or admin",
    }),
    departmentId: z.string().uuid("Invalid department ID").optional(),
}).refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ==================== Assign Department ====================
export const assignDepartmentSchema = z.object({
    departmentId: z.string().uuid("Invalid department ID"),
});

export type AssignDepartmentInput = z.infer<typeof assignDepartmentSchema>;

// ==================== User ID Param ====================
export const userIdSchema = z.object({
    id: z.string().uuid("Invalid user ID"),
});

export type UserIdParam = z.infer<typeof userIdSchema>;

// ====================Service Interfaces ====================
export interface CreateDepartmentData {
    name: string;
    City: string;
}

export interface CreateUserData {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    role: "officer" | "admin";
    departmentId?: string;
}
