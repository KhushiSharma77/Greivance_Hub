/**
 * Job Type Definitions
 */

export interface GrievanceJobData {
    grievanceId: string;
    userId: string;
    originalText: string;
}

export interface DuplicateJobData {
    grievanceId: string;
    category?: string;
}

export interface RoutingJobData {
    grievanceId: string;
    category: string;
    priority: string;
}
