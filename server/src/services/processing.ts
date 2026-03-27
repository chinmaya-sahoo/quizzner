import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse') as typeof import('pdf-parse');
import Tesseract from 'tesseract.js';
import { PDFDocument, rgb } from 'pdf-lib';
import { prisma } from '../utils/prisma.js';

export const processContent = async (contentId: string, filePath: string) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = '';

    console.log(`Starting processing for content ID: ${contentId}`);

    // 4.2 and 4.3: Text Extraction and OCR
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
      
      if (extractedText.trim().length < 50) {
        extractedText = "[Scanned PDF detected. Native text extraction yielded minimal results. Advanced image conversion via poppler needed for full OCR.]";
      }
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const worker = await Tesseract.createWorker('eng');
      const ret = await worker.recognize(filePath);
      extractedText = ret.data.text;
      await worker.terminate();
    } else {
      throw new Error('Unsupported file format');
    }

    // 4.4: Typed Notes Generation
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    
    // Simplistic wrapping for demo
    page.drawText(extractedText.substring(0, 3000), {
      x: 50,
      y: height - 50,
      size: 10,
      color: rgb(0, 0, 0),
    });
    
    const processedDir = 'processed/';
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }
    
    const typedNotesPath = `${processedDir}typed-${contentId}.pdf`;
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(typedNotesPath, pdfBytes);

    // Basic heuristic for Memory Map (extract first sentence of paragraphs)
    const sentences = extractedText.split(/[.?!]/).map(s => s.trim()).filter(s => s.length > 20);
    const keyPoints = sentences.slice(0, 5).map(s => s + '.');
    const memoryMapPath = `${processedDir}map-${contentId}.json`;
    fs.writeFileSync(memoryMapPath, JSON.stringify(keyPoints));

    // Save outputs to database
    await prisma.content.update({
      where: { id: contentId },
      data: {
        typedText: extractedText,
        typedNotesPath: typedNotesPath,
        memoryMapPath: memoryMapPath,
        status: 'PROCESSED'
      }
    });

    // 4.7 Generate Draft Quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz for Document ${contentId.substring(0,6)}`,
        contentId: contentId,
        duration: 10,
        status: 'DRAFT',
      }
    });

    if (sentences.length > 2) {
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          questionNumber: 1,
          questionText: `What is the main idea related to: "${(sentences[0] ?? '').substring(0,30)}..."?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A'
        }
      });
    }

    console.log(`Processing and Quiz generation complete for content ID: ${contentId}`);

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Processing error for ${contentId}:`, errMsg);
    await prisma.content.update({
      where: { id: contentId },
      data: { status: 'ERROR' }
    });
  }
};
