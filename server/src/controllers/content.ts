import type { Request, Response } from 'express';
import { processContent } from '../services/processing.js';
import { prisma } from '../utils/prisma.js';

export const uploadContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = (req as Request & { file?: { path: string; originalname: string; mimetype: string; size: number } }).file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { title } = req.body;

    const content = await prisma.content.create({
      data: {
        title: title || file.originalname,
        originalFile: file.path,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'File uploaded successfully, processing started', content });

    // Trigger async processing
    processContent(content.id, file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload content' });
  }
};

export const getAllContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const contents = await prisma.content.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const content = await prisma.content.findUnique({
      where: { id },
      include: { quizzes: { include: { questions: true } } }
    });
    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }
    
    // Also attach the parsed memory map
    let memoryMap = [];
    if (content.memoryMapPath) {
      const fs = await import('fs');
      if (fs.existsSync(content.memoryMapPath)) {
        memoryMap = JSON.parse(fs.readFileSync(content.memoryMapPath, 'utf-8'));
      }
    }
    
    res.json({ ...content, memoryMap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content details' });
  }
};

export const updateMemoryMap = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { memoryMap } = req.body; 
    
    const content = await prisma.content.findUnique({ where: { id } });
    if (!content || !content.memoryMapPath) {
      res.status(404).json({ error: 'Memory map not found for this content' });
      return;
    }
    
    const fs = await import('fs');
    fs.writeFileSync(content.memoryMapPath, JSON.stringify(memoryMap));
    
    res.json({ message: 'Memory map updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update memory map' });
  }
};
