import jwt from "jsonwebtoken";
import prisma from "@team-call-of-code/db";
import { env } from "@team-call-of-code/env/server";
import { UnauthorizedError, ValidationError } from "../lib/error-handler";


interface SignupData {
    name: string;
    email?: string;
    phone?: string;
    password: string;
}

interface LoginData {
    email?: string;
    phone?: string;
    password: string;
}

interface UserResponse {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    departmentId: string | null;
    department?: {
        name: string;
    } | null;
}

interface AuthResponse {
    user: UserResponse;
    token: String
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password);
}

/**
 * Compare password with hash
 */
export async function comparePassword(
    password: string,
    hash: string,
): Promise<boolean> {
    return Bun.password.verify(password, hash);
}

/**
 * Generate JWT access token
 */
export function generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
        expiresIn: "24h",
    });
}

/**
 * Signup new citizen
 */
export async function signupCitizen(
    data: SignupData,
): Promise<void> {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email || undefined },
                { phone: data.phone || undefined },
            ],
        },
    });

    if (existingUser) {
        // If already verified, block re-registration
        if (existingUser.isVerified) {
            throw new ValidationError("User with this email or phone already exists");
        }

        // If unverified, update their data (allow re-signup attempt)
        const hashedPassword = await hashPassword(data.password);
        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                name: data.name,
                password: hashedPassword,
                email: data.email || null,
                phone: data.phone || null,
            },
        });
        return;
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create citizen user
    await prisma.user.create({
        data: {
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            password: hashedPassword,
            role: "citizen",
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            departmentId: true,
        },
    });
}

/**
 * Login user (any role)
 */
export async function login(data: LoginData): Promise<AuthResponse> {
    // Find user by email or phone
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email || undefined },
                { phone: data.phone || undefined },
            ],
        },
        include: {
            department: true
        }
    });

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
        throw new UnauthorizedError("Invalid credentials");
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            departmentId: user.departmentId,
            department: user.department ? { name: user.department.name } : null,
        },
        token,
    };
}

/**
 * Mark a user as verified after OTP confirmation
 */
export async function markUserVerified(email: string): Promise<void> {
    await prisma.user.updateMany({
        where: { email },
        data: { isVerified: true },
    });
}