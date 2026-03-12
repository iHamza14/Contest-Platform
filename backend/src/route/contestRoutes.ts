import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { getAllContests, getContest, createContest, getLeaderboard } from '../controllers/contestController';

const router = Router();

router.get('/', getAllContests);
router.get('/:id', getContest);
router.post('/', authenticate, authorizeAdmin, createContest);
router.get('/:contestId/leaderboard', getLeaderboard);

export default router;