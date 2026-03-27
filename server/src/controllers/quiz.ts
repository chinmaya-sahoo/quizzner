import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { questionText, options, correctAnswer, shuffleOptions } = req.body;
    
    const question = await prisma.question.update({
      where: { id },
      data: { questionText, options, correctAnswer, shuffleOptions }
    });
    res.json({ message: 'Question updated', question });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.question.delete({ where: { id } });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

export const publishQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const quiz = await prisma.quiz.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });
    res.json({ message: 'Quiz published', quiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish quiz' });
  }
};

export const getAvailableQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { status: 'PUBLISHED' },
      include: { content: { select: { title: true } }, _count: { select: { questions: true } } }
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available quizzes' });
  }
};
