import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({ url: redisUrl });

redis.on('error', (err) => {
  console.warn('Redis connection error (cache & sessions may be disabled fallback):', err.message);
});

// Since process startup doesn't await this, we connect in the background
redis.connect().catch((err) => {
  console.warn('Failed to connect to Redis initially:', err.message);
});
