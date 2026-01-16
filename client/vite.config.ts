import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '3D PC Maker Emulator',
        short_name: 'PC Maker 3D',
        description: 'Build and customize your dream PC in 3D',
        theme_color: '#3b82f6',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'pwaIcons/icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwaIcons/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,glb,gltf}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(glb|gltf|png|jpg|jpeg|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: '3d-models-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/services': resolve(__dirname, './src/services'),
      '@/types': resolve(__dirname, './src/@types'),
      '@/assets': resolve(__dirname, './src/assets'),
      '@/lib': resolve(__dirname, './src/lib')
    }
  },
  server: {
    port: 3020,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three'],
          ui: ['framer-motion', 'react-hot-toast']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['three', 'framer-motion']
  }
})
