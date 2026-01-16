import { useState } from 'react'
import { motion } from 'framer-motion'

interface Component {
  id: string
  name: string
  price: number
  brand: string
  specs: string
  category: string
}

interface SelectedComponents {
  cpu: Component | null
  gpu: Component | null
  ram: Component | null
  storage: Component | null
  motherboard: Component | null
  psu: Component | null
  cooling: Component | null
  case: Component | null
}

function BuilderPage() {
  const [selectedComponents] = useState<SelectedComponents>({
    cpu: null,
    gpu: null,
    ram: null,
    storage: null,
    motherboard: null,
    psu: null,
    cooling: null,
    case: null,
  })


  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, component) => sum + (component?.price || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary mb-4">
          Montar seu PC 3D
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Escolha os componentes e veja seu PC ganhar vida em 3D. Verifique a compatibilidade 
          e o preço em tempo real.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6 h-[600px]">
            <div className="h-full bg-background-tertiary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🖥️</span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Visualizador 3D
                </h3>
                <p className="text-text-muted">
                  O visualizador 3D aparecerá aqui
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Component Selection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Price Summary */}
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Resumo do Build
            </h3>
            <div className="space-y-3">
              {Object.entries(selectedComponents).map(([key, component]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-text-secondary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-text-primary font-medium">
                    {component ? `R$ ${component.price.toLocaleString()}` : 'Não selecionado'}
                  </span>
                </div>
              ))}
              <div className="border-t border-border-primary pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-primary">Total</span>
                  <span className="text-lg font-bold text-primary">
                    R$ {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Component Categories */}
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Componentes
            </h3>
            <div className="space-y-2">
              {Object.entries(selectedComponents).map(([key, component]) => (
                <button
                  key={key}
                  className="w-full text-left p-3 rounded-lg bg-background-tertiary hover:bg-background-hover transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs text-text-muted">
                      {component ? '✓ Selecionado' : '+ Adicionar'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Salvar Build
            </button>
            <button className="w-full py-3 bg-background-tertiary text-primary rounded-lg font-medium hover:bg-background-hover transition-colors">
              Comparar Builds
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BuilderPage
