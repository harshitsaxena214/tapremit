import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof ZodError) {
    status = 400;
    message = 'Validation Error';
  }

  if (status >= 400 && status < 500) {
    logger.warn({ status, path: req.path, errMessage: message }, 'Client error');
    return res.status(status).json({ 
      error: message, 
      details: err instanceof ZodError ? err.errors : undefined 
    });
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
