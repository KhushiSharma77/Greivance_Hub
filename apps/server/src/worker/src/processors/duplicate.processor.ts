import { Job } from 'bullmq';
import prisma from '@team-call-of-code/db';

import { detectDuplicateGrievance } from '../services/duplicate.service';
import { duplicateEvents } from '../events/duplicate.events';
import { routingQueue } from '../queues/routing.queue';
import type { ExistingComplaint } from '@/worker/src/types/duplicatesIssue';


type DuplicateJobData = {
  grievanceId: string;
  text: string;
  category: string;
};

const MAX_COMPLAINTS_TO_COMPARE = 20;
const SIMILARITY_THRESHOLD = 0.75;


export async function duplicateProcessor(job: Job<DuplicateJobData>) {
  const { grievanceId, text, category } = job.data;

  try {
    /* 1️⃣ Fetch recent & relevant complaints only */
    const existingComplaints: ExistingComplaint[] =
      await prisma.grievance.findMany({
        where: {
          status: 'IN_PROGRESS',
          category,
          id: { not: grievanceId }, // avoid self-match
        },
        select: {
          id: true,
          translatedText: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: MAX_COMPLAINTS_TO_COMPARE,
      });

    /* 2️⃣ Short-circuit if nothing to compare */
    if (existingComplaints.length === 0) {
      await routingQueue.add('route-grievance', { grievanceId });
      return { grievanceId, status: 'unique', similarity_score: 0 };
    }

    /* 3️⃣ Gemini duplicate detection */
    const result = await detectDuplicateGrievance(
      text,
      existingComplaints
    );

    const {
      isDuplicate,
      matched_grievance_id,
      similarity_score,
    } = result;

    /* 4️⃣ Emit duplicate event */
    await duplicateEvents.onChecked({
      grievanceId,
      isDuplicate,
      matchedGrievanceId: matched_grievance_id,
      similarityScore: similarity_score,
    });

    /* 5️⃣ Stop pipeline if duplicate (with confidence) */
    if (isDuplicate && similarity_score >= SIMILARITY_THRESHOLD) {
      return {
        grievanceId,
        status: 'duplicate',
        matched_grievance_id,
        similarity_score,
      };
    }

    /* 6️⃣ Chain → Routing */
    await routingQueue.add(
      'route-grievance',
      { grievanceId },
      { attempts: 2 }
    );

    return {
      grievanceId,
      status: 'unique',
      similarity_score,
    };
  } catch (err) {
    await duplicateEvents.onFailed(grievanceId, err as Error);
    throw err; // allow BullMQ retry
  }
}
