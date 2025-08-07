// Inicialización de MongoDB
db = db.getSiblingDB('task-management');

// Crear colecciones con validaciones
db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'status'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Title is required and must be between 1 and 200 characters'
        },
        description: {
          bsonType: 'string',
          maxLength: 1000,
          description: 'Description must not exceed 1000 characters'
        },
        status: {
          enum: ['pending', 'in_progress', 'completed'],
          description: 'Status must be pending, in_progress, or completed'
        },
        assigned_to: {
          bsonType: 'string',
          maxLength: 100,
          description: 'Assigned to must not exceed 100 characters'
        },
        due_date: {
          bsonType: 'date',
          description: 'Due date must be a valid date'
        }
      }
    }
  }
});

// Crear índices para optimizar rendimiento
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ assigned_to: 1 });
db.tasks.createIndex({ due_date: 1 });
db.tasks.createIndex({ created_at: -1 });

print('Database initialization completed');