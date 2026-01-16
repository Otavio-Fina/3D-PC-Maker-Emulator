import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const categories = [
    {
      name: 'Processadores',
      icon: '💻',
      href: '/catalog/cpu',
      count: 24,
    },
    {
      name: 'Placas de Vídeo',
      icon: '🎮',
      href: '/catalog/gpu',
      count: 18,
    },
    {
      name: 'Memória RAM',
      icon: '🧠',
      href: '/catalog/ram',
      count: 32,
    },
    {
      name: 'Armazenamento',
      icon: '💾',
      href: '/catalog/storage',
      count: 28,
    },
    {
      name: 'Placas-Mãe',
      icon: '🔧',
      href: '/catalog/motherboard',
      count: 15,
    },
    {
      name: 'Fontes',
      icon: '⚡',
      href: '/catalog/psu',
      count: 12,
    },
    {
      name: 'Cooling',
      icon: '❄️',
      href: '/catalog/cooling',
      count: 20,
    },
    {
      name: 'Gabinetes',
      icon: '📦',
      href: '/catalog/case',
      count: 16,
    },
  ]

  return (
    <aside
      className={`
        bg-background-secondary border-r border-border-primary transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-2 text-text-secondary hover:text-primary transition-colors"
        >
          <span className={`font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
            Componentes
          </span>
          <motion.svg
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </motion.svg>
        </button>
      </div>

      <nav className="px-2">
        <AnimatePresence>
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={category.href}
                className={`
                  flex items-center justify-between p-3 mb-1 rounded-lg transition-all
                  ${location.pathname === category.href
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-background-tertiary hover:text-primary'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{category.icon}</span>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium"
                      >
                        {category.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs bg-background-tertiary px-2 py-1 rounded-full"
                    >
                      {category.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>
    </aside>
  )
}
