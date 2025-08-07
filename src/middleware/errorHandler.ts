import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error caught by error handler:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values((error as any).errors).map((err: any) => err.message);
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors,
    });
    return;
  }

  // Error de cast de MongoDB (ID inválido)
  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Invalid resource ID format',
    });
    return;
  }

  // Error de duplicado de MongoDB
  if ((error as any).code === 11000) {
    res.status(400).json({
      success: false,
      error: 'Duplicate Field',
      message: 'Resource already exists',
    });
    return;
  }

  // ApiError personalizado
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  // Error de JSON malformado
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON',
    });
    return;
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && {
      details: {
        message: error.message,
        stack: error.stack,
      },
    }),
  });
};