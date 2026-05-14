import { Job } from 'bullmq';

import { duplicateQueue } from '../queues/duplicate.queue';
import { routingQueue } from '../queues/routing.queue';
import { grievanceEvents } from '../events/grievance.events';
import { analyzeGrievanceText } from '../services/master.service';

export async function grievanceProcessor(job: Job) {
  const { grievanceId, text } = job.data;

  try {
    // 1️⃣ Category, priority, sentiment
    const analysis = await analyzeGrievanceText(text)

    await grievanceEvents.onProcessed({
      grievanceId,
      analysis,
    });

    // 2️⃣ 🔥 CHAIN → ROUTING
    await routingQueue.add(
      'grievance-routing',
      {
        grievanceId,
      },
      { attempts: 3 }
    );

    // 3️⃣ 🔥 CHAIN → DUPLICATE
    await duplicateQueue.add(
      'duplicate-detection',
      {
        grievanceId,
        text,
        category: analysis.category,
      },
      { attempts: 3 }
    );

    return { grievanceId };
  } catch (err) {
    await grievanceEvents.onFailed(grievanceId, err as Error);
    throw err;
  }
}
