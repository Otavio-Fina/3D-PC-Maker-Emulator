import { Router } from 'express'
import { BuildController } from '../../controllers/build.controller'
import { authMiddleware } from '../../middleware/auth'
import { validateBuild, validateId } from '../../middleware/validation'

const router = Router()
const buildController = new BuildController()

// GET /api/builds - Get all builds (with optional user filtering)
router.get('/', authMiddleware, buildController.getAll)

// GET /api/builds/user/:userId - Get builds by user ID
router.get('/user/:userId', authMiddleware, buildController.getByUser)

// GET /api/builds/featured - Get featured builds
router.get('/featured', buildController.getFeatured)

// GET /api/builds/:id - Get build by ID
router.get('/:id', validateId, buildController.getById)

// POST /api/builds - Create new build
router.post(
  '/',
  authMiddleware,
  validateBuild,
  buildController.create
)

// PUT /api/builds/:id - Update build
router.put(
  '/:id',
  authMiddleware,
  validateId,
  validateBuild,
  buildController.update
)

// DELETE /api/builds/:id - Delete build
router.delete(
  '/:id',
  authMiddleware,
  validateId,
  buildController.delete
)

// POST /api/builds/:id/clone - Clone a build
router.post(
  '/:id/clone',
  authMiddleware,
  validateId,
  buildController.clone
)

// POST /api/builds/:id/like - Like/unlike a build
router.post(
  '/:id/like',
  authMiddleware,
  validateId,
  buildController.toggleLike
)

// GET /api/builds/:id/compatibility - Check build compatibility
router.get(
  '/:id/compatibility',
  validateId,
  buildController.checkCompatibility
)

export default router
