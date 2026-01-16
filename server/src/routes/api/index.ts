import { Router } from 'express'
import componentRoutes from './component.routes'
import buildRoutes from './build.routes'
import compatibilityRoutes from './compatibility.routes'
import uploadRoutes from './upload.routes'

const router = Router()

// Route modules
router.use('/components', componentRoutes)
router.use('/builds', buildRoutes)
router.use('/compatibility', compatibilityRoutes)
router.use('/upload', uploadRoutes)

export default router
