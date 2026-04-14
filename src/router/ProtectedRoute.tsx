import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Role } from '../api/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

// Roles allowed to access the admin panel
const ADMIN_ROLES = [Role.ADMIN_BAAWA, Role.POLICIER]

export function ProtectedRoute({ children, allowedRoles = ADMIN_ROLES }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    // CITOYEN users cannot access admin panel
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
