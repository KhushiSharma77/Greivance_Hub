import { Redis } from 'ioredis';

export const redisConnection = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      tls: process.env.REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    })
  : new Redis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null,
    });
