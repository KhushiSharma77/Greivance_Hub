import { Job } from 'bullmq';
import { normalizeComplaintText } from '../services/multilingual.service';

import { multilingualEvents } from '../events/multilingual.events';
import { GRIEVANCE_QUEUE_NAME, grievanceQueue } from '../queues/grievance.queue';

export async function multilingualProcessor(job: Job) {
  const { grievanceId, text } = job.data;

  try {
    // ✅ CALL SERVICE HERE
    const {normalized_text,detected_language} =
      await normalizeComplaintText(text);

    // side effects
    await multilingualEvents.onProcessed({
      grievanceId,
      originalLanguage: detected_language,
      normalizedText:normalized_text,
    });

    // chain next job
    await grievanceQueue.add(GRIEVANCE_QUEUE_NAME, {
      grievanceId,
      text: normalized_text,
    });

    return { grievanceId };
  } catch (err) {
    await multilingualEvents.onFailed(grievanceId);
    throw err; // IMPORTANT for retry
  }
}
