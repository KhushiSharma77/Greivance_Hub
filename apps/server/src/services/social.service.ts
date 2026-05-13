import prisma, { Prisma } from "@team-call-of-code/db";
import { NotFoundError } from "../lib/error-handler";

/**
 * Get the public social feed of grievances.
 * Sorts by upvotes and recency.
 */
export async function getPublicFeed() {
    const grievances = await prisma.grievance.findMany({
        where: {
            isPublic: true,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
            department: {
                select: {
                    id: true,
                    name: true,
                    City: true
                }
            },
            _count: {
                select: {
                    upvotes: true,
                    comments: true
                }
            }
        },
        orderBy: [
            { priority: 'desc' },            // Higher priority first (High > Medium > Low)
            { createdAt: 'desc' }            // Then most recent
        ],
        take: 50 // Limit feed
    });

    return grievances;
}

/**
 * Toggle an upvote for a specific user on a grievance
 */
export async function toggleUpvote(grievanceId: string, userId: string) {
    // Check if grievance exists
    const grievance = await prisma.grievance.findUnique({ where: { id: grievanceId } });
    if (!grievance) throw new NotFoundError("Grievance not found");

    const existingUpvote = await prisma.upvote.findUnique({
        where: {
            userId_grievanceId: {
                userId,
                grievanceId
            }
        }
    });

    if (existingUpvote) {
        // Remove upvote
        await prisma.upvote.delete({
            where: { id: existingUpvote.id }
        });
        return { message: "Upvote removed", upvoted: false };
    } else {
        // Add upvote
        await prisma.upvote.create({
            data: {
                userId,
                grievanceId
            }
        });
        return { message: "Upvoted successfully", upvoted: true };
    }
}

/**
 * Add a comment to a grievance
 */
export async function addComment(grievanceId: string, userId: string, content: string) {
    const grievance = await prisma.grievance.findUnique({ where: { id: grievanceId } });
    if (!grievance) throw new NotFoundError("Grievance not found");

    const comment = await prisma.comment.create({
        data: {
            content,
            userId,
            grievanceId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return comment;
}

/**
 * Get comments for a grievance
 */
export async function getComments(grievanceId: string) {
    const comments = await prisma.comment.findMany({
        where: { grievanceId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    return comments;
}
