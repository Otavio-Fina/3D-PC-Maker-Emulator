import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Layout } from '@/components/layout/Layout'

// Lazy load pages for better performance
const BuilderPage = lazy(() => import('@/pages/Builder/BuilderPage'))
const CatalogPage = lazy(() => import('@/pages/Catalog/CatalogPage'))
const ComparePage = lazy(() => import('@/pages/Compare/ComparePage'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

function App() {
  return (
    <div className="app">
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<BuilderPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:category" element={<CatalogPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  )
}

export default App
