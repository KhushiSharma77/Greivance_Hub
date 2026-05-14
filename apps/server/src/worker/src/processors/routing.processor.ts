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

  // 2️⃣ Use location if available, otherwise route without city constraint
  const effectiveLat = latitude ?? 0;
  const effectiveLng = longitude ?? 0;

  // 3️⃣ Call Gemini routing service
  const routingResult = await routeGrievanceText({
    normalizedText: translatedText ?? originalText,
    category: category ?? undefined,
    latitude: effectiveLat,
    longitude: effectiveLng,
  });

  // 4️⃣ Confidence guard
  if (routingResult.confidence < 0.3) { // Lowered slightly to allow more AI autonomy
    throw new Error(
      `Low routing confidence (${routingResult.confidence})`
    );
  }

  // 5️⃣ Use "General" as city if no location was provided
  const effectiveCity = (latitude == null || longitude == null)
    ? "General"
    : routingResult.city;

  // 6️⃣ Emit routing success event
  await routingEvents.onRouted({
    grievanceId,
    departmentName: routingResult.department,
    city: effectiveCity,
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
