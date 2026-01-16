import { Router } from 'express'
import { CompatibilityController } from '../../controllers/compatibility.controller'
import { validateComponentQuery } from '../../middleware/validation'

const router = Router()
const compatibilityController = new CompatibilityController()

// GET /api/compatibility/check - Check compatibility between components
router.get('/check', validateComponentQuery, compatibilityController.checkComponents)

// GET /api/compatibility/cpu/:cpuId/motherboards - Get compatible motherboards for CPU
router.get('/cpu/:cpuId/motherboards', compatibilityController.getCompatibleMotherboards)

// GET /api/compatibility/cpu/:cpuId/cooling - Get compatible cooling for CPU
router.get('/cpu/:cpuId/cooling', compatibilityController.getCompatibleCooling)

// GET /api/compatibility/gpu/:gpuId/psu - Get recommended PSU for GPU
router.get('/gpu/:gpuId/psu', compatibilityController.getRecommendedPSU)

// GET /api/compatibility/motherboard/:motherboardId/memory - Get compatible memory for motherboard
router.get('/motherboard/:motherboardId/memory', compatibilityController.getCompatibleMemory)

// GET /api/compatibility/motherboard/:motherboardId/storage - Get compatible storage for motherboard
router.get('/motherboard/:motherboardId/storage', compatibilityController.getCompatibleStorage)

// POST /api/compatibility/build - Analyze full build compatibility
router.post('/build', compatibilityController.analyzeBuild)

// GET /api/compatibility/requirements/:category - Get compatibility requirements for category
router.get('/requirements/:category', compatibilityController.getCompatibilityRequirements)

export default router
