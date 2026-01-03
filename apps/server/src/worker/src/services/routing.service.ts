import type {
    CreateGrievanceInput,
    GrievanceDTO,
} from "@/types/Grievance";
import prisma from "@team-call-of-code/db";

export async function createGrievance(
    input: CreateGrievanceInput
): Promise<GrievanceDTO> {
    const { departmentName, grievance } = input;

    const {
        userId,
        originalText,
        translatedText,
        category,
        priority,
        latitude,
        longitude,
    } = grievance;

    // 1️⃣ Fetch department by name
    const department = await prisma.department.findFirst({
        where: { name: departmentName },
    });

    if (!department) {
        throw new Error(`Department not found: ${departmentName}`);
    }

    // 2️⃣ Create grievance (Prisma internal)
    const created = await prisma.grievance.create({
        data: {
            userId,
            originalText,
            translatedText,
            category,
            priority,
            status: "PENDING", // string literal, not Prisma enum
            departmentId: department.id,
            latitude,
            longitude,
        },
    });

    // 3️⃣ Map Prisma model → Domain DTO
    return {
        id: created.id,
        userId: created.userId,
        originalText: created.originalText,
        translatedText: created.translatedText,
        category: created.category,
        priority: created.priority as any,
        status: created.status as any,
        departmentId: created.departmentId,
        assignedOfficerId: created.assignedOfficerId,
        duplicateOfId: created.duplicateOfId,
        latitude: created.latitude,
        longitude: created.longitude,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
    };
}
