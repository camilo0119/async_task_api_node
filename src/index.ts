import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { taskRoutes } from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { swaggerSpec } from './config/swagger';
import { logger } from './utils/logger';
import { config } from './config/config';

const app = express();

// Middleware de seguridad y optimización
app.use(helmet());
app.use(compression());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana de tiempo
});
app.use(limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use(requestLogger);

// Documentación de API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// Rutas de la API
app.use('/api/v1', taskRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Función para inicializar la aplicación
async function startServer(): Promise<void> {
  try {
    // Conectar a MongoDB
    await connectDatabase();
    
    // Conectar a Redis
    await connectRedis();
    
    // Iniciar servidor
    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`API Documentation: http://localhost:${config.PORT}/api-docs`);
    });

    // Manejo de cierre graceful
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;