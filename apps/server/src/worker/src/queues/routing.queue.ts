import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../utils/redis';
import { routingProcessor } from '../processors/routing.processor';

export const ROUTING_QUEUE_NAME = "grievance-routing";4

export const routingQueue = new Queue(ROUTING_QUEUE_NAME, {
  connection: redisConnection,
});

export const routingWorker = new Worker(
  ROUTING_QUEUE_NAME,
  routingProcessor,
  { connection: redisConnection, concurrency: 5 }
);