import { Build } from '../models/Build'
import { Component } from '../models/Component'
import { CompatibilityService } from './compatibility.service'
import { createError } from '../middleware/errorHandler'
import { Op } from 'sequelize'

interface BuildFilters {
  search?: string
  sortBy?: string
  userId?: number
}

interface Pagination {
  page: number
  limit: number
}

interface BuildResult {
  builds: Build[]
  page: number
  limit: number
  total: number
}

export class BuildService {
  private compatibilityService: CompatibilityService

  constructor() {
    this.compatibilityService = new CompatibilityService()
  }

  // Get all builds with filters and pagination
  async getAll(filters: BuildFilters, pagination: Pagination): Promise<BuildResult> {
    const { search, sortBy = 'newest', userId } = filters
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const whereClause: any = {}

    if (userId) {
      whereClause.userId = userId
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ]
    }

    const orderClause = this.getSortOrder(sortBy)

    const { count, rows } = await Build.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      include: [
        {
          model: Component,
          as: 'components',
          through: { attributes: [] }
        }
      ]
    })

    return {
      builds: rows,
      page,
      limit,
      total: count
    }
  }

  // Get builds by user ID
  async getByUser(userId: number, pagination: Pagination): Promise<BuildResult> {
    return this.getAll({ userId }, pagination)
  }

  // Get featured builds
  async getFeatured(limit: number = 10): Promise<Build[]> {
    return Build.findAll({
      where: { isFeatured: true },
      limit,
      order: [['likes', 'DESC']],
      include: [
        {
          model: Component,
          as: 'components',
          through: { attributes: [] }
        }
      ]
    })
  }

  // Get build by ID
  async getById(id: number): Promise<Build | null> {
    return Build.findByPk(id, {
      include: [
        {
          model: Component,
          as: 'components',
          through: { attributes: [] }
        }
      ]
    })
  }

  // Create new build
  async create(buildData: any): Promise<Build> {
    try {
      const build = await Build.create(buildData)
      
      if (buildData.components) {
        const componentIds = Object.values(buildData.components).filter(id => id) as number[]
        if (componentIds.length > 0) {
          await build.setComponents(componentIds)
        }
      }

      return build
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Build with this name already exists', 409)
      }
      throw createError('Failed to create build', 500)
    }
  }

  // Update build
  async update(id: number, userId: number, updateData: any): Promise<Build | null> {
    const build = await Build.findOne({
      where: { id, userId }
    })

    if (!build) {
      return null
    }

    try {
      await build.update(updateData)

      if (updateData.components) {
        const componentIds = Object.values(updateData.components).filter(id => id) as number[]
        if (componentIds.length > 0) {
          await build.setComponents(componentIds)
        }
      }

      return build
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Build with this name already exists', 409)
      }
      throw createError('Failed to update build', 500)
    }
  }

  // Delete build
  async delete(id: number, userId: number): Promise<boolean> {
    const deleted = await Build.destroy({
      where: { id, userId }
    })

    return deleted > 0
  }

  // Clone build
  async clone(id: number, userId: number): Promise<Build | null> {
    const originalBuild = await Build.findByPk(id, {
      include: [
        {
          model: Component,
          as: 'components',
          through: { attributes: [] }
        }
      ]
    })

    if (!originalBuild) {
      return null
    }

    const clonedData = {
      name: `${originalBuild.name} (Copy)`,
      description: originalBuild.description,
      userId,
      isPublic: false,
      isFeatured: false
    }

    const clonedBuild = await this.create(clonedData)

    if (originalBuild.components) {
      const componentIds = originalBuild.components.map((comp: any) => comp.id)
      await clonedBuild.setComponents(componentIds)
    }

    return clonedBuild
  }

  // Toggle like on build
  async toggleLike(buildId: number, userId: number): Promise<{ liked: boolean; likes: number }> {
    const build = await Build.findByPk(buildId)
    if (!build) {
      throw createError('Build not found', 404)
    }

    const currentLikes = build.getDataValue('likes') || 0
    
    const liked = true // Placeholder
    
    await build.update({
      likes: liked ? currentLikes + 1 : currentLikes - 1
    })

    return {
      liked,
      likes: build.getDataValue('likes')
    }
  }

  // Check build compatibility
  async checkCompatibility(buildId: number): Promise<any> {
    const build = await Build.findByPk(buildId, {
      include: [
        {
          model: Component,
          as: 'components',
          through: { attributes: [] }
        }
      ]
    })

    if (!build) {
      throw createError('Build not found', 404)
    }

    const components = build.components || []
    return this.compatibilityService.analyzeBuild(components)
  }

  // Calculate build price
  async calculatePrice(buildId: number): Promise<number> {
    const build = await Build.findByPk(buildId, {
      include: [
        {
          model: Component,
          as: 'components',
          through: { attributes: [] }
        }
      ]
    })

    if (!build) {
      throw createError('Build not found', 404)
    }

    const components = build.components || []
    return components.reduce((total: number, component: any) => {
      return total + (component.price || 0)
    }, 0)
  }

  // Get build statistics
  async getStatistics(): Promise<any> {
    const totalBuilds = await Build.count()
    const publicBuilds = await Build.count({ where: { isPublic: true } })
    const featuredBuilds = await Build.count({ where: { isFeatured: true } })

    const popularBuilds = await Build.findAll({
      order: [['likes', 'DESC']],
      limit: 10,
      attributes: ['id', 'name', 'likes']
    })

    const recentBuilds = await Build.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'name', 'createdAt']
    })

    return {
      totalBuilds,
      publicBuilds,
      featuredBuilds,
      popularBuilds,
      recentBuilds
    }
  }

  // Helper method to get sort order
  private getSortOrder(sortBy: string): any[] {
    switch (sortBy) {
      case 'newest':
        return [['createdAt', 'DESC']]
      case 'oldest':
        return [['createdAt', 'ASC']]
      case 'popular':
        return [['likes', 'DESC']]
      case 'name':
        return [['name', 'ASC']]
      default:
        return [['createdAt', 'DESC']]
    }
  }
}
