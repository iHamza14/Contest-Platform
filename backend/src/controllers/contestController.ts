import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all contests (public)
export const getAllContests = async (req: AuthRequest, res: Response) => {
  const contests = await prisma.contest.findMany({
    orderBy: { startTime: 'desc' }
  });
  res.json(contests);
};

// Get single contest with problems
export const getContest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }; // Type assertion to ensure id is a string
  const contest = await prisma.contest.findUnique({
    where: { id: parseInt(id) },
    include: { problems: true }
  });
  if (!contest) return res.status(404).json({ message: 'Contest not found' });
  res.json(contest);
};

// Create contest (admin only)
export const createContest = async (req: AuthRequest, res: Response) => {
  const { title, description, startTime, endTime, problems } = req.body;
  try {
    const contest = await prisma.contest.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        problems: {
          create: problems.map((p: any) => ({
            title: p.title,
            description: p.description,
            testCases: p.testCases
          }))
        }
      },
      include: { problems: true }
    });
    res.status(201).json(contest);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// Get leaderboard for a contest
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  const { contestId } = req.params as { contestId: string }; // Type assertion to ensure contestId is a string
  const submissions = await prisma.submission.findMany({
      where: { contestId: parseInt(contestId) },
      include: { user: true },
      orderBy: { submittedAt: 'asc' }
  });

  // Simple leaderboard: count accepted submissions per user, with earliest submission time as tie-breaker
  const userStats: { [key: number]: { username: string; solved: Set<number>; penalty: number } } = {};
  for (const sub of submissions) {
    if (sub.verdict !== 'Accepted') continue;
    if (!userStats[sub.userId]) {
      userStats[sub.userId] = { username: sub.user.name, solved: new Set(), penalty: 0 };
    }
    if (!userStats[sub.userId].solved.has(sub.problemId)) {
      userStats[sub.userId].solved.add(sub.problemId);
      // Simple penalty: just count submissions (not based on time for simplicity)
      userStats[sub.userId].penalty += 1;
    }
  }

  const leaderboard = Object.entries(userStats)
    .map(([userId, stats]) => ({
      userId: parseInt(userId),
      username: stats.username,
      solved: stats.solved.size,
      penalty: stats.penalty
    }))
    .sort((a, b) => b.solved - a.solved || a.penalty - b.penalty)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  res.json(leaderboard);
};