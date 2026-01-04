import { Queue, Worker } from 'bullmq';
import { multilingualProcessor } from '../processors/multilingual.processor';
import { redisConnection } from '../utils/redis';

export const MULTILINGUAL_QUEUE_NAME = "multilingual-process";

export const multilingualQueue = new Queue(MULTILINGUAL_QUEUE_NAME, {
  connection: redisConnection,
});

export const multilingualWorker = new Worker(
  MULTILINGUAL_QUEUE_NAME,
  multilingualProcessor,
  {
    connection: redisConnection,
    concurrency: 3,
  }
);
