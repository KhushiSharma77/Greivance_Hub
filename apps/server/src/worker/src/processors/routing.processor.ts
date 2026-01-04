import { Job } from 'bullmq';
import prisma from '@team-call-of-code/db';
import { routingEvents } from '../events/routing.events';
import { routeGrievanceText } from '../services/routing.service';

export async function routingProcessor(job: Job) {
  const { grievanceId } = job.data;

  // 1️⃣ Fetch required grievance data
  const grievance = await prisma.grievance.findUnique({
    where: { id: grievanceId },
    select: {
      category: true,
      latitude: true,
      longitude: true,
      translatedText: true,
      originalText: true,
    },
  });

  if (!grievance) {
    throw new Error(`Grievance not found: ${grievanceId}`);
  }

  const {
    category,
    latitude,
    longitude,
    translatedText,
    originalText,
  } = grievance;

  // 2️⃣ Validate required fields
  if (!category || latitude == null || longitude == null) {
    throw new Error(
      `Missing routing data for grievance ${grievanceId}`
    );
  }

  // 3️⃣ Call Gemini routing service
  const routingResult = await routeGrievanceText({
    normalizedText: translatedText ?? originalText,
    category,
    latitude,
    longitude,
  });

  // 4️⃣ Confidence guard (important)
  if (routingResult.confidence < 0.6) {
    throw new Error(
      `Low routing confidence (${routingResult.confidence})`
    );
  }

  // 5️⃣ Emit routing success event
  await routingEvents.onRouted({
    grievanceId,
    departmentName: routingResult.department,
    city: routingResult.city,
  });

  return {
    grievanceId,
    department: routingResult.department,
    city: routingResult.city,
    confidence: routingResult.confidence,
  };
}
