import { Router, Request, Response, NextFunction } from 'express';
import { chainService } from '../services/chain.service';

const router = Router();

router.get('/status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await chainService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

export default router;
