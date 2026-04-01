import { Router } from 'express';
import { createContest, getContests, getContestDetail } from '../controllers/contest.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getContests);
router.get('/:id', getContestDetail);
router.post('/', authenticateJWT, createContest);

export default router;
