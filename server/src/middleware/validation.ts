import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { createError } from './errorHandler'

// Component validation
export const validateComponent = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  
  body('category')
    .isIn(['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'cooling', 'case'])
    .withMessage('Invalid component category'),
  
  body('brand')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Brand must be between 1 and 100 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg)
      return next(createError(errorMessages.join(', '), 400))
    }
    next()
  }
]

// Build validation
export const validateBuild = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('components')
    .isObject()
    .withMessage('Components must be an object'),
  
  body('components.cpu')
    .optional()
    .isInt({ min: 1 })
    .withMessage('CPU ID must be a positive integer'),
  
  body('components.gpu')
    .optional()
    .isInt({ min: 1 })
    .withMessage('GPU ID must be a positive integer'),
  
  body('components.ram')
    .optional()
    .isInt({ min: 1 })
    .withMessage('RAM ID must be a positive integer'),
  
  body('components.storage')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Storage ID must be a positive integer'),
  
  body('components.motherboard')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Motherboard ID must be a positive integer'),
  
  body('components.psu')
    .optional()
    .isInt({ min: 1 })
    .withMessage('PSU ID must be a positive integer'),
  
  body('components.cooling')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cooling ID must be a positive integer'),
  
  body('components.case')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Case ID must be a positive integer'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg)
      return next(createError(errorMessages.join(', '), 400))
    }
    next()
  }
]

// ID parameter validation
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg)
      return next(createError(errorMessages.join(', '), 400))
    }
    next()
  }
]

// Query validation for components
export const validateComponentQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .isIn(['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'cooling', 'case'])
    .withMessage('Invalid component category'),
  
  query('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Brand must be between 1 and 100 characters'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'price-low', 'price-high', 'rating', 'newest'])
    .withMessage('Invalid sort option'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg)
      return next(createError(errorMessages.join(', '), 400))
    }
    next()
  }
]

// User registration validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg)
      return next(createError(errorMessages.join(', '), 400))
    }
    next()
  }
]

// User login validation
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg)
      return next(createError(errorMessages.join(', '), 400))
    }
    next()
  }
]
