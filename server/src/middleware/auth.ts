import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createError } from './errorHandler'

interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError('Access token is required', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', 401))
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Token expired', 401))
    } else {
      next(error)
    }
  }
}

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    next(createError('Admin access required', 403))
    return
  }
  next()
}

export { AuthRequest }
