import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-primary mb-4">
          3D PC Maker
        </h2>
        
        <p className="text-text-secondary mb-6">
          Carregando componentes 3D...
        </p>
        
        <div className="w-64 h-2 bg-background-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <p className="text-text-muted text-sm mt-2">
          {Math.round(progress)}%
        </p>
      </motion.div>
    </div>
  )
}
