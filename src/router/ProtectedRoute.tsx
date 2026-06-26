import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Role } from '../api/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

// Tous les rôles pouvant accéder à une partie quelconque du panel
const PANEL_ROLES = [Role.ADMIN_BAAWA, Role.POLICIER, Role.ADMIN_SCHOOL]

export function ProtectedRoute({ children, allowedRoles = PANEL_ROLES }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    // Rediriger un école vers ses élèves, sinon vers l'accueil
    const fallback = user.role === Role.ADMIN_SCHOOL ? '/students' : '/'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
