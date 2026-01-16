/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AWS_S3_BUCKET: string
  readonly VITE_ENABLE_SHADOWS: string
  readonly VITE_ENABLE_ANTIALIAS: string
  readonly VITE_PIXEL_RATIO: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_MAX_MODEL_SIZE_MB: string
  readonly VITE_CACHE_DURATION_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
