import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { lazy, Suspense } from 'react'

// Pages
import LoginPage from '../pages/auth/Login'
import DashboardPage from '../pages/Dashboard'

// Lazy loaded pages (will be created)
const UsersPage = lazy(() => import('../pages/users/UsersList'))
const OfficersPage = lazy(() => import('../pages/officers/OfficersList'))
const SignalementsPage = lazy(() => import('../pages/signalements/SignalementsList'))
const TipsPage = lazy(() => import('../pages/tips/TipsList'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <UsersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/officers',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <OfficersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/signalements',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <SignalementsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tips',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <TipsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
