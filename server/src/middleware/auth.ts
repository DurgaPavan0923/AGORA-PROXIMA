import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    uniqueId: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header or cookie
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies['auth-token'] || req.cookies.token;
    }

    if (!token) {
      res.status(401).json({ error: 'Unauthorized - No token provided' });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
      return;
    }

    // Verify user exists
    const user = await User.findOne({ uniqueId: payload.uniqueId });
    if (!user || !user.isVerified) {
      res.status(401).json({ error: 'Unauthorized - User not found or not verified' });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      return;
    }

    next();
  };
};
