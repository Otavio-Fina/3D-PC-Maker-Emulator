import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Header() {
  const location = useLocation()

  const navigation = [
    { name: 'Builder', href: '/builder' },
    { name: 'Catálogo', href: '/catalog' },
    { name: 'Comparar', href: '/compare' },
  ]

  return (
    <header className="bg-background-secondary border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">3D</span>
            </div>
            <span className="text-text-primary font-semibold text-lg">
              PC Maker
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative text-text-secondary hover:text-primary transition-colors"
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-text-secondary hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 text-text-secondary hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
