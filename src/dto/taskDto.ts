import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'], {
    message: 'Status must be pending, in_progress, or completed'
  })
  status?: 'pending' | 'in_progress' | 'completed';

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Assigned to cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  assigned_to?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date' })
  due_date?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'], {
    message: 'Status must be pending, in_progress, or completed'
  })
  status?: 'pending' | 'in_progress' | 'completed';

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Assigned to cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  assigned_to?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date' })
  due_date?: string;
}

export class ScheduleJobDto {
  @IsEnum(['reminder', 'report'], {
    message: 'Job type must be reminder or report'
  })
  job_type!: 'reminder' | 'report';

  @IsOptional()
  @IsDateString({}, { message: 'Scheduled for must be a valid date' })
  scheduled_for?: string;

  @IsOptional()
  delay?: number;

  @IsOptional()
  data?: Record<string, any>;
}