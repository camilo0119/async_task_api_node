# Task Management Microservice

Un microservicio escalable para gestión de tareas desarrollado con Node.js, TypeScript, MongoDB y sistema de colas asíncronas.

## 🚀 Características

- **API RESTful completa** para gestión de tareas
- **Sistema de colas asíncronas** con BullMQ para trabajos programados
- **Base de datos MongoDB** con Mongoose
- **Validación robusta** con class-validator
- **Documentación API** con Swagger/OpenAPI
- **Dockerización completa** con Docker Compose
- **Logging avanzado** con Winston
- **Manejo de errores centralizado**
- **Arquitectura modular y escalable**

## 📋 Funcionalidades

### Endpoints de Tareas
- `POST /api/v1/tasks` - Crear nueva tarea
- `GET /api/v1/tasks` - Obtener todas las tareas (con paginación)
- `GET /api/v1/tasks/{id}` - Obtener tarea por ID
- `PUT /api/v1/tasks/{id}` - Actualizar tarea completamente
- `PATCH /api/v1/tasks/{id}` - Actualizar tarea parcialmente
- `DELETE /api/v1/tasks/{id}` - Eliminar tarea
- `GET /api/v1/tasks/status/{status}` - Obtener tareas por estado

### Endpoints de Trabajos Asíncronos
- `POST /api/v1/tasks/{id}/schedule` - Programar trabajo asíncrono
- `GET /api/v1/jobs/{jobId}/status` - Obtener estado de trabajo
- `GET /api/v1/queue/stats` - Estadísticas de la cola

### Endpoints del Sistema
- `GET /health` - Health check
- `GET /api-docs` - Documentación de la API

## 🛠️ Tecnologías

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Cola de Trabajos**: BullMQ con Redis
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston
- **Contenedores**: Docker + Docker Compose

## 📦 Instalación

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd task-management-microservice
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

3. **Construir y ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Verificar instalación**
   ```bash
   curl http://localhost:3000/health
   ```

### Opción 2: Instalación Local

1. **Requisitos previos**
   - Node.js 18+
   - MongoDB 7+
   - Redis 7+

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Compilar TypeScript**
   ```bash
   npm run build
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Ejecutar en producción**
   ```bash
   npm start
   ```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de MongoDB | `mongodb://localhost:27017/task-management` |
| `REDIS_HOST` | Host de Redis | `localhost` |
| `REDIS_PORT` | Puerto de Redis | `6379` |
| `REDIS_PASSWORD` | Contraseña de Redis | `` |
| `QUEUE_NAME` | Nombre de la cola | `task-queue` |
| `LOG_LEVEL` | Nivel de logging | `info` |

### Estructura de Proyecto

```
src/
├── config/           # Configuraciones
├── controllers/      # Controladores de API
├── dto/              # Data Transfer Objects
├── middleware/       # Middlewares personalizados
├── models/           # Modelos de MongoDB
├── routes/           # Definición de rutas
├── services/         # Lógica de negocio
└── utils/           # Utilidades
```

## 📖 Uso de la API

### Crear Tarea

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar API",
    "description": "Desarrollar endpoints RESTful",
    "status": "pending",
    "assigned_to": "developer@example.com",
    "due_date": "2024-12-31T23:59:59Z"
  }'
```

### Obtener Tareas

```bash
# Todas las tareas con paginación
curl http://localhost:3000/api/v1/tasks?page=1&limit=10

# Tareas por estado
curl http://localhost:3000/api/v1/tasks/status/pending
```

### Programar Trabajo Asíncrono

```bash
curl -X POST http://localhost:3000/api/v1/tasks/{taskId}/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "job_type": "reminder",
    "scheduled_for": "2024-01-15T10:00:00Z",
    "data": {
      "message": "Recordatorio de tarea pendiente"
    }
  }'
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📊 Monitoreo

### Health Check
```bash
curl http://localhost:3000/health
```

### Estadísticas de Cola
```bash
curl http://localhost:3000/api/v1/queue/stats
```

### Logs
Los logs se almacenan en:
- Consola (desarrollo)
- `logs/combined.log` (producción)
- `logs/error.log` (errores)

## 🐳 Docker

### Construcción de Imagen
```bash
docker build -t task-management .
```

### Ejecución con Docker Compose
```bash
# Desarrollo
docker-compose up

# Producción
docker-compose -f docker-compose.prod.yml up
```

### Servicios Incluidos
- **app**: Aplicación Node.js
- **mongo**: Base de datos MongoDB
- **redis**: Cache y cola de trabajos

## 📚 Documentación API

Una vez ejecutando la aplicación, la documentación completa está disponible en:
- **Swagger UI**: http://localhost:3000/api-docs

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: Límite de peticiones por IP
- **Validación de entrada**: Sanitización de datos
- **Error Handling**: Manejo seguro de errores

## 🚀 Despliegue

### Producción con Docker

1. **Configurar variables de producción**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=mongodb://your-prod-mongo/task-management
   ```

2. **Ejecutar en producción**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Escalabilidad

- **Horizontal**: Múltiples instancias con load balancer
- **Vertical**: Incrementar recursos de contenedor
- **Cola**: Workers distribuidos para trabajos pesados

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo de Desarrollo

**CBW Development Team**
- Email: dev@cbw.com
- Repositorio: [GitHub](https://github.com/cbw/task-management)

---

Para más información, consulte la [documentación completa de la API](http://localhost:3000/api-docs).