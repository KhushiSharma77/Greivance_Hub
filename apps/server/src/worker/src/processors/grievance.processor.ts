import { Job } from 'bullmq';

<<<<<<< HEAD
import type { GrievanceDTO, PriorityLevel } from "@/types/grievance";
import { createGrievance } from "../services/routing.service";
=======
import { duplicateQueue } from '../queues/duplicate.queue';
import { grievanceEvents } from '../events/grievance.events';
import { analyzeGrievanceText } from '../services/master.service';
>>>>>>> origin

export async function grievanceProcessor(job: Job) {
  const { grievanceId, text } = job.data;

  try {
    // 1️⃣ Category, priority, sentiment
    const analysis = await analyzeGrievanceText(text)

    await grievanceEvents.onProcessed({
      grievanceId,
      analysis,
    });

    // 2️⃣ 🔥 CHAIN → DUPLICATE
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
