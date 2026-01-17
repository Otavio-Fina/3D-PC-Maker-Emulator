// This controller handles file uploads (ADMIN).
// Can make 3D model uploads (GLB/GLTF)
// Can make image uploads
// Can bulk file upload
// Can delete files
// Can validate models

// | Method | HTTP | Endpoint | Description |
// |--------|------|----------|-------------|
// | `uploadModel` | POST | `/api/upload/model` | Upload 3D model file (GLB/GLTF) |
// | `uploadImage` | POST | `/api/upload/image` | Upload image file (PNG/JPG/WebP/SVG) |
// | `uploadMultiple` | POST | `/api/upload/multiple` | Upload multiple files (max 5) |
// | `deleteFile` | DELETE | `/api/upload/:fileName` | Delete uploaded file |
// | `getFileUrl` | GET | `/api/upload/url/:fileName` | Get public URL of file |
// | `validateModel` | POST | `/api/upload/validate-model` | Validate 3D model structure |

// - **Models**: `.glb`, `.gltf`
// - **Images**: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`

import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'
import { uploadToS3, deleteFromS3, getS3Bucket } from '../config/aws'
import { createError, asyncHandler } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

interface UploadedFile extends Express.Multer.File {}

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
const ALLOWED_MODEL_TYPES = ['.glb', '.gltf']
const ALLOWED_IMAGE_TYPES = ['.png', '.jpg', '.jpeg', '.svg', '.webp']

export class UploadController {
  /**
   * POST /api/upload/model
   * Upload a 3D model file
   */
  uploadModel = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const file = req.file as UploadedFile

    if (!file) {
      return next(createError('No model file provided', 400))
    }

    try {
      const ext = path.extname(file.originalname).toLowerCase()

      if (!ALLOWED_MODEL_TYPES.includes(ext)) {
        return next(createError(`File type ${ext} is not allowed. Allowed types: ${ALLOWED_MODEL_TYPES.join(', ')}`, 400))
      }

      const fileName = `models/${req.user?.id}/${Date.now()}-${file.originalname}`
      const fileUrl = await uploadToS3(file.buffer, fileName, file.mimetype)

      logger.info(`Model uploaded: ${fileName} by user: ${req.user?.id}`)

      res.status(201).json({
        success: true,
        data: {
          fileName,
          fileUrl,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype
        },
        message: 'Model uploaded successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      logger.error(`Model upload failed: ${error.message}`)
      return next(createError('Failed to upload model file', 500))
    }
  })

  /**
   * POST /api/upload/image
   * Upload an image file
   */
  uploadImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const file = req.file as UploadedFile

    if (!file) {
      return next(createError('No image file provided', 400))
    }

    try {
      const ext = path.extname(file.originalname).toLowerCase()

      if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
        return next(createError(`File type ${ext} is not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`, 400))
      }

