import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Página não encontrada
        </h2>
        
        <p className="text-text-secondary mb-8">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Voltar para o início
          </Link>
          
          <div className="text-sm text-text-muted">
            Ou experimente:
            <div className="flex justify-center space-x-4 mt-2">
              <Link to="/builder" className="text-primary hover:underline">
                Builder
              </Link>
              <Link to="/catalog" className="text-primary hover:underline">
                Catálogo
              </Link>
              <Link to="/compare" className="text-primary hover:underline">
                Comparar
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
