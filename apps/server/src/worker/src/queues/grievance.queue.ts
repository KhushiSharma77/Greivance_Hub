import { Queue,Worker } from "bullmq";
import { redisConnection } from "../utils/redis";
import { grievanceProcessor } from "../processors/grievance.processor";

export const GRIEVANCE_QUEUE_NAME = "grievance-processing";

export const grievanceQueue = new Queue(GRIEVANCE_QUEUE_NAME, {
  connection: redisConnection,
});

export const grievanceWorker = new Worker(
  GRIEVANCE_QUEUE_NAME,
  grievanceProcessor,
  { connection: redisConnection, concurrency: 5 }
);