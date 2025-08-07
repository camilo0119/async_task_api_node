import { Task, ITask } from '../models/Task';
import { CreateTaskDto, UpdateTaskDto } from '../dto/taskDto';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export class TaskService {
  async createTask(taskData: CreateTaskDto): Promise<ITask> {
    try {
      logger.info('Creating new task', { title: taskData.title });
      
      // Validar fecha de vencimiento si se proporciona
      if (taskData.due_date) {
        const dueDate = new Date(taskData.due_date);
        if (dueDate <= new Date()) {
          throw new ApiError('Due date must be in the future', 400);
        }
      }

      const task = new Task({
        ...taskData,
        due_date: taskData.due_date ? new Date(taskData.due_date) : undefined
      });

      const savedTask = await task.save();
      logger.info('Task created successfully', { taskId: savedTask._id });
      
      return savedTask;
    } catch (error) {
      logger.error('Error creating task', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create task', 500);
    }
  }

  async getAllTasks(page = 1, limit = 10, sortBy = 'created_at', sortOrder: 'asc' | 'desc' = 'desc'): Promise<{
    tasks: ITask[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [tasks, total] = await Promise.all([
        Task.find().sort(sort).skip(skip).limit(limit).lean(),
        Task.countDocuments()
      ]);

      return {
        tasks: tasks as ITask[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching tasks', error);
      throw new ApiError('Failed to fetch tasks', 500);
    }
  }

  async getTaskById(id: string): Promise<ITask> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid task ID format', 400);
      }

      const task = await Task.findById(id);
      if (!task) {
        throw new ApiError('Task not found', 404);
      }

      return task;
    } catch (error) {
      logger.error('Error fetching task by ID', { id, error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch task', 500);
    }
  }

  async updateTask(id: string, updateData: UpdateTaskDto): Promise<ITask> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid task ID format', 400);
      }

      // Validar fecha de vencimiento si se proporciona
      if (updateData.due_date) {
        const dueDate = new Date(updateData.due_date);
        if (dueDate <= new Date()) {
          throw new ApiError('Due date must be in the future', 400);
        }
      }

      const updatePayload = {
        ...updateData,
        due_date: updateData.due_date ? new Date(updateData.due_date) : undefined,
        updated_at: new Date()
      };

      const task = await Task.findByIdAndUpdate(
        id,
        updatePayload,
        { new: true, runValidators: true }
      );

      if (!task) {
        throw new ApiError('Task not found', 404);
      }

      logger.info('Task updated successfully', { taskId: id });
      return task;
    } catch (error) {
      logger.error('Error updating task', { id, error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update task', 500);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError('Invalid task ID format', 400);
      }

      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        throw new ApiError('Task not found', 404);
      }

      logger.info('Task deleted successfully', { taskId: id });
    } catch (error) {
      logger.error('Error deleting task', { id, error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to delete task', 500);
    }
  }

  async getTasksByStatus(status: string, page = 1, limit = 10): Promise<{
    tasks: ITask[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const validStatuses = ['pending', 'in_progress', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new ApiError('Invalid status. Must be pending, in_progress, or completed', 400);
      }

      const skip = (page - 1) * limit;
      
      const [tasks, total] = await Promise.all([
        Task.find({ status }).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
        Task.countDocuments({ status })
      ]);

      return {
        tasks: tasks as ITask[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching tasks by status', { status, error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch tasks by status', 500);
    }
  }
}