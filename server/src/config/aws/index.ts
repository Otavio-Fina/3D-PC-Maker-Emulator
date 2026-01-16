import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION = 'us-east-1',
  AWS_S3_BUCKET,
  NODE_ENV = 'development'
} = process.env

export const configAWS = (): void => {
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET) {
    if (NODE_ENV === 'production') {
      throw new Error('AWS credentials are required in production')
    } else {
      console.warn('AWS credentials not configured. Using local storage for development.')
      return
    }
  }

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  })

  console.log('AWS configuration loaded successfully.')
}

export const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: AWS_REGION
})

export const getS3Bucket = (): string => {
  if (!AWS_S3_BUCKET && process.env.NODE_ENV === 'production') {
    throw new Error('S3 bucket name is required in production')
  }
  return AWS_S3_BUCKET || 'pc-builder-3d-dev'
}

// Upload file to S3
export const uploadToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const bucket = getS3Bucket()
  
  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read'
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error('Failed to upload file to S3')
  }
}

// Delete file from S3
export const deleteFromS3 = async (fileName: string): Promise<void> => {
  const bucket = getS3Bucket()
  
  const params = {
    Bucket: bucket,
    Key: fileName
  }

  try {
    await s3.deleteObject(params).promise()
    console.log(`File ${fileName} deleted successfully from S3`)
  } catch (error) {
    console.error('Error deleting from S3:', error)
    throw new Error('Failed to delete file from S3')
  }
}
