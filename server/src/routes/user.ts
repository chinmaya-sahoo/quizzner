import { Router } from 'express';
import { getUsers, toggleBlockUser } from '../controllers/user.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN']), getUsers);
router.put('/:id/block', authenticate, requireRole(['ADMIN']), toggleBlockUser);

export default router;
