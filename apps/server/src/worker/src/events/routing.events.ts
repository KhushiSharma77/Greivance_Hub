import prisma from '@team-call-of-code/db';
import type { GrievanceRoutedEvent } from '../types/events.types';

export const routingEvents = {
  async onRouted(event: GrievanceRoutedEvent) {
    const { grievanceId, departmentId } = event;

    console.log('[EVENT] Grievance Routed:', {
      grievanceId,
      departmentId,
    });

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Update grievance with department & status
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          departmentId,
          status: 'IN_PROGRESS',
        },
      });
    });

    // 3️⃣ Optional: trigger notification (async)
    // notifyDepartment(departmentId, grievanceId);
  },

  async onFailed(grievanceId: string, error: Error) {
    console.error('[EVENT] Routing Failed:', {
      grievanceId,
      error: error.message,
    });

    // Mark grievance for retry or manual review
    await prisma.grievance.update({
      where: { id: grievanceId },
      data: {
        status: 'ANALYZED', // fallback to previous stable state
      },
    });

    // Optional audit log
    
  },
};
