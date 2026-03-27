import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const toggleBlockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    // Prevent admin from blocking themselves
    const currentAdminId = (req as AuthRequest).user?.id;
    if (id === currentAdminId) {
      res.status(400).json({ error: 'You cannot block yourself' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isBlocked: !user.isBlocked },
      select: { id: true, name: true, isBlocked: true }
    });

    res.json({ message: updated.isBlocked ? 'User blocked' : 'User unblocked', user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle block status' });
  }
};
