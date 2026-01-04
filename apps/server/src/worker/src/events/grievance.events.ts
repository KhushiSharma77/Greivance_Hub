import prisma from '@team-call-of-code/db';
import type { GrievanceProcessedEvent } from '../types/events.types';

export const grievanceEvents = {
  async onProcessed(event: GrievanceProcessedEvent) {
    const { grievanceId, analysis } = event;

    console.log('[EVENT] Grievance Processed:', grievanceId);

    await prisma.$transaction(async (tx) => {
      // Update grievance core fields
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          status: 'ANALYZED',
          category: analysis.category,
          priority: analysis.priority,
        },
      });

      // Upsert AI metadata (SAFE for retries)
      await tx.grievanceAIMetadata.upsert({
        where: { grievanceId },
        create: {
          grievanceId,
          urgency: analysis.urgency,
          severity: analysis.severity,
          sentiment: analysis.sentiment,
          confidence: analysis.confidence,
        },
        update: {
          urgency: analysis.urgency,
          severity: analysis.severity,
          sentiment: analysis.sentiment,
          confidence: analysis.confidence,
        },
      });
    });
  },

  async onFailed(grievanceId: string, error: Error) {
    console.error('[EVENT] Grievance Processing Failed:', {
      grievanceId,
      error: error.message,
    });

    await prisma.grievance.update({
      where: { id: grievanceId },
      data: {
        status: 'PENDING',
      },
    });

  },
};
