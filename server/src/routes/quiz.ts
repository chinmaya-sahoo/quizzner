import { Router } from 'express';
import { updateQuestion, deleteQuestion, publishQuiz, getAvailableQuizzes } from '../controllers/quiz.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/quizzes/available', authenticate, getAvailableQuizzes);
router.post('/quizzes/:id/publish', authenticate, requireRole(['ADMIN']), publishQuiz);
router.put('/questions/:id', authenticate, requireRole(['ADMIN']), updateQuestion);
router.delete('/questions/:id', authenticate, requireRole(['ADMIN']), deleteQuestion);

export default router;
