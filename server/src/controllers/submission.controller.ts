import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { executeCode } from '../services/sandbox.service';
import prisma from '../db/prismaClient';

export const submitCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
       res.status(400).json({ message: 'Missing required fields' });
       return;
    }

    // Skeleton placeholder: In a real app, fetch problem test cases and run executeCode for each
    const dummyInput = "2 3\n"; 
    
    // Quick skeleton test run
    const result = await executeCode(language as 'cpp' | 'python', code, dummyInput);
    
    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        user_id: userId as number,
        problem_id: Number(problemId),
        code,
        language,
        status: result.status,
        execution_t: result.executionTimeMs ? result.executionTimeMs / 1000 : null,
      }
    });

    res.status(201).json({ 
      message: 'Submission evaluated', 
      submission, 
      result: {
        output: result.output,
        error: result.error,
        status: result.status
      }
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Internal server error evaluating submission' });
  }
};
