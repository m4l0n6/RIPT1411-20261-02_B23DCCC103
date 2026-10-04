import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/skeleton'
// Mỗi route là một chunk riêng để 2 trang không "dính" code của nhau khi đo.
// (Bên trong trang /unoptimise, Recharts + dialog vẫn import tĩnh có chủ đích.)
const UnoptimisedProductsPage = lazy(() => import('@/pages/unoptimised/UnoptimisedProductsPage'))
const ProductsPage = lazy(() => import('@/pages/products/ProductsPage'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))

const PageFallback = () => (
  <div className="mx-auto flex max-w-6xl flex-col gap-6">
    <Skeleton className="h-12 w-60" />
    <Skeleton className="h-28" />
    <Skeleton className="h-[560px]" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Suspense fallback={<PageFallback />}><ProductsPage /></Suspense>} />
          <Route path="/users" element={<Suspense fallback={<PageFallback />}><UsersPage /></Suspense>} />
          <Route path="/unoptimise" element={<Suspense fallback={<PageFallback />}><UnoptimisedProductsPage /></Suspense>} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
