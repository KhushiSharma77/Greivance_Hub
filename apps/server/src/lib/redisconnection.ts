import { Redis } from 'ioredis';

export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
  });
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});