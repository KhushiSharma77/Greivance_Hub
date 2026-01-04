import prisma from '@team-call-of-code/db';
import type { DuplicateCheckedEvent } from '../types/events.types';

export const duplicateEvents = {
  async onChecked(event: DuplicateCheckedEvent) {
    const {
      grievanceId,
      isDuplicate,
      matchedGrievanceId,
      similarityScore,
    } = event;

    console.log('[EVENT] Duplicate Checked:', {
      grievanceId,
      isDuplicate,
      matchedGrievanceId,
      similarityScore,
    });

    // 1️⃣ Always update AI metadata (fact recording)
    await prisma.grievanceAIMetadata.update({
      where: { grievanceId },
      data: {
        isDuplicate,
        similarityScore,
      },
    });

    // 2️⃣ If NOT a duplicate → stop here
    if (!isDuplicate || !matchedGrievanceId) {
      return;
    }

    // 3️⃣ Link CURRENT grievance as CHILD
    await prisma.grievance.update({
      where: { id: grievanceId },
      data: {
        duplicateOfId: matchedGrievanceId,
      },
    });

    // 4️⃣ Calculate IMPACT (how many duplicates exist)
    const duplicateCount = await prisma.grievance.count({
      where: {
        duplicateOfId: matchedGrievanceId,
      },
    });

    const impactScore = duplicateCount + 1; // parent + children

    // 5️⃣ Fetch parent grievance AI data
    const parentAI = await prisma.grievanceAIMetadata.findUnique({
      where: { grievanceId: matchedGrievanceId },
    });

    if (!parentAI) {
      console.warn(
        '[WARN] Parent grievance has no AI metadata:',
        matchedGrievanceId
      );
      return;
    }

    // 6️⃣ Recalculate PRIORITY SCORE (backend logic)
    const priorityScore =
      (parentAI.severity?parentAI.severity:0) * 0.5 +
      (parentAI.urgency?parentAI.urgency:0) * 0.3 +
      impactScore * 0.2;

    // 7️⃣ Convert numeric score → PriorityLevel
    const priority =
      priorityScore >= 7
        ? 'High'
        : priorityScore >= 4
        ? 'Medium'
        : 'Low';

    // 8️⃣ Update ONLY the parent grievance priority
    await prisma.grievance.update({
      where: { id: matchedGrievanceId },
      data: {
        priority,
      },
    });

    console.log('[EVENT] Duplicate Linked & Priority Updated:', {
      parent: matchedGrievanceId,
      impactScore,
      priority,
    });
  },

  async onFailed(grievanceId: string, error: Error) {
    console.error('[EVENT] Duplicate Check Failed:', {
      grievanceId,
      error: error.message,
    });

    // mark AI metadata failure
    await prisma.grievanceAIMetadata.update({
      where: { grievanceId },
      data: {
        isDuplicate: false,
      },
    });
  },
};
