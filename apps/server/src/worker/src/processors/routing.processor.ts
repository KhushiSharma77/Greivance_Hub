import { Job } from 'bullmq';
import prisma from '@team-call-of-code/db';
import { routingEvents } from '../events/routing.events';
import { routeGrievanceText } from '../services/routing.service';
import { PriorityLevel } from '@team-call-of-code/db';

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

  // 2️⃣ Validate location (required for city inference)
  if (latitude == null || longitude == null) {
    throw new Error(
      `Missing location data for grievance ${grievanceId}`
    );
  }

  // 3️⃣ Call Gemini routing service
  const routingResult = await routeGrievanceText({
    normalizedText: translatedText ?? originalText,
    category: category ?? undefined,
    latitude,
    longitude,
  });

  // 4️⃣ Confidence guard
  if (routingResult.confidence < 0.3) { // Lowered slightly to allow more AI autonomy
    throw new Error(
      `Low routing confidence (${routingResult.confidence})`
    );
  }

  // 5️⃣ Emit routing success event
  await routingEvents.onRouted({
    grievanceId,
    departmentName: routingResult.department,
    city: routingResult.city,
    category: routingResult.category,
    priority: routingResult.priority as PriorityLevel,
  });

  return {
    grievanceId,
    department: routingResult.department,
    city: routingResult.city,
    confidence: routingResult.confidence,
  };
}
