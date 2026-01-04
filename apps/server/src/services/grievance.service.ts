import prisma from "@team-call-of-code/db";
import { ForbiddenError, NotFoundError } from "../lib/error-handler";

interface CreateGrievanceData {
    userId: string;
    originalText: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
}

interface UpdateGrievanceData {
    originalText: string;
}

/**
 * Check if grievance belongs to user
 */
async function checkOwnership(grievanceId: string, userId: string): Promise<void> {
    const grievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
        select: { userId: true },
    });

    if (!grievance) {
        throw new NotFoundError("Grievance not found");
    }
}

/**
 * Create a new grievance
 */
export async function createGrievance(data: CreateGrievanceData) {
    const grievance = await prisma.grievance.create({
        data: {
            userId: data.userId,
            originalText: data.originalText,
            category: data.category,
            latitude: data.latitude,
            longitude: data.longitude,
            imageUrl: data.imageUrl,
            status: "PENDING",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            department: true,
        },
    });

    return grievance;
}

/**
 * Get all grievances for a user
 */
export async function getGrievancesByUserId(userId: string) {
    const grievances = await prisma.grievance.findMany({
        where: { userId },
        include: {
            department: true,
            assignedOfficer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return grievances;
}

/**
 * Get a single grievance by ID
 */
export async function getGrievanceById(grievanceId: string) {
    const grievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            department: true,
            assignedOfficer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            aiMetadata: true,
        },
    });

    return grievance;
}

/**
 * Update a grievance (only if PENDING)
 */
export async function updateGrievance(
    grievanceId: string,
    userId: string,
    data: UpdateGrievanceData,
) {
    await checkOwnership(grievanceId, userId);

    // Check if grievance is in PENDING status
    const existingGrievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
        select: { status: true },
    });

    if (existingGrievance?.status !== "PENDING") {
        throw new ForbiddenError("Only pending grievances can be updated");
    }

    const grievance = await prisma.grievance.update({
        where: { id: grievanceId },
        data: {
            originalText: data.originalText,
            updatedAt: new Date(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            department: true,
        },
    });

    return grievance;
}

/**
 * Delete a grievance (only if PENDING)
 */
export async function deleteGrievance(grievanceId: string, userId: string) {
    await checkOwnership(grievanceId, userId);

    // Check if grievance is in PENDING status
    const existingGrievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
        select: { status: true },
    });

    if (existingGrievance?.status !== "PENDING") {
        throw new ForbiddenError("Only pending grievances can be deleted");
    }

    await prisma.grievance.delete({
        where: { id: grievanceId },
    });
}
