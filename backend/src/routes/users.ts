import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { usersRepo } from '../db/users.repository';

const router = Router();

const createUserSchema = z.object({
  handle: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).toLowerCase(),
  display_name: z.string().min(1),
  phone: z.string().optional(),
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = usersRepo.create(data);
    
    res.status(201).json({
      id: user.id,
      handle: user.handle,
      display_name: user.display_name,
      created_at: user.created_at,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/lookup', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { handle } = req.query;
    
    if (!handle || typeof handle !== 'string') {
      throw { status: 400, message: 'Must provide handle query parameter' };
    }

    const user = usersRepo.getByHandle(handle.toLowerCase());

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    res.json({
      handle: user.handle,
      display_name: user.display_name,
    });
  } catch (error) {
    next(error);
  }
});

const lookupBodySchema = z.object({
  handle: z.string().optional(),
  phone: z.string().optional(),
}).refine(data => data.handle || data.phone, { message: 'Must provide handle or phone' });

router.post('/lookup', (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = lookupBodySchema.parse(req.body);
    let user;
    
    if (data.handle) {
      user = usersRepo.getByHandle(data.handle.toLowerCase());
    } else if (data.phone) {
      user = usersRepo.getByPhone(data.phone);
    }
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    res.json({
      handle: user.handle,
      display_name: user.display_name,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
