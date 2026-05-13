import { Redis } from 'ioredis';
import { env } from "@team-call-of-code/env/server";

console.log('[REDIS] Checking environment...');
if (env.REDIS_URL) {
  console.log('[REDIS] Found REDIS_URL in environment');
} else {
  console.log('[REDIS] REDIS_URL is MISSING in environment. Falling back to localhost.');
}

export const redis = env.REDIS_URL
  ? new Redis(env.REDIS_URL, { maxRetriesPerRequest: null })
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