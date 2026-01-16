import { Router } from 'express'
import apiRoutes from './api'

const router = Router()

router.use('/api', apiRoutes)

router.get('/api/docs', (req, res) => {
  res.json({
    message: '3D PC Maker Emulator API',
    version: '1.0.0',
    endpoints: {
      components: '/components',
      builds: '/builds',
      compatibility: '/compatibility',
      upload: '/upload',
      auth: '/auth',
    },
    documentation: 'https://docs.pc-builder-3d.com',
  })
})

export default router
