import { Router } from 'express';
import { getUserDashboard, getAdminDashboard } from '../controllers/dashboard.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/user', authenticate, getUserDashboard);
router.get('/admin', authenticate, requireRole(['ADMIN']), getAdminDashboard);

export default router;
