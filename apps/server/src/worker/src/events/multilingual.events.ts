import prisma from '@team-call-of-code/db';
import type {
  MultilingualProcessedEvent,
  MultilingualFailedEvent,
} from '../types/events.types';

export const multilingualEvents = {
  /**
   * Called when multilingual normalization succeeds
   */
  async onProcessed(event: MultilingualProcessedEvent) {
    const {
      grievanceId,
      originalLanguage,
      normalizedText,
    } = event;

    console.log('[EVENT] Multilingual Processed:', {
      grievanceId,
      originalLanguage,
    });

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Update grievance with normalized data
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          translatedText: normalizedText,
          status: 'PENDING', // ready for AI analysis
        },
      });

    });

    // 3️⃣ Optional: notify frontend / websocket
    // emitGrievanceUpdate(grievanceId);
  },

  /**
   * Called when multilingual processing fails
   */
  async onFailed(event: MultilingualFailedEvent) {
    const { grievanceId, error } = event;

    console.error('[EVENT] Multilingual Failed:', {
      grievanceId,
      error: error.message,
    });

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Move grievance to safe fallback state
      await tx.grievance.update({
        where: { id: grievanceId },
        data: {
          status: 'PENDING', // allow retry or manual review
        },
      });
    });
  },
};