      // REDUNDANT FOR NOW but this optimizes imgs
      let optimizedBuffer = file.buffer
      if (ext !== '.svg') {
        optimizedBuffer = await sharp(file.buffer)
          .resize(1920, 1080, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80 })
          .toBuffer()
      }

      const fileName = `images/${req.user?.id}/${Date.now()}-${path.basename(file.originalname, ext)}.webp`
      const fileUrl = await uploadToS3(optimizedBuffer, fileName, 'image/webp')

      logger.info(`Image uploaded: ${fileName} by user: ${req.user?.id}`)

      res.status(201).json({
        success: true,
        data: {
          fileName,
          fileUrl,
          originalName: file.originalname,
          size: file.size,
          mimeType: 'image/webp'
        },
        message: 'Image uploaded successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      logger.error(`Image upload failed: ${error.message}`)
      return next(createError('Failed to upload image file', 500))
    }
  })

  /**
   * POST /api/upload/multiple
   * Upload multiple files at once
   */
  uploadMultiple = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const files = req.files as UploadedFile[]

    if (!files || files.length === 0) {
      return next(createError('No files provided', 400))
    }

    if (files.length > 5) {
      return next(createError('Maximum 5 files allowed per upload', 400))
    }

    const uploadResults = []
    const errors = []

    for (const file of files) {
      try {
        const ext = path.extname(file.originalname).toLowerCase()
        const isModel = ALLOWED_MODEL_TYPES.includes(ext)
        const isImage = ALLOWED_IMAGE_TYPES.includes(ext)

        if (!isModel && !isImage) {
          errors.push({
            file: file.originalname,
            error: `File type ${ext} not allowed`
          })
          continue
        }

        let uploadBuffer = file.buffer
        let mimeType = file.mimetype

        // REDUNDANT FOR NOW but this optimizes imgs
        if (isImage && ext !== '.svg') {
          uploadBuffer = await sharp(file.buffer)
            .resize(1920, 1080, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer()
          mimeType = 'image/webp'
        }

        const folder = isModel ? 'models' : 'images'
        const fileName = `${folder}/${req.user?.id}/${Date.now()}-${file.originalname}`
        const fileUrl = await uploadToS3(uploadBuffer, fileName, mimeType)

        uploadResults.push({
          fileName,
          fileUrl,
          originalName: file.originalname,
          size: file.size,
          mimeType,
          status: 'success'
        })

        logger.info(`File uploaded: ${fileName} by user: ${req.user?.id}`)
      } catch (error: any) {
        errors.push({
          file: file.originalname,
          error: error.message || 'Upload failed'
        })
      }
    }

    res.status(207).json({
      success: uploadResults.length > 0,
      data: {
        successful: uploadResults,
        failed: errors
      },
      message: `${uploadResults.length} file(s) uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
      timestamp: new Date().toISOString()
    })
  })

  /**
   * DELETE /api/upload/:fileName
   * Delete a file
   */
  deleteFile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { fileName } = req.params

    if (!fileName) {
      return next(createError('File name is required', 400))
    }

    try {
      // verify ownership, this will probably be deleted
      if (!fileName.includes(`/${req.user?.id}/`)) {
        return next(createError('Unauthorized to delete this file', 403))
      }

      await deleteFromS3(fileName)

      logger.info(`File deleted: ${fileName} by user: ${req.user?.id}`)

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      logger.error(`File deletion failed: ${error.message}`)
      return next(createError('Failed to delete file', 500))
    }
  })

  /**
   * GET /api/upload/url/:fileName
   * Get the public URL of an uploaded file
   */
  getFileUrl = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fileName } = req.params

    if (!fileName) {
      return next(createError('File name is required', 400))
    }

    try {
      const bucket = getS3Bucket()
      const fileUrl = `https://${bucket}.s3.amazonaws.com/${fileName}`

      logger.info(`Retrieved URL for file: ${fileName}`)

      res.status(200).json({
        success: true,
        data: {
          fileName,
          url: fileUrl
        },
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      return next(createError('Failed to generate file URL', 500))
    }
  })

  /**
   * POST /api/upload/validate-model
   * Validate a 3D model file structure
   */
  validateModel = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const file = req.file as UploadedFile

    if (!file) {
      return next(createError('No model file provided', 400))
    }

    try {
      const ext = path.extname(file.originalname).toLowerCase()

      if (!ALLOWED_MODEL_TYPES.includes(ext)) {
        return next(createError(`Invalid model format: ${ext}`, 400))
      }

      const MAX_MODEL_SIZE = 50 * 1024 * 1024 // 50MB
      if (file.size > MAX_MODEL_SIZE) {
        return next(createError(`Model file too large. Maximum size: 50MB`, 413))
      }

      const isValid = this.validateModelStructure(file.buffer, ext)

      if (!isValid) {
        return next(createError('Model file structure is invalid', 400))
      }

      logger.info(`Model validated: ${file.originalname} by user: ${req.user?.id}`)

      res.status(200).json({
        success: true,
        data: {
          fileName: file.originalname,
          size: file.size,
          format: ext,
          isValid: true
        },
        message: 'Model file is valid',
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      logger.error(`Model validation failed: ${error.message}`)
      return next(createError('Failed to validate model file', 500))
    }
  })

  /**
   * Helper method to validate model file structure
   */
  private validateModelStructure(buffer: Buffer, extension: string): boolean {
    if (!buffer || buffer.length === 0) {
      return false
    }

    if (extension === '.glb') {
      // GLB files start with magic number 'glTF' (0x67, 0x6C, 0x54, 0x46)
      // This will not be worked on rn
      const magic = buffer.slice(0, 4).toString('utf-8')
      return magic === 'glTF'
    }

    if (extension === '.gltf') {
      // GLTF files are JSON, should start with '{'
      try {
        const content = buffer.toString('utf-8').trim()
        JSON.parse(content)
        return true
      } catch {
        return false
      }
    }

    return false
  }
}
