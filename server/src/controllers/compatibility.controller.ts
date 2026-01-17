// This controller analyzes hardware compatibility.
// Can give a full build compatibility analysis
// Can make component-specific compatibility checks
// Can make power supply adequacy verifications
// Can validate cooling systems
// Can see storage compatibility

import { Request, Response, NextFunction } from 'express'
import { CompatibilityService } from '../services/compatibility.service'
import { ComponentService } from '../services/component.service'
import { createError, asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

export class CompatibilityController {
  private compatibilityService: CompatibilityService
  private componentService: ComponentService

  constructor() {
    this.compatibilityService = new CompatibilityService()
    this.componentService = new ComponentService()
  }

  /**
   * POST /api/compatibility/check
   * Check compatibility of a list of components
   */
  checkCompatibility = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { componentIds } = req.body

    if (!Array.isArray(componentIds) || componentIds.length === 0) {
      return next(createError('Component IDs array is required and must not be empty', 400))
    }

    const components = await Promise.all(
      componentIds.map(id => this.componentService.getById(parseInt(id)))
    )

    const missingComponents = components.filter(c => !c)
    if (missingComponents.length > 0) {
      return next(createError(`${missingComponents.length} component(s) not found`, 404))
    }

    const compatibilityResult = await this.compatibilityService.analyzeBuild(
      components.filter(c => c !== null)
    )

    logger.info(`Checked compatibility for ${componentIds.length} components`)

    res.status(200).json({
      success: true,
      data: compatibilityResult,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/check
   * Check compatibility for component query parameters
   */
  checkComponents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { componentIds } = req.query

    if (!componentIds) {
      return next(createError('Component IDs are required', 400))
    }

    const ids = Array.isArray(componentIds) ? componentIds : [componentIds]
    const components = await Promise.all(
      ids.map(id => this.componentService.getById(parseInt(id as string)))
    )

    const missingComponents = components.filter(c => !c)
    if (missingComponents.length > 0) {
      return next(createError(`${missingComponents.length} component(s) not found`, 404))
    }

    const compatibilityResult = await this.compatibilityService.analyzeBuild(
      components.filter(c => c !== null)
    )

    logger.info(`Checked compatibility for ${ids.length} components`)

    res.status(200).json({
      success: true,
      data: compatibilityResult,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/cpu/:cpuId/motherboards
   * Get compatible motherboards for a CPU
   */
  getCompatibleMotherboards = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { cpuId } = req.params
    const id = parseInt(cpuId)

    if (isNaN(id)) {
      return next(createError('Invalid CPU ID', 400))
    }

    const cpu = await this.componentService.getById(id)

    if (!cpu || cpu.category !== 'cpu') {
      return next(createError('CPU not found or invalid', 404))
    }

    const compatibility = await this.compatibilityService.getCompatibleMotherboards(id)

    logger.info(`Retrieved compatible motherboards for CPU: ${id}`)

    res.status(200).json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/cpu/:cpuId/cooling
   * Get compatible cooling solutions for a CPU
   */
  getCompatibleCooling = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { cpuId } = req.params
    const id = parseInt(cpuId)

    if (isNaN(id)) {
      return next(createError('Invalid CPU ID', 400))
    }

    const cpu = await this.componentService.getById(id)

    if (!cpu || cpu.category !== 'cpu') {
      return next(createError('CPU not found or invalid', 404))
    }

    const compatibility = await this.compatibilityService.getCompatibleCooling(id)

    logger.info(`Retrieved compatible cooling for CPU: ${id}`)

    res.status(200).json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/gpu/:gpuId/psu
   * Get recommended PSU for a GPU
   */
  getRecommendedPSU = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { gpuId } = req.params
    const id = parseInt(gpuId)

    if (isNaN(id)) {
      return next(createError('Invalid GPU ID', 400))
    }

    const gpu = await this.componentService.getById(id)

    if (!gpu || gpu.category !== 'gpu') {
      return next(createError('GPU not found or invalid', 404))
    }

    const psus = await this.compatibilityService.getRecommendedPSU(id)

    logger.info(`Retrieved recommended PSU for GPU: ${id}`)

    res.status(200).json({
      success: true,
      data: psus,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/motherboard/:motherboardId/memory
   * Get compatible memory for a motherboard
   */
  getCompatibleMemory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { motherboardId } = req.params
    const id = parseInt(motherboardId)

    if (isNaN(id)) {
      return next(createError('Invalid Motherboard ID', 400))
    }

    const motherboard = await this.componentService.getById(id)

    if (!motherboard || motherboard.category !== 'motherboard') {
      return next(createError('Motherboard not found or invalid', 404))
    }

    const compatibility = await this.compatibilityService.getCompatibleMemory(id)

    logger.info(`Retrieved compatible memory for Motherboard: ${id}`)

    res.status(200).json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/motherboard/:motherboardId/storage
   * Get compatible storage for a motherboard
   */
  getCompatibleStorage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { motherboardId } = req.params
    const id = parseInt(motherboardId)

    if (isNaN(id)) {
      return next(createError('Invalid Motherboard ID', 400))
    }

    const motherboard = await this.componentService.getById(id)

    if (!motherboard || motherboard.category !== 'motherboard') {
      return next(createError('Motherboard not found or invalid', 404))
    }

    const compatibility = await this.compatibilityService.getCompatibleStorage(id)

    logger.info(`Retrieved compatible storage for Motherboard: ${id}`)

    res.status(200).json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/build
   * Analyze full build compatibility
   */
  analyzeBuild = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { componentIds } = req.body

    if (!Array.isArray(componentIds) || componentIds.length === 0) {
      return next(createError('Component IDs array is required and must not be empty', 400))
    }

    const components = await Promise.all(
      componentIds.map(id => this.componentService.getById(parseInt(id)))
    )

    const missingComponents = components.filter(c => !c)
    if (missingComponents.length > 0) {
      return next(createError(`${missingComponents.length} component(s) not found`, 404))
    }

    const result = await this.compatibilityService.analyzeBuild(
      components.filter(c => c !== null)
    )

    logger.info(`Analyzed build compatibility for ${componentIds.length} components`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * GET /api/compatibility/requirements/:category
   * Get compatibility requirements for a component category
   */
  getCompatibilityRequirements = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params

    if (!category) {
      return next(createError('Category is required', 400))
    }

    const requirements = await this.compatibilityService.getCompatibilityRequirements(category)

    logger.info(`Retrieved compatibility requirements for category: ${category}`)

    res.status(200).json({
      success: true,
      data: requirements,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/cpu-motherboard
   * Check CPU and Motherboard compatibility specifically
   */
  checkCPUMotherboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { cpuId, motherboardId } = req.body

    if (!cpuId || !motherboardId) {
      return next(createError('CPU ID and Motherboard ID are required', 400))
    }

    const cpu = await this.componentService.getById(parseInt(cpuId))
    const motherboard = await this.componentService.getById(parseInt(motherboardId))

    if (!cpu || cpu.category !== 'cpu') {
      return next(createError('CPU not found or invalid', 404))
    }

    if (!motherboard || motherboard.category !== 'motherboard') {
      return next(createError('Motherboard not found or invalid', 404))
    }

    const result = this.compatibilityService.checkCPUMotherboardCompatibility(cpu, motherboard)

    logger.info(`Checked CPU-Motherboard compatibility: CPU ${cpuId} <-> MB ${motherboardId}`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/ram-motherboard
   * Check RAM and Motherboard compatibility specifically
   */
  checkRAMMotherboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { ramId, motherboardId } = req.body

    if (!ramId || !motherboardId) {
      return next(createError('RAM ID and Motherboard ID are required', 400))
    }

    const ram = await this.componentService.getById(parseInt(ramId))
    const motherboard = await this.componentService.getById(parseInt(motherboardId))

    if (!ram || ram.category !== 'ram') {
      return next(createError('RAM not found or invalid', 404))
    }

    if (!motherboard || motherboard.category !== 'motherboard') {
      return next(createError('Motherboard not found or invalid', 404))
    }

    const result = this.compatibilityService.checkRAMMotherboardCompatibility(ram, motherboard)

    logger.info(`Checked RAM-Motherboard compatibility: RAM ${ramId} <-> MB ${motherboardId}`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/gpu-motherboard
   * Check GPU and Motherboard compatibility specifically
   */
  checkGPUMotherboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { gpuId, motherboardId } = req.body

    if (!gpuId || !motherboardId) {
      return next(createError('GPU ID and Motherboard ID are required', 400))
    }

    const gpu = await this.componentService.getById(parseInt(gpuId))
    const motherboard = await this.componentService.getById(parseInt(motherboardId))

    if (!gpu || gpu.category !== 'gpu') {
      return next(createError('GPU not found or invalid', 404))
    }

    if (!motherboard || motherboard.category !== 'motherboard') {
      return next(createError('Motherboard not found or invalid', 404))
    }

    const result = this.compatibilityService.checkGPUCompatibility(gpu, motherboard)

    logger.info(`Checked GPU-Motherboard compatibility: GPU ${gpuId} <-> MB ${motherboardId}`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/power-supply
   * Check if Power Supply is adequate for components
   */
  checkPowerSupply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { psuId, componentIds } = req.body

    if (!psuId || !Array.isArray(componentIds) || componentIds.length === 0) {
      return next(createError('PSU ID and component IDs array are required', 400))
    }

    const psu = await this.componentService.getById(parseInt(psuId))

    if (!psu || psu.category !== 'psu') {
      return next(createError('PSU not found or invalid', 404))
    }

    const components = await Promise.all(
      componentIds.map(id => this.componentService.getById(parseInt(id)))
    )

    const missingComponents = components.filter(c => !c)
    if (missingComponents.length > 0) {
      return next(createError(`${missingComponents.length} component(s) not found`, 404))
    }

    const result = this.compatibilityService.checkPSUAdequacy(
      psu,
      components.filter(c => c !== null)
    )

    logger.info(`Checked PSU adequacy: PSU ${psuId} for ${componentIds.length} components`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/storage
   * Check Storage and Motherboard compatibility
   */
  checkStorage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { storageId, motherboardId } = req.body

    if (!storageId || !motherboardId) {
      return next(createError('Storage ID and Motherboard ID are required', 400))
    }

    const storage = await this.componentService.getById(parseInt(storageId))
    const motherboard = await this.componentService.getById(parseInt(motherboardId))

    if (!storage || storage.category !== 'storage') {
      return next(createError('Storage not found or invalid', 404))
    }

    if (!motherboard || motherboard.category !== 'motherboard') {
      return next(createError('Motherboard not found or invalid', 404))
    }

    const result = this.compatibilityService.checkStorageCompatibility(storage, motherboard)

    logger.info(`Checked Storage compatibility: Storage ${storageId} <-> MB ${motherboardId}`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * POST /api/compatibility/cooling
   * Check Cooling and CPU compatibility
   */
  checkCooling = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { coolingId, cpuId } = req.body

    if (!coolingId || !cpuId) {
      return next(createError('Cooling ID and CPU ID are required', 400))
    }

    const cooling = await this.componentService.getById(parseInt(coolingId))
    const cpu = await this.componentService.getById(parseInt(cpuId))

    if (!cooling || cooling.category !== 'cooling') {
      return next(createError('Cooling not found or invalid', 404))
    }

    if (!cpu || cpu.category !== 'cpu') {
      return next(createError('CPU not found or invalid', 404))
    }

    const result = this.compatibilityService.checkCoolingCompatibility(cooling, cpu)

    logger.info(`Checked Cooling compatibility: Cooling ${coolingId} <-> CPU ${cpuId}`)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  })
}
