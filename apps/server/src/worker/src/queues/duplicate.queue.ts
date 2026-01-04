import { duplicateProcessor } from "../processors/duplicate.processor";
import { redisConnection } from "../utils/redis";
import { Queue,Worker } from "bullmq";
export const DUPLICATE_QUEUE_NAME = "duplicate-detection";

export const duplicateQueue = new Queue(DUPLICATE_QUEUE_NAME, {
  connection: redisConnection,
});

export const duplicateWorker = new Worker(
  DUPLICATE_QUEUE_NAME,
  duplicateProcessor,
  { connection: redisConnection, concurrency: 5 }
);


