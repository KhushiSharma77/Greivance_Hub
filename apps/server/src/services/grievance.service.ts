import prisma, { Prisma } from "@team-call-of-code/db";
import { ForbiddenError, NotFoundError } from "../lib/error-handler";
import { uploadImage } from "../utils/imageUtils";
import { supabase } from "../index";

type MulterFile = Express.Multer.File;

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
export async function createGrievance(data: CreateGrievanceData, file?: MulterFile): Promise<Prisma.GrievanceGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                phone: true;
            };
        };
        department: true;
    };
}>> {

    let imageUrl: string | undefined;
    if (file) {
        imageUrl = await uploadImage(supabase, file, "Grievance");
    }
    const grievance = await prisma.grievance.create({
        data: {
            userId: data.userId,
            originalText: data.originalText,
            latitude: data.latitude,
            longitude: data.longitude,
            imageUrl: imageUrl,
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
export async function getGrievancesByUserId(userId: string): Promise<Prisma.GrievanceGetPayload<{
    include: {
        department: true;
        assignedOfficer: {
            select: {
                id: true;
                name: true;
                email: true;
            };
        };
    };
}>[]> {
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
export async function getGrievanceById(grievanceId: string): Promise<Prisma.GrievanceGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                phone: true;
            };
        };
        department: true;
        assignedOfficer: {
            select: {
                id: true;
                name: true;
                email: true;
            };
        };
        aiMetadata: true;
    };
}> | null> {
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
    file: MulterFile | undefined,
    data: UpdateGrievanceData,
): Promise<Prisma.GrievanceGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                phone: true;
            };
        };
        department: true;
    };
}>> {
    await checkOwnership(grievanceId, userId);

    // Check if grievance is in PENDING status
    const existingGrievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
        select: {
            status: true,
            imageUrl: true
        },
    });

    if (existingGrievance?.status !== "PENDING") {
        throw new ForbiddenError("Only pending grievances can be updated");
    }

    let imageUrl: string | undefined;
    if (file) {
        const oldImage = existingGrievance.imageUrl;

        if (oldImage) imageUrl = await uploadImage(supabase, file, "Grievance", oldImage);
        else imageUrl = await uploadImage(supabase, file, "Grievance");
    }

    const grievance = await prisma.grievance.update({
        where: { id: grievanceId },
        data: {
            originalText: data.originalText,
            imageUrl: imageUrl,
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
