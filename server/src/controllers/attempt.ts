import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import type { AuthRequest } from '../middlewares/auth.js';

export const startAttempt = async (req: Request, res: Response): Promise<void> => {
  try {
    const quizId = req.params.id as string;
    const userId = (req as AuthRequest).user!.id;
    
    // Resume if already in progress
    const existing = await prisma.quizAttempt.findFirst({
      where: { quizId, userId, status: 'IN_PROGRESS' },
      include: { quiz: { include: { questions: { select: { id: true, questionNumber: true, questionText: true, options: true } } } } }
    });
    if (existing) {
      res.json(existing);
      return;
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        startTime: new Date(),
        status: 'IN_PROGRESS',
        responses: {} 
      },
      include: { quiz: { include: { questions: { select: { id: true, questionNumber: true, questionText: true, options: true } } } } }
    });

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start attempt' });
  }
};

export const submitAttempt = async (req: Request, res: Response): Promise<void> => {
  try {
    const attemptId = req.params.id as string;
    const { responses } = req.body; 

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: { include: { questions: true } } }
    });

    if (!attempt || attempt.status === 'SUBMITTED') {
      res.status(400).json({ error: 'Invalid or already completed attempt' });
      return;
    }

    let marksCorrect = 0;
    
    attempt.quiz.questions.forEach(q => {
      if (responses[q.id] === q.correctAnswer) {
        marksCorrect += (attempt.quiz.marksCorrect || 1);
      } else if (responses[q.id]) {
        marksCorrect -= (attempt.quiz.marksWrong || 0);
      }
    });

    const endTime = new Date();
    const timeTaken = Math.floor((endTime.getTime() - attempt.startTime.getTime()) / 1000);

    const completed = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        endTime,
        responses,
        totalMarks: marksCorrect,
        status: 'SUBMITTED'
      }
    });

    await prisma.leaderboardEntry.create({
      data: {
        quizId: attempt.quizId,
        userId: attempt.userId,
        marks: marksCorrect,
        timeTaken,
        rank: 0 
      }
    });

    res.json({ message: 'Quiz graded successfully', result: completed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
};
