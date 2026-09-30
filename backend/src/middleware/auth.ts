import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usersRepo } from '../db/users.repository';
import { logger } from '../utils/logger';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn({ path: req.path }, 'Unauthorized: Missing token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as { sub: string, iat: number, exp: number };
    if (!decoded.exp) {
      throw { status: 401, message: 'Token missing expiration' };
    }
    const user = usersRepo.getById(decoded.sub);
    if (!user) {
      throw { status: 401, message: 'User no longer exists' };
    }
    (req as any).user = user;
    next();
  } catch (error: any) {
    if (error.status === 401) {
      logger.warn({ path: req.path, errMessage: error.message }, 'Unauthorized');
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    logger.warn({ path: req.path, errMessage: error.message }, 'Unauthorized: Invalid token');
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
