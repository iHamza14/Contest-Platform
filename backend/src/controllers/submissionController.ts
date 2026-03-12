import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { judgeCode } from '../utils/judge';
import { io } from '../server'; // We'll need to pass io instance

const prisma = new PrismaClient();

export const createSubmission = async (req: AuthRequest, res: Response) => {
  const { problemId, code, language } = req.body;
  const userId = req.user.id;

  try {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { contest: true }
    });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const testCases = JSON.parse(problem.testCases);
    const verdict = judgeCode(code, language, testCases);

    const submission = await prisma.submission.create({
      data: {
        code,
        language,
        verdict,
        userId,
        problemId,
        contestId: problem.contestId
      },
      include: { user: true }
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`contest-${problem.contestId}`).emit('newSubmission', {
      id: submission.id,
      username: submission.user.name,
      verdict: submission.verdict,
      problemTitle: problem.title,
      submittedAt: submission.submittedAt
    });

    // Update leaderboard and emit
    // (We'll handle leaderboard updates separately via socket or periodic refresh)
    // For simplicity, we emit an event that frontend can use to refresh leaderboard
    io.to(`contest-${problem.contestId}`).emit('leaderboardUpdate', await getLeaderboardData(problem.contestId));

    res.json(submission);
  } catch (err) {
    res.status(400).json({ message: 'Submission failed' });
  }
};

export const getUserSubmissions = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: { problem: true },
    orderBy: { submittedAt: 'desc' }
  });
  res.json(submissions.map(s => ({
    id: s.id,
    problemTitle: s.problem.title,
    language: s.language,
    verdict: s.verdict,
    submittedAt: s.submittedAt
  })));
};

// Helper to get leaderboard data
async function getLeaderboardData(contestId: number) {
  const submissions = await prisma.submission.findMany({
    where: { contestId, verdict: 'Accepted' },
    include: { user: true },
    orderBy: { submittedAt: 'asc' }
  });

  const userStats: { [key: number]: { username: string; solved: Set<number>; penalty: number } } = {};
  for (const sub of submissions) {
    if (!userStats[sub.userId]) {
      userStats[sub.userId] = { username: sub.user.name, solved: new Set(), penalty: 0 };
    }
    if (!userStats[sub.userId].solved.has(sub.problemId)) {
      userStats[sub.userId].solved.add(sub.problemId);
      userStats[sub.userId].penalty += 1;
    }
  }

  return Object.entries(userStats)
    .map(([userId, stats]) => ({
      userId: parseInt(userId),
      username: stats.username,
      solved: stats.solved.size,
      penalty: stats.penalty
    }))
    .sort((a, b) => b.solved - a.solved || a.penalty - b.penalty)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}