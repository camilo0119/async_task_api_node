import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { QueueService } from '../services/queueService';
import { CreateTaskDto, UpdateTaskDto, ScheduleJobDto } from '../dto/taskDto';
import { validateDto } from '../utils/validation';
import { logger } from '../utils/logger';

export class TaskController {
  private taskService: TaskService;
  private queueService: QueueService;

  constructor() {
    this.taskService = new TaskService();
    this.queueService = new QueueService();
  }

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskData = await validateDto(CreateTaskDto, req.body);
      const task = await this.taskService.createTask(taskData);
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error in createTask controller', error);
      throw error;
    }
  };

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'created_at';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      if (page < 1) throw new Error('Page must be greater than 0');
      if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');

      const result = await this.taskService.getAllTasks(page, limit, sortBy, sortOrder);
      
      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result.tasks,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getAllTasks controller', error);
      throw error;
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id as string);
      
      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error in getTaskById controller', { id: req.params.id, error });
      throw error;
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = await validateDto(UpdateTaskDto, req.body);
      const task = await this.taskService.updateTask(id as string, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error in updateTask controller', { id: req.params.id, error });
      throw error;
    }
  };

  patchTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = await validateDto(UpdateTaskDto, req.body);
      const task = await this.taskService.updateTask(id as string, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error in patchTask controller', { id: req.params.id, error });
      throw error;
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id as string);
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteTask controller', { id: req.params.id, error });
      throw error;
    }
  };

  getTasksByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Validar límites
      if (page < 1) throw new Error('Page must be greater than 0');
      if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');

      const result = await this.taskService.getTasksByStatus(status as string, page, limit);
      
      res.status(200).json({
        success: true,
        message: `Tasks with status '${status}' retrieved successfully`,
        data: result.tasks,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getTasksByStatus controller', { status: req.params.status, error });
      throw error;
    }
  };

  scheduleJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const jobData = await validateDto(ScheduleJobDto, req.body);

      const options: any = {};
      if (jobData.scheduled_for) {
        options.scheduled_for = new Date(jobData.scheduled_for);
      }
      if (jobData.delay) {
        options.delay = jobData.delay;
      }

      const job = await this.queueService.scheduleJob(
        id as string,
        jobData.job_type,
        options,
        jobData.data || {}
      );
      
      res.status(201).json({
        success: true,
        message: 'Job scheduled successfully',
        data: {
          jobId: job.id,
          taskId: id,
          jobType: jobData.job_type,
          scheduledFor: jobData.scheduled_for,
          delay: jobData.delay
        }
      });
    } catch (error) {
      logger.error('Error in scheduleJob controller', { id: req.params.id, error });
      throw error;
    }
  };

  getJobStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const jobStatus = await this.queueService.getJobStatus(jobId as string);
      
      res.status(200).json({
        success: true,
        message: 'Job status retrieved successfully',
        data: jobStatus
      });
    } catch (error) {
      logger.error('Error in getJobStatus controller', { jobId: req.params.jobId, error });
      throw error;
    }
  };

  getQueueStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.queueService.getQueueStats();
      
      res.status(200).json({
        success: true,
        message: 'Queue statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      logger.error('Error in getQueueStats controller', error);
      throw error;
    }
  };
}