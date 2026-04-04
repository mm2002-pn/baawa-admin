import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Role } from '../api/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: Role
}

export function ProtectedRoute({ children, requiredRole = Role.ADMIN_BAAWA }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
