import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = user as { userId: number; username: string };
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
