/**
 * Grievance Queue
 * Handles grievance processing jobs
 */

// TODO: Implement BullMQ queue for grievance processing
import { Queue,Worker } from "bullmq";
import { redisConnection } from "../utils/redis";
import { grievanceProcessor } from "../processors/grievance.processor";

export const GRIEVANCE_QUEUE_NAME = "grievance-processing";

// TODO: Create and export queue instance
export const grievanceQueue = new Queue(GRIEVANCE_QUEUE_NAME, {
  connection: redisConnection,
});

export const grievanceWorker = new Worker(
  GRIEVANCE_QUEUE_NAME,
  grievanceProcessor,
  { connection: redisConnection, concurrency: 5 }
);