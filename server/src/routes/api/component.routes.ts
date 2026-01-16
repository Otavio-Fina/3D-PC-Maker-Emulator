import { Router } from 'express'
import { ComponentController } from '../../controllers/component.controller'
import { authMiddleware } from '../../middleware/auth'
import { validateComponent } from '../../middleware/validation'

const router = Router()
const componentController = new ComponentController()

// GET /api/components - List all components
router.get('/', componentController.getAll)

// GET /api/components/:category - List components by category
router.get('/:category', componentController.getByCategory)

// GET /api/components/id/:id - Get component by ID
router.get('/id/:id', componentController.getById)

// POST /api/components - Create new component (admin only)
router.post(
  '/',
  authMiddleware,
  validateComponent,
  componentController.create
)

// PUT /api/components/:id - Update component (admin only)
router.put(
  '/:id',
  authMiddleware,
  validateComponent,
  componentController.update
)

// DELETE /api/components/:id - Delete component (admin only)
router.delete(
  '/:id',
  authMiddleware,
  componentController.delete
)

export default router
