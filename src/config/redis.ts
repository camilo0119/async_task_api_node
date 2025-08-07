import Redis, { RedisOptions } from 'ioredis';
import { config } from './config';
import { logger } from '../utils/logger';

let redis: Redis;

export async function connectRedis(): Promise<void> {
  try {
    const redisOptions: RedisOptions = {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD?.toString() ?? '',
      enableReadyCheck: false,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    };

    redis = new Redis(redisOptions);

    await redis.connect();
    await redis.ping();
    
    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisConnection(): Redis {
  if (!redis) {
    throw new Error('Redis connection not initialized');
  }
  return redis;
}