import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createSubmission, getUserSubmissions } from '../controllers/submissionController';

const router = Router();

router.post('/', authenticate, createSubmission);
router.get('/', authenticate, getUserSubmissions);

export default router;