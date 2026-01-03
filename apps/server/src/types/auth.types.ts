import { z } from "zod";

// ==================== Signup ====================
export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
});

export type SignupInput = z.infer<typeof signupSchema>;

// ==================== Login ====================
export const loginSchema = z.object({
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    password: z.string().min(1, "Password is required"),
}).refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
});

export type LoginInput = z.infer<typeof loginSchema>;

// ==================== Service Interfaces ====================
export interface SignupData {
    name: string;
    email?: string;
    phone?: string;
    password: string;
}

export interface LoginData {
    email?: string;
    phone?: string;
    password: string;
}

export interface UserResponse {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    departmentId: string | null;
}

export interface AuthResponse {
    user: UserResponse;
    token: string;
}
