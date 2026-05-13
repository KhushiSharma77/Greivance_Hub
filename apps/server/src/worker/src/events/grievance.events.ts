import prisma from '@team-call-of-code/db';
import type { GrievanceProcessedEvent } from '../types/events.types';
import { sendStatusUpdateEmail } from '../../../services/email.service';

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

    // Send status update email to the citizen
    try {
      const grievance = await prisma.grievance.findUnique({
        where: { id: grievanceId },
        include: { user: { select: { email: true } }, department: { select: { name: true } } },
      });
      if (grievance?.user?.email) {
        await sendStatusUpdateEmail(grievance.user.email, {
          grievanceId,
          originalText: grievance.originalText,
          oldStatus: "PENDING",
          newStatus: "ANALYZED",
          departmentName: grievance.department?.name,
        });
      }
    } catch (e) {
      console.error("[EMAIL] Failed to send status update:", e);
    }
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
