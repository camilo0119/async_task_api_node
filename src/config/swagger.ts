import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API para gestión de tareas con funcionalidades asíncronas',
      contact: {
        name: 'CBW Development Team',
        email: 'dev@cbw.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la tarea'
            },
            title: {
              type: 'string',
              description: 'Título de la tarea'
            },
            description: {
              type: 'string',
              description: 'Descripción de la tarea'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              default: 'pending',
              description: 'Estado de la tarea'
            },
            assigned_to: {
              type: 'string',
              description: 'Usuario asignado a la tarea'
            },
            due_date: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de vencimiento'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        CreateTask: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Título de la tarea'
            },
            description: {
              type: 'string',
              description: 'Descripción de la tarea'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              default: 'pending'
            },
            assigned_to: {
              type: 'string',
              description: 'Usuario asignado'
            },
            due_date: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de vencimiento'
            }
          }
        },
        UpdateTask: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed']
            },
            assigned_to: {
              type: 'string'
            },
            due_date: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ScheduleJob: {
          type: 'object',
          required: ['job_type'],
          properties: {
            job_type: {
              type: 'string',
              enum: ['reminder', 'report'],
              description: 'Tipo de trabajo a programar'
            },
            scheduled_for: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora para ejecutar el trabajo'
            },
            delay: {
              type: 'number',
              description: 'Retraso en milisegundos'
            },
            data: {
              type: 'object',
              description: 'Datos adicionales para el trabajo'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            details: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);