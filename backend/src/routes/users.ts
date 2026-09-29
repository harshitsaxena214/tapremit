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
    const { handle, phone } = req.query;
    
    let user;
    if (handle && typeof handle === 'string') {
      user = usersRepo.getByHandle(handle.toLowerCase());
    } else if (phone && typeof phone === 'string') {
      user = usersRepo.getByPhone(phone);
    } else {
      return res.status(400).json({ error: 'Must provide handle or phone query parameter' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
