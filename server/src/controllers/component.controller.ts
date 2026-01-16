// This controller manages PC components inventory.
// Can list, search, filter components
// Can create, update and delete components
// Can make advanced search with complex filters
// Can see component statistics

// | Method | HTTP | Endpoint | Description |
// |--------|------|----------|-------------|
// | `getAll` | GET | `/api/components` | List all components with filters & pagination |
// | `getByCategory` | GET | `/api/components/:category` | Get components by category |
// | `getById` | GET | `/api/components/id/:id` | Get specific component by ID |
// | `create` | POST | `/api/components` | Create new component (admin only) |
// | `update` | PUT | `/api/components/:id` | Update component (admin only) |
// | `delete` | DELETE | `/api/components/:id` | Delete component (admin only) |
// | `getStatistics` | GET | `/api/components/stats/overview` | Get component statistics |
// | `advancedSearch` | POST | `/api/components/search/advanced` | Advanced search with complex filters |

import { Request, Response, NextFunction } from 'express'
import { ComponentService } from '../services/component.service'
import { createError, asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

interface PaginationQuery {
  page?: string
  limit?: string
}

interface ComponentQuery extends PaginationQuery {
  search?: string
  category?: string
  brand?: string
  sortBy?: string
}

export class ComponentController {
  private componentService: ComponentService

  constructor() {
    this.componentService = new ComponentService()
  }

  /**
   * GET /api/components
   * List all components with optional filters and pagination
   */
  getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as ComponentQuery
    const page = Math.max(1, parseInt(query.page || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')))

    const filters = {
      search: query.search,
      category: query.category,
      brand: query.brand,
      sortBy: query.sortBy
    }

    const result = await this.componentService.getAll(filters, { page, limit })

    logger.info(`Retrieved ${result.components.length} components`)

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
   * GET /api/components/:category
   * List components by category
   */
  getByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params
    const query = req.query as ComponentQuery
    const page = Math.max(1, parseInt(query.page || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')))

    const filters = {
      search: query.search,
      category,
      brand: query.brand,
      sortBy: query.sortBy
    }

    const result = await this.componentService.getByCategory(category, filters, { page, limit })

    logger.info(`Retrieved ${result.components.length} components from category: ${category}`)

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
   * GET /api/components/id/:id
   * Get a specific component by ID
   */
  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const componentId = parseInt(id)

    if (isNaN(componentId)) {
      return next(createError('Invalid component ID', 400))
    }

    const component = await this.componentService.getById(componentId)

    if (!component) {
      return next(createError('Component not found', 404))
    }

    logger.info(`Retrieved component: ${componentId}`)

    res.status(200).json({
      success: true,
      data: component,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/components
   * Create a new component (admin only)
   */
  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const componentData = req.body

    const component = await this.componentService.create(componentData)

    logger.info(`Created component: ${component.id} - ${component.name}`)

    res.status(201).json({
      success: true,
      data: component,
      message: 'Component created successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * PUT /api/components/:id
   * Update an existing component (admin only)
   */
  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const componentId = parseInt(id)
    const updateData = req.body

    if (isNaN(componentId)) {
      return next(createError('Invalid component ID', 400))
    }

    const component = await this.componentService.update(componentId, updateData)

    if (!component) {
      return next(createError('Component not found', 404))
    }

    logger.info(`Updated component: ${componentId}`)

    res.status(200).json({
      success: true,
      data: component,
      message: 'Component updated successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * DELETE /api/components/:id
   * Delete a component (admin only)
   */
  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const componentId = parseInt(id)

    if (isNaN(componentId)) {
      return next(createError('Invalid component ID', 400))
    }

    const success = await this.componentService.delete(componentId)

    if (!success) {
      return next(createError('Component not found', 404))
    }

    logger.info(`Deleted component: ${componentId}`)

    res.status(200).json({
      success: true,
      message: 'Component deleted successfully',
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/components/stats/overview
   * Get component statistics
   */
  getStatistics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await this.componentService.getStatistics()

    logger.info('Retrieved component statistics')

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/components/search/advanced
   * Advanced search with complex filters
   */
  advancedSearch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams = req.body
    const page = Math.max(1, searchParams.page || 1)
    const limit = Math.min(100, Math.max(1, searchParams.limit || 20))

    const result = await this.componentService.advancedSearch({
      ...searchParams,
      page,
      limit
    })

    logger.info(`Performed advanced search: ${searchParams.query || 'no query'}`)

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
}
