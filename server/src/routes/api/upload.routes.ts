import { Router } from 'express'
import { UploadController } from '../../controllers/upload.controller'
import { authMiddleware } from '../../middleware/auth'
import multer from 'multer'
import path from 'path'

// Configure multer for file uploads
const storage = multer.memoryStorage()

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['.glb', '.gltf', '.png', '.jpg', '.jpeg', '.svg', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${ext} is not allowed`), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '50MB'),
    files: 5
  }
})

const router = Router()
const uploadController = new UploadController()

// POST /api/upload/model - Upload 3D model file
router.post(
  '/model',
  authMiddleware,
  upload.single('model'),
  uploadController.uploadModel
)

// POST /api/upload/image - Upload image file
router.post(
  '/image',
  authMiddleware,
  upload.single('image'),
  uploadController.uploadImage
)

// POST /api/upload/multiple - Upload multiple files
router.post(
  '/multiple',
  authMiddleware,
  upload.array('files', 5),
  uploadController.uploadMultiple
)

// DELETE /api/upload/:fileName - Delete uploaded file
router.delete(
  '/:fileName',
  authMiddleware,
  uploadController.deleteFile
)

// GET /api/upload/url/:fileName - Get file URL
router.get(
  '/url/:fileName',
  uploadController.getFileUrl
)

// POST /api/upload/validate-model - Validate 3D model before upload
router.post(
  '/validate-model',
  authMiddleware,
  uploadController.validateModel
)

export default router
