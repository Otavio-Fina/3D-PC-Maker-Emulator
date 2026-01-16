import { Component } from '../models/Component'
import { Op } from 'sequelize'
import { createError } from '../middleware/errorHandler'

interface ComponentFilters {
  search?: string
  category?: string
  brand?: string
  sortBy?: string
}

interface Pagination {
  page: number
  limit: number
}

interface ComponentResult {
  components: Component[]
  page: number
  limit: number
  total: number
}

export class ComponentService {
  // Get all components with filters and pagination
  async getAll(filters: ComponentFilters, pagination: Pagination): Promise<ComponentResult> {
    const { search, category, brand, sortBy = 'name' } = filters
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const whereClause: any = {}

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } }
      ]
    }

    if (category) {
      whereClause.category = category
    }

    if (brand) {
      whereClause.brand = brand
    }

    const orderClause = this.getSortOrder(sortBy)

    const { count, rows } = await Component.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      include: ['specifications']
    })

    return {
      components: rows,
      page,
      limit,
      total: count
    }
  }

  // Get components by category
  async getByCategory(category: string, filters: ComponentFilters, pagination: Pagination): Promise<ComponentResult> {
    return this.getAll({ ...filters, category }, pagination)
  }

  // Get component by ID
  async getById(id: number): Promise<Component | null> {
    return Component.findByPk(id, {
      include: ['specifications', 'reviews']
    })
  }

  // Create new component
  async create(componentData: any): Promise<Component> {
    try {
      return await Component.create(componentData, {
        include: ['specifications']
      })
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Component with this name already exists', 409)
      }
      throw createError('Failed to create component', 500)
    }
  }

  // Update component
  async update(id: number, updateData: any): Promise<Component | null> {
    const component = await Component.findByPk(id)
    
    if (!component) {
      return null
    }

    try {
      await component.update(updateData)
      return component
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Component with this name already exists', 409)
      }
      throw createError('Failed to update component', 500)
    }
  }

  // Delete component
  async delete(id: number): Promise<boolean> {
    const deleted = await Component.destroy({
      where: { id }
    })
    
    return deleted > 0
  }

  // Get component statistics
  async getStatistics(): Promise<any> {
    const totalComponents = await Component.count()
    const componentsByCategory = await Component.findAll({
      attributes: [
        'category',
        [Component.sequelize!.fn('COUNT', Component.sequelize!.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    })

    const topBrands = await Component.findAll({
      attributes: [
        'brand',
        [Component.sequelize!.fn('COUNT', Component.sequelize!.col('id')), 'count']
      ],
      group: ['brand'],
      order: [[Component.sequelize!.fn('COUNT', Component.sequelize!.col('id')), 'DESC']],
      limit: 10,
      raw: true
    })

    return {
      totalComponents,
      componentsByCategory,
      topBrands
    }
  }

  // Search components with advanced filters
  async advancedSearch(searchParams: any): Promise<ComponentResult> {
    const {
      query,
      categories,
      brands,
      minPrice,
      maxPrice,
      rating,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = searchParams

    const offset = (page - 1) * limit
    const whereClause: any = {}

    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
        { brand: { [Op.like]: `%${query}%` } }
      ]
    }

    if (categories && categories.length > 0) {
      whereClause.category = { [Op.in]: categories }
    }

    if (brands && brands.length > 0) {
      whereClause.brand = { [Op.in]: brands }
    }

    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price[Op.gte] = minPrice
      if (maxPrice) whereClause.price[Op.lte] = maxPrice
    }

    if (rating) {
      whereClause.rating = { [Op.gte]: rating }
    }

    const orderClause = this.getSortOrder(sortBy)

    const { count, rows } = await Component.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      include: ['specifications']
    })

    return {
      components: rows,
      page,
      limit,
      total: count
    }
  }

  // Helper method to get sort order
  private getSortOrder(sortBy: string): any[] {
    switch (sortBy) {
      case 'price-low':
        return [['price', 'ASC']]
      case 'price-high':
        return [['price', 'DESC']]
      case 'rating':
        return [['rating', 'DESC']]
      case 'newest':
        return [['createdAt', 'DESC']]
      case 'name':
      default:
        return [['name', 'ASC']]
    }
  }
}
