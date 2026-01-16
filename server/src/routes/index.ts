import { Router } from 'express'
import apiRoutes from './api'

const router = Router()

// API versioning
router.use('/api', apiRoutes)

// API documentation
router.get('/api/docs', (req, res) => {
  res.json({
    message: '3D PC Maker Emulator API',
    version: '1.0.0',
    endpoints: {
      components: '/api/components',
      builds: '/api/builds',
      compatibility: '/api/compatibility',
      upload: '/api/upload',
      auth: '/api/auth',
    },
    documentation: 'https://docs.pc-builder-3d.com',
  })
})

export default router
