import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed'],
        message: 'Status must be pending, in_progress, or completed'
      },
      default: 'pending'
    },
    assigned_to: {
      type: String,
      trim: true,
      maxlength: [100, 'Assigned to cannot exceed 100 characters']
    },
    due_date: {
      type: Date,
      validate: {
        validator: function(this: ITask, value: Date) {
          return !value || value > new Date();
        },
        message: 'Due date must be in the future'
      }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
);

// Índices para mejorar rendimiento
taskSchema.index({ status: 1 });
taskSchema.index({ assigned_to: 1 });
taskSchema.index({ due_date: 1 });
taskSchema.index({ created_at: -1 });

// Middleware para validar actualizaciones
taskSchema.pre('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

export const Task = mongoose.model<ITask>('Task', taskSchema);