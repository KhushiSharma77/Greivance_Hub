import prisma from "@team-call-of-code/db";
import { NotFoundError } from "../lib/error-handler";

/**
 * Get citizen profile
 */
export async function getProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profilePicture: true,
            address: true,
            aadhaarNumber: true,
            isVerified: true,
            createdAt: true,
        },
    });

    if (!user) throw new NotFoundError("User not found");
    return user;
}

/**
 * Update citizen profile (name, phone, address, aadhaar)
 */
export async function updateProfile(
    userId: string,
    data: {
        name?: string;
        phone?: string;
        address?: string;
        aadhaarNumber?: string;
    }
) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.address !== undefined && { address: data.address }),
            ...(data.aadhaarNumber !== undefined && { aadhaarNumber: data.aadhaarNumber }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profilePicture: true,
            address: true,
            aadhaarNumber: true,
            isVerified: true,
            createdAt: true,
        },
    });

    return user;
}

/**
 * Update profile picture URL
 */
export async function updateProfilePicture(userId: string, imageUrl: string) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: imageUrl },
        select: {
            id: true,
            profilePicture: true,
        },
    });

    return user;
}
