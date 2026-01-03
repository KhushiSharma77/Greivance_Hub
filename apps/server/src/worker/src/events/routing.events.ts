import prisma from '@team-call-of-code/db';
import type { GrievanceRoutedEvent } from '../types/events.types';

export const routingEvents = {
 
  async onRouted(event: GrievanceRoutedEvent) {
    const { grievanceId, departmentName, city } = event;

    console.log('[EVENT] Grievance Routed:', {
      grievanceId,
      departmentName,
      city,
    });

    // 1️⃣ Resolve department ID safely
    const department = await prisma.department.findFirst({
      where: {
        name: departmentName,
        City: city,
      },
      select: {
        id: true,
      },
    });

    if (!department) {
      throw new Error(
        `No department found for ${departmentName} in ${city}`
      );
    }

    await prisma.$transaction(async (tx) => {
      // Update grievance
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          departmentId: department.id,
          status: 'IN_PROGRESS',
        },
      });

    });

    // 3️⃣ Optional async side effects
    // notifyDepartment(department.id, grievanceId);
  },

  
  async onFailed(grievanceId: string, error: Error) {
    console.error('[EVENT] Routing Failed:', {
      grievanceId,
      error: error.message,
    });

    await prisma.$transaction(async (tx) => {
      // Revert to safe retryable state
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          status: 'ANALYZED',
        },
      });

      
      
    });
  },
};
