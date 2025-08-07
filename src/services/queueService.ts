import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { TaskService } from './taskService';
import { ApiError } from '../utils/ApiError';
import type { Redis } from 'ioredis';

interface JobData {
  taskId: string;
  job_type: 'reminder' | 'report';
  data?: Record<string, any>;
}

interface ScheduleJobOptions {
  delay?: number;
  scheduled_for?: Date;
}

export class QueueService {
  private queue: Queue;
  private worker: Worker;
  private taskService: TaskService;

  constructor(redisClient: Redis) {
    this.taskService = new TaskService();

    this.queue = new Queue(config.QUEUE_NAME, {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    this.worker = new Worker(
      config.QUEUE_NAME,
      async (job: Job<JobData>) => this.processJob(job),
      {
        connection: redisClient,
        concurrency: 5,
      }
    );

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.worker.on('completed', (job) => {
      logger.info('Job completed', {
        jobId: job.id,
        jobType: job.data.job_type,
      });
    });

    this.worker.on('failed', (job, err) => {
      logger.error('Job failed', {
        jobId: job?.id,
        jobType: job?.data?.job_type,
        error: err.message,
      });
    });

    this.worker.on('error', (err) => {
      logger.error('Worker error', err);
    });

    this.queue.on('error', (err) => {
      logger.error('Queue error', err);
    });
  }

  async scheduleJob(
    taskId: string,
    jobType: 'reminder' | 'report',
    options: ScheduleJobOptions = {},
    data: Record<string, any> = {}
  ): Promise<Job<JobData>> {
    try {
      await this.taskService.getTaskById(taskId);

      const jobData: JobData = { taskId, job_type: jobType, data };
      const jobOptions: any = { delay: options.delay };

      if (options.scheduled_for) {
        const delay = options.scheduled_for.getTime() - Date.now();
        if (delay <= 0) {
          throw new ApiError('Scheduled time must be in the future', 400);
        }
        jobOptions.delay = delay;
      }

      const job = await this.queue.add(`${jobType}-${taskId}`, jobData, jobOptions);

      logger.info('Job scheduled', {
        jobId: job.id,
        taskId,
        jobType,
        scheduledFor: options.scheduled_for,
      });

      return job;
    } catch (error) {
      logger.error('Error scheduling job', { taskId, jobType, error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to schedule job', 500);
    }
  }

  private async processJob(job: Job<JobData>): Promise<void> {
    const { taskId, job_type, data } = job.data;
    logger.info('Processing job', { jobId: job.id, taskId, jobType: job_type });

    try {
      const task = await this.taskService.getTaskById(taskId);

      switch (job_type) {
        case 'reminder':
          await this.processReminderJob(task, data);
          break;
        case 'report':
          await this.processReportJob(task, data);
          break;
        default:
          throw new Error(`Unknown job type: ${job_type}`);
      }
    } catch (error) {
      logger.error('Error processing job', { jobId: job.id, error });
      throw error;
    }
  }

  private async processReminderJob(task: any, data?: Record<string, any>): Promise<void> {
    logger.info('Sending reminder', {
      taskId: task._id,
      title: task.title,
      assignedTo: task.assigned_to,
      dueDate: task.due_date,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.info('Reminder sent successfully', { taskId: task._id });
  }

  private async processReportJob(task: any, data?: Record<string, any>): Promise<void> {
    logger.info('Generating report', {
      taskId: task._id,
      reportType: data?.reportType || 'task-completion',
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    logger.info('Report generated successfully', { taskId: task._id });
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const job = await this.queue.getJob(jobId);
      if (!job) throw new ApiError('Job not found', 404);

      return {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        progress: job.progress,
        returnvalue: job.returnvalue,
        finishedOn: job.finishedOn,
        processedOn: job.processedOn,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
      };
    } catch (error) {
      logger.error('Error getting job status', { jobId, error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get job status', 500);
    }
  }

  async getQueueStats(): Promise<any> {
    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        this.queue.getWaiting(),
        this.queue.getActive(),
        this.queue.getCompleted(),
        this.queue.getFailed(),
        this.queue.getDelayed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      };
    } catch (error) {
      logger.error('Error getting queue stats', error);
      throw new ApiError('Failed to get queue statistics', 500);
    }
  }
}
