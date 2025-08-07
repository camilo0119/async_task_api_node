import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management',
  
  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  
  // Queue settings
  QUEUE_NAME: process.env.QUEUE_NAME || 'task-queue',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;