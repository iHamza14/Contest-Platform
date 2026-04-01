import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../db/prismaClient';

export const createContest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hostId = req.user?.userId;
    const { title, description, start_time, end_time, problems } = req.body;

    if (!title || !start_time || !end_time) {
      res.status(400).json({ message: 'Title, start time, and end time are required' });
      return;
    }

    const contest = await prisma.contest.create({
      data: {
        title,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        host_id: hostId as number,
        problems: {
          create: problems.map((p: any) => ({
            title: p.title,
            statement: p.statement,
            time_limit: p.time_limit || 2.0,
            memory_limit: p.memory_limit || 256,
            test_cases: {
               create: p.test_cases.map((t: any) => ({
                  input_url: t.input_url || 'local/path/placeholder_in.txt',
                  output_url: t.output_url || 'local/path/placeholder_out.txt',
                  is_hidden: t.is_hidden !== undefined ? t.is_hidden : true
               }))
            }
          }))
        }
      },
      include: { problems: true }
    });

    res.status(201).json({ message: 'Contest created', contest });
  } catch (error) {
    console.error('Create contest error:', error);
    res.status(500).json({ message: 'Internal server error creating contest' });
  }
};

export const getContests = async (req: AuthRequest, res: Response): Promise<void> => {
   try {
     const contests = await prisma.contest.findMany({
        orderBy: { created_at: 'desc' },
        include: { host: { select: { username: true } }, _count: { select: { problems: true } } }
     });
     res.status(200).json(contests);
   } catch (error) {
     res.status(500).json({ message: 'Internal server error fetching contests' });
   }
};

export const getContestDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
     const { id } = req.params;
     const contest = await prisma.contest.findUnique({
        where: { id: Number(id) },
        include: { 
           problems: { select: { id: true, title: true, time_limit: true, memory_limit: true, statement: true } },
           host: { select: { username: true } }
        }
     });

     if (!contest) {
        res.status(404).json({ message: 'Contest not found' });
        return;
     }
     res.status(200).json(contest);
  } catch (error) {
     res.status(500).json({ message: 'Internal server error fetching contest detail' });
  }
};
