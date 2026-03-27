import { Router } from 'express';
import { startAttempt, submitAttempt } from '../controllers/attempt.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// /api/attempts/:id/start (where id is quiz id)
router.post('/:id/start', authenticate, startAttempt);
// /api/attempts/:id/submit (where id is attempt id)
router.post('/:id/submit', authenticate, submitAttempt);

export default router;
