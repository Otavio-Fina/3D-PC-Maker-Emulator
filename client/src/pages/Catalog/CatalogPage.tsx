import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

// Mock data
const mockComponents = [
  {
    id: 1,
    name: 'Intel Core i9-13900K',
    category: 'cpu',
    price: 4599,
    brand: 'Intel',
    specs: '24 cores (8P+16E), 5.8GHz boost',
    rating: 4.8,
    image: '/images/cpu-intel-i9.jpg',
  },
  {
    id: 2,
    name: 'AMD Ryzen 9 7950X',
    category: 'cpu',
    price: 4299,
    brand: 'AMD',
    specs: '16 cores, 5.7GHz boost',
    rating: 4.7,
    image: '/images/cpu-amd-ryzen9.jpg',
  },
  {
    id: 3,
    name: 'NVIDIA RTX 4090',
    category: 'gpu',
    price: 12999,
    brand: 'NVIDIA',
    specs: '24GB GDDR6X, DLSS 3',
    rating: 4.9,
    image: '/images/gpu-rtx4090.jpg',
  },
  {
    id: 4,
    name: 'AMD RX 7900 XTX',
    category: 'gpu',
    price: 8999,
    brand: 'AMD',
    specs: '24GB GDDR6, Ray Accelerators',
    rating: 4.6,
    image: '/images/gpu-rx7900xtx.jpg',
  },
]

function CatalogPage() {
  const { category } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedBrand, setSelectedBrand] = useState('')

  const filteredComponents = mockComponents.filter(component => {
    const matchesCategory = !category || component.category === category
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = !selectedBrand || component.brand === selectedBrand
    return matchesCategory && matchesSearch && matchesBrand
  })

  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const brands = [...new Set(mockComponents.map(c => c.brand))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-2">
          Catálogo de Componentes
        </h1>
        <p className="text-text-secondary">
          Encontre os melhores componentes para seu PC
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background-secondary rounded-xl border border-border-primary p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-4 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="">Todas as marcas</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="name">Nome</option>
            <option value="price-low">Menor preço</option>
            <option value="price-high">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
      </motion.div>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-text-secondary">
          {sortedComponents.length} componentes encontrados
        </p>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-background-tertiary text-text-primary rounded-lg hover:bg-background-hover transition-colors">
            Grid
          </button>
          <button className="px-4 py-2 text-text-muted hover:text-primary transition-colors">
            Lista
          </button>
        </div>
      </div>

      {/* Component Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedComponents.map((component, index) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-background-secondary rounded-xl border border-border-primary overflow-hidden hover:border-primary transition-colors cursor-pointer"
          >
            {/* Image */}
            <div className="h-48 bg-background-tertiary flex items-center justify-center">
              <span className="text-6xl">
                {component.category === 'cpu' ? '💻' : '🎮'}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {component.name}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {component.brand}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    R$ {component.price.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm text-text-muted">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {component.rating}
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-4">
                {component.specs}
              </p>

              <div className="flex space-x-2">
                <button className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  Adicionar ao Build
                </button>
                <button className="p-2 bg-background-tertiary text-primary rounded-lg hover:bg-background-hover transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedComponents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-background-tertiary rounded-full flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">
            Nenhum componente encontrado
          </h3>
          <p className="text-text-muted">
            Tente ajustar seus filtros ou termos de busca
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default CatalogPage
