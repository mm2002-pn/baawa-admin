import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { lazy, Suspense } from 'react'
import { Role } from '../api/types'

// Pages
import LoginPage from '../pages/auth/Login'
import DashboardPage from '../pages/Dashboard'

// Lazy loaded pages
const UsersPage = lazy(() => import('../pages/users/UsersList'))
const CreateUserPage = lazy(() => import('../pages/users/CreateUser'))
const EditUserPage = lazy(() => import('../pages/users/EditUser'))
const UserDetailsPage = lazy(() => import('../pages/users/UserDetails'))
const OfficersPage = lazy(() => import('../pages/officers/OfficersList'))
const SignalementsPage = lazy(() => import('../pages/signalements/SignalementsList'))
const CreateSignalementPage = lazy(() => import('../pages/signalements/CreateSignalement'))
const SignalementDetailsPage = lazy(() => import('../pages/signalements/SignalementDetails'))
const TipsPage = lazy(() => import('../pages/tips/TipsList'))
const SettingsPage = lazy(() => import('../pages/Settings'))
const SchoolsPage = lazy(() => import('../pages/schools/SchoolsList'))
const SchoolDetailsAdminPage = lazy(() => import('../pages/schools/SchoolDetails'))
const StudentsPage = lazy(() => import('../pages/school/StudentsList'))
const MySchoolPage = lazy(() => import('../pages/school/MySchool'))
const SchoolUsersPage = lazy(() => import('../pages/school/SchoolUsers'))
const MapViewPage = lazy(() => import('../pages/school/MapView'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA, Role.POLICIER]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}>
          <UsersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/create',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}>
          <CreateUserPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}>
          <UserDetailsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:id/edit',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}>
          <EditUserPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/officers',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}>
          <OfficersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/cases',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA, Role.POLICIER]}>
        <Suspense fallback={<LoadingFallback />}>
          <SignalementsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/signalements',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA, Role.POLICIER]}>
        <Suspense fallback={<LoadingFallback />}>
          <SignalementsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/signalements/create',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA, Role.POLICIER]}>
        <Suspense fallback={<LoadingFallback />}>
          <CreateSignalementPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/signalements/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA, Role.POLICIER]}>
        <Suspense fallback={<LoadingFallback />}>
          <SignalementDetailsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tips',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA, Role.POLICIER]}>
        <Suspense fallback={<LoadingFallback />}>
          <TipsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}>
          <SettingsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/schools',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}><SchoolsPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/schools/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_BAAWA]}>
        <Suspense fallback={<LoadingFallback />}><SchoolDetailsAdminPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/students',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_SCHOOL]}>
        <Suspense fallback={<LoadingFallback />}><StudentsPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-school',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_SCHOOL]}>
        <Suspense fallback={<LoadingFallback />}><MySchoolPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/school-users',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_SCHOOL]}>
        <Suspense fallback={<LoadingFallback />}><SchoolUsersPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/map',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN_SCHOOL]}>
        <Suspense fallback={<LoadingFallback />}><MapViewPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
