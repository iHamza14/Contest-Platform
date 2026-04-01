import { Router } from 'express';
import { submitCode } from '../controllers/submission.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, submitCode);

export default router;
