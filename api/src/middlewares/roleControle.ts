import { Response, NextFunction } from 'express';
import { AuthRequest } from './verifyToken';

export const roleControl = (roles: Array<'ADMIN' | 'USER'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
