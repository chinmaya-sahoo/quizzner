import { Router } from 'express';
import multer from 'multer';
import { uploadContent, getAllContent, getContentById, updateMemoryMap } from '../controllers/content.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import fs from 'fs';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config - use unknown to avoid Express.Multer.File namespace issue if @types/multer not yet loaded
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });
const router = Router();

router.post('/upload', authenticate, requireRole(['ADMIN']), upload.single('file'), uploadContent);
router.get('/', authenticate, requireRole(['ADMIN']), getAllContent);
router.get('/:id', authenticate, requireRole(['ADMIN']), getContentById);
router.put('/:id/memory-map', authenticate, requireRole(['ADMIN']), updateMemoryMap);

export default router;
