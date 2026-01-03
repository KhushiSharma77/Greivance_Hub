import prisma from "@team-call-of-code/db";
import { NotFoundError } from "../lib/error-handler";

/**
 * Get all grievances for officer panel (filtered by officer's department)
 */
export async function getAllGrievancesByDepartment(departmentId: string) {
    const grievances = await prisma.grievance.findMany({
        where: {
            departmentId,
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
 * Update grievance status (officer panel)
 */
export async function updateGrievanceStatus(
    grievanceId: string,
    status: string,
) {
    // Check if grievance exists
    const existingGrievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
    });

    if (!existingGrievance) {
        throw new NotFoundError("Grievance not found");
    }

    // Update status
    const grievance = await prisma.grievance.update({
        where: { id: grievanceId },
        data: {
            status,
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
            assignedOfficer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return grievance;
}
