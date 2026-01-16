import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()
  
  // Log request
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? 'error' : 'info'
    
    logger.log(logLevel, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    })
  })

  next()
}
