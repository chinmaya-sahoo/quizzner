import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const getUserDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id as string;
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: { quiz: { select: { title: true, duration: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    const totalTaken = await prisma.quizAttempt.count({ where: { userId, status: 'SUBMITTED' } });
    
    res.json({ attempts, stats: { totalTaken } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user dashboard' });
  }
};

export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const totalContent = await prisma.content.count();
    const totalQuizzes = await prisma.quiz.count();
    const totalAttempts = await prisma.quizAttempt.count();
    
    const recentUsers = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.json({
      stats: { totalUsers, totalContent, totalQuizzes, totalAttempts },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
};
