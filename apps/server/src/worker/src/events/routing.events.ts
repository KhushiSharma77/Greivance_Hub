import prisma from '@team-call-of-code/db';
import type { GrievanceRoutedEvent } from '../types/events.types';

export const routingEvents = {
 
  async onRouted(event: GrievanceRoutedEvent) {
    const { grievanceId, departmentName, city, category, priority } = event;

    console.log('[EVENT] Grievance Routed:', {
      grievanceId,
      departmentName,
      city,
      category,
      priority
    });

    // 1️⃣ Resolve department ID safely (Case-insensitive name match)
    let department = await prisma.department.findFirst({
      where: {
        name: { equals: departmentName, mode: 'insensitive' },
        City: { equals: city, mode: 'insensitive' },
      },
      select: { id: true },
    });

    // Fallback 1: If no city-specific department, try finding one with the same name in any city
    if (!department) {
      department = await prisma.department.findFirst({
        where: { name: { equals: departmentName, mode: 'insensitive' } },
        select: { id: true },
      });
    }

    // Fallback 2: Fuzzy matching for common department aliases if still not found
    if (!department) {
      const lowerName = departmentName.toLowerCase();
      let fuzzyName = departmentName;

      if (lowerName.includes("water") || lowerName.includes("sewage")) fuzzyName = "Water Supply & Sewerage Board";
      else if (lowerName.includes("electricity") || lowerName.includes("power")) fuzzyName = "State Electricity Board";
      else if (lowerName.includes("road") || lowerName.includes("pothole") || lowerName.includes("pwd")) fuzzyName = "Public Works Department (PWD)";
      else if (lowerName.includes("waste") || lowerName.includes("garbage") || lowerName.includes("cleaning")) fuzzyName = "Municipal Corporation (Solid Waste)";
      else if (lowerName.includes("traffic") || lowerName.includes("police")) fuzzyName = "Traffic Police";
      else if (lowerName.includes("forest") || lowerName.includes("environment") || lowerName.includes("tree")) fuzzyName = "Environment & Forest Department";

      if (fuzzyName !== departmentName) {
        department = await prisma.department.findFirst({
          where: { name: { equals: fuzzyName, mode: 'insensitive' } },
          select: { id: true },
        });
      }
    }

    // Auto-create standard department for this city if it doesn't exist
    if (!department) {
      department = await prisma.department.create({
        data: {
          name: departmentName,
          City: city,
        },
        select: {
          id: true,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      // Update grievance
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          departmentId: department?.id,
          category: category,
          priority: priority,
          status: 'ANALYZED', // Changed to ANALYZED so user knows AI finished
        },
      });
    });
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
          status: 'PENDING',
        },
      });
    });
  },
};
