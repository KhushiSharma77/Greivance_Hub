import prisma, { Prisma, GrievanceStatus } from "@team-call-of-code/db";
import { NotFoundError } from "../lib/error-handler";
import * as emailService from "./email.service";

/**
 * Get all grievances for officer panel (filtered by officer's department)
 */
export async function getAllGrievancesByDepartment(departmentId: string): Promise<Prisma.GrievanceGetPayload<{
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
        _count: {
            select: {
                upvotes: true;
                comments: true;
            };
        };
    };
}>[]> {
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
            _count: {
                select: {
                    upvotes: true,
                    comments: true
                }
            }
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
    status: GrievanceStatus,
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
        assignedOfficer: {
            select: {
                id: true;
                name: true;
                email: true;
            };
        };
        _count: {
            select: {
                upvotes: true;
                comments: true;
            };
        };
    };
}>> {
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
            _count: {
                select: {
                    upvotes: true,
                    comments: true
                }
            }
        },
    });

    // Send email notification to citizen
    if (grievance.user.email) {
        emailService.sendStatusUpdateEmail(grievance.user.email, {
            grievanceId: grievance.id,
            originalText: grievance.originalText,
            oldStatus: existingGrievance.status,
            newStatus: status,
            departmentName: grievance.department?.name,
        }).catch(err => console.error("[EMAIL] Failed to send status update email:", err));
    }

    return grievance;
}
