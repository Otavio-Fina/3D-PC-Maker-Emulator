import { useState } from 'react'
import { motion } from 'framer-motion'

// Mock builds data
const mockBuilds = [
  {
    id: 1,
    name: 'Gaming High-End',
    price: 15499,
    components: {
      cpu: 'Intel Core i9-13900K',
      gpu: 'NVIDIA RTX 4090',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe SSD',
      motherboard: 'ASUS ROG Maximus',
      psu: 'Corsair 1000W 80+ Gold',
      cooling: 'NZXT Kraken 360',
      case: 'Lian Li O11 Dynamic',
    },
    performance: {
      gaming: 95,
      productivity: 88,
      value: 72,
    },
  },
  {
    id: 2,
    name: 'Productivity Pro',
    price: 12999,
    components: {
      cpu: 'AMD Ryzen 9 7950X',
      gpu: 'NVIDIA RTX 4070 Ti',
      ram: '64GB DDR5 6000MHz',
      storage: '4TB NVMe SSD',
      motherboard: 'MSI Creator X670',
      psu: 'Seasonic 850W 80+ Gold',
      cooling: 'Noctua NH-D15',
      case: 'Fractal Design Meshify',
    },
    performance: {
      gaming: 82,
      productivity: 94,
      value: 78,
    },
  },
  {
    id: 3,
    name: 'Budget Gaming',
    price: 6999,
    components: {
      cpu: 'Intel Core i5-13600K',
      gpu: 'NVIDIA RTX 4060',
      ram: '16GB DDR5 5600MHz',
      storage: '1TB NVMe SSD',
      motherboard: 'ASUS TUF Gaming',
      psu: 'Corsair 650W 80+ Bronze',
      cooling: 'Stock Cooler',
      case: 'Cooler Master MasterBox',
    },
    performance: {
      gaming: 75,
      productivity: 68,
      value: 89,
    },
  },
]

function ComparePage() {
  const [selectedBuilds, setSelectedBuilds] = useState<number[]>([])
  const [comparisonMode, setComparisonMode] = useState(false)

  const toggleBuildSelection = (buildId: number) => {
    setSelectedBuilds(prev => {
      if (prev.includes(buildId)) {
        return prev.filter(id => id !== buildId)
      } else if (prev.length < 3) {
        return [...prev, buildId]
      }
      return prev
    })
  }

  const selectedBuildsData = mockBuilds.filter(build => selectedBuilds.includes(build.id))

  const PerformanceBar = ({ value, color }: { value: number; color: string }) => (
    <div className="w-full bg-background-tertiary rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5 }}
        className={`h-2 rounded-full ${color}`}
      />
    </div>
  )

  if (comparisonMode && selectedBuilds.length >= 2) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Comparação de Builds
            </h1>
            <p className="text-text-secondary">
              Comparando {selectedBuilds.length} configurações
            </p>
          </div>
          <button
            onClick={() => setComparisonMode(false)}
            className="px-4 py-2 bg-background-tertiary text-primary rounded-lg hover:bg-background-hover transition-colors"
          >
            Voltar
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-background-secondary rounded-xl border border-border-primary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-tertiary">
                <tr>
                  <th className="text-left p-4 text-text-primary font-semibold">
                    Componente
                  </th>
                  {selectedBuildsData.map(build => (
                    <th key={build.id} className="text-left p-4 text-text-primary font-semibold">
                      {build.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {/* Price */}
                <tr>
                  <td className="p-4 text-text-secondary font-medium">Preço</td>
                  {selectedBuildsData.map(build => (
                    <td key={build.id} className="p-4">
                      <span className="text-lg font-bold text-primary">
                        R$ {build.price.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Components */}
                {Object.keys(mockBuilds[0].components).map(component => (
                  <tr key={component}>
                    <td className="p-4 text-text-secondary font-medium capitalize">
                      {component.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {selectedBuildsData.map(build => (
                      <td key={build.id} className="p-4 text-text-primary">
                        {build.components[component as keyof typeof build.components]}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Performance */}
                <tr>
                  <td className="p-4 text-text-secondary font-medium">Performance</td>
                  {selectedBuildsData.map(build => (
                    <td key={build.id} className="p-4">
                      <div className="space-y-3">
                        {Object.entries(build.performance).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-text-secondary capitalize">
                                {key === 'gaming' ? 'Gaming' : key === 'productivity' ? 'Produtividade' : 'Custo-benefício'}
                              </span>
                              <span className="text-text-primary font-medium">{value}%</span>
                            </div>
                            <PerformanceBar
                              value={value}
                              color={value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'}
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-2">
          Comparar Builds
        </h1>
        <p className="text-text-secondary">
          Selecione até 3 builds para comparar lado a lado
        </p>
      </motion.div>

      {/* Selection Bar */}
      {selectedBuilds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background-secondary rounded-xl border border-border-primary p-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-text-primary font-medium">
                {selectedBuilds.length} build{selectedBuilds.length > 1 ? 's' : ''} selecionado{selectedBuilds.length > 1 ? 's' : ''}
              </p>
              <p className="text-text-muted text-sm">
                {selectedBuilds.length >= 2 
                  ? 'Clique em "Comparar" para ver a análise detalhada'
                  : `Selecione mais ${2 - selectedBuilds.length} build(s) para comparar`
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedBuilds([])}
                className="px-4 py-2 text-text-muted hover:text-primary transition-colors"
              >
                Limpar seleção
              </button>
              {selectedBuilds.length >= 2 && (
                <button
                  onClick={() => setComparisonMode(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Comparar ({selectedBuilds.length})
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Builds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBuilds.map((build, index) => (
          <motion.div
            key={build.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-background-secondary rounded-xl border-2 transition-all cursor-pointer ${
              selectedBuilds.includes(build.id)
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-border-primary hover:border-primary'
            }`}
            onClick={() => toggleBuildSelection(build.id)}
          >
            {/* Header */}
            <div className="p-6 border-b border-border-primary">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-primary">
                  {build.name}
                </h3>
                {selectedBuilds.includes(build.id) && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-primary">
                R$ {build.price.toLocaleString()}
              </p>
            </div>

            {/* Components */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-text-secondary mb-3">Componentes principais:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">CPU:</span>
                  <span className="text-text-primary">{build.components.cpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">GPU:</span>
                  <span className="text-text-primary">{build.components.gpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">RAM:</span>
                  <span className="text-text-primary">{build.components.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Storage:</span>
                  <span className="text-text-primary">{build.components.storage}</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="p-6 border-t border-border-primary">
              <h4 className="text-sm font-medium text-text-secondary mb-3">Performance:</h4>
              <div className="space-y-2">
                {Object.entries(build.performance).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted capitalize">
                        {key === 'gaming' ? 'Gaming' : key === 'productivity' ? 'Produtividade' : 'Custo-benefício'}
                      </span>
                      <span className="text-text-primary font-medium">{value}%</span>
                    </div>
                    <PerformanceBar
                      value={value}
                      color={value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ComparePage
