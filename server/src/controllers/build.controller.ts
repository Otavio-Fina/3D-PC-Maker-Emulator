// This controller manages PC builds.
// Can create, read, update and delete builds
// Can clone existing builds (unlikely to be used)
// Can like and unlike builds (maybe?)
// Can check compatibility
// Can calcualte pricing

// | Method | HTTP | Endpoint | Description |
// |--------|------|----------|-------------|
// | `getAll` | GET | `/api/builds` | List all builds with filters |
// | `getByUser` | GET | `/api/builds/user/:userId` | Get builds by user |
// | `getFeatured` | GET | `/api/builds/featured` | Get featured builds |
// | `getById` | GET | `/api/builds/:id` | Get specific build |
// | `create` | POST | `/api/builds` | Create new build |
// | `update` | PUT | `/api/builds/:id` | Update build (owner only) |
// | `delete` | DELETE | `/api/builds/:id` | Delete build (owner only) |
// | `clone` | POST | `/api/builds/:id/clone` | Clone an existing build |
// | `toggleLike` | POST | `/api/builds/:id/like` | Like/unlike a build |
// | `checkCompatibility` | GET | `/api/builds/:id/compatibility` | Check build compatibility |
// | `calculatePrice` | GET | `/api/builds/:id/price` | Get build total price |

import { Request, Response, NextFunction } from 'express'
import { BuildService } from '../services/build.service'
import { createError, asyncHandler, AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

interface PaginationQuery {
  page?: string
  limit?: string
}

interface BuildQuery extends PaginationQuery {
  search?: string
  sortBy?: string
  userId?: string
}

export class BuildController {
  private buildService: BuildService

  constructor() {
    this.buildService = new BuildService()
  }

  /**
   * GET /api/builds
   * List all builds with optional filters and pagination
   */
  getAll = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const query = req.query as BuildQuery
    const page = Math.max(1, parseInt(query.page || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')))

    const filters = {
      search: query.search,
      sortBy: query.sortBy,
      userId: query.userId ? parseInt(query.userId) : undefined
    }

    const result = await this.buildService.getAll(filters, { page, limit })

    logger.info(`Retrieved ${result.builds.length} builds`)

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      },
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/builds/user/:userId
   * Get builds by a specific user
   */
  getByUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const userIdNum = parseInt(userId)
    const query = req.query as PaginationQuery
    const page = Math.max(1, parseInt(query.page || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')))

    if (isNaN(userIdNum)) {
      return next(createError('Invalid user ID', 400))
    }

    const result = await this.buildService.getByUser(userIdNum, { page, limit })

    logger.info(`Retrieved ${result.builds.length} builds for user: ${userIdNum}`)

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      },
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/builds/featured
   * Get featured builds
   */
  getFeatured = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))

    const builds = await this.buildService.getFeatured(limit)

    logger.info(`Retrieved ${builds.length} featured builds`)

    res.status(200).json({
      success: true,
      data: builds,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/builds/:id
   * Get a specific build by ID
   */
  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    const build = await this.buildService.getById(buildId)

    if (!build) {
      return next(createError('Build not found', 404))
    }

    logger.info(`Retrieved build: ${buildId}`)

    res.status(200).json({
      success: true,
      data: build,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/builds
   * Create a new build
   */
  create = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const buildData = {
      ...req.body,
      userId: req.user?.id
    }

    const build = await this.buildService.create(buildData)

    logger.info(`Created build: ${build.id} by user: ${req.user?.id}`)

    res.status(201).json({
      success: true,
      data: build,
      message: 'Build created successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * PUT /api/builds/:id
   * Update an existing build
   */
  update = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)
    const updateData = req.body

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    const build = await this.buildService.update(buildId, req.user?.id || 0, updateData)

    if (!build) {
      return next(createError('Build not found or unauthorized', 404))
    }

    logger.info(`Updated build: ${buildId}`)

    res.status(200).json({
      success: true,
      data: build,
      message: 'Build updated successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * DELETE /api/builds/:id
   * Delete a build
   */
  delete = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    const success = await this.buildService.delete(buildId, req.user?.id || 0)

    if (!success) {
      return next(createError('Build not found or unauthorized', 404))
    }

    logger.info(`Deleted build: ${buildId}`)

    res.status(200).json({
      success: true,
      message: 'Build deleted successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/builds/:id/clone
   * Clone an existing build
   */
  clone = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    const clonedBuild = await this.buildService.clone(buildId, req.user?.id || 0)

    if (!clonedBuild) {
      return next(createError('Build not found', 404))
    }

    logger.info(`Cloned build: ${buildId} for user: ${req.user?.id}`)

    res.status(201).json({
      success: true,
      data: clonedBuild,
      message: 'Build cloned successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/builds/:id/like
   * Toggle like on a build
   */
  toggleLike = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    const result = await this.buildService.toggleLike(buildId, req.user?.id || 0)

    logger.info(`User ${req.user?.id} toggled like on build: ${buildId}`)

    res.status(200).json({
      success: true,
      data: result,
      message: result.liked ? 'Build liked' : 'Build unliked',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/builds/:id/compatibility
   * Check build compatibility
   */
  checkCompatibility = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    const compatibility = await this.buildService.checkCompatibility(buildId)

    logger.info(`Checked compatibility for build: ${buildId}`)

    res.status(200).json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/builds/:id/price
   * Get build total price
   */
  calculatePrice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const buildId = parseInt(id)

    if (isNaN(buildId)) {
      return next(createError('Invalid build ID', 400))
    }

    try {
      const totalPrice = await this.buildService.calculatePrice(buildId)

      logger.info(`Calculated price for build: ${buildId} - ${totalPrice}`)

      res.status(200).json({
        success: true,
        data: {
          buildId,
          totalPrice
        },
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      if (error.statusCode === 404) {
        return next(createError('Build not found', 404))
      }
      throw error
    }
  })
}
