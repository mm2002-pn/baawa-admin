import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../api/services/authService'
import { Role } from '../../api/types'

interface NavItem {
  label: string
  href: string
  icon: string
  roles: Role[]
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/', icon: 'dashboard', roles: [Role.ADMIN_BAAWA, Role.POLICIER] },
  { label: 'Utilisateurs', href: '/users', icon: 'people', roles: [Role.ADMIN_BAAWA] },
  { label: 'Policiers', href: '/officers', icon: 'local_police', roles: [Role.ADMIN_BAAWA] },
  { label: 'Signalements', href: '/signalements', icon: 'person_search', roles: [Role.ADMIN_BAAWA, Role.POLICIER] },
  { label: 'Témoignages', href: '/tips', icon: 'record_voice_over', roles: [Role.ADMIN_BAAWA, Role.POLICIER] },
  { label: 'Écoles', href: '/schools', icon: 'school', roles: [Role.ADMIN_BAAWA] },
  { label: 'Mon école', href: '/my-school', icon: 'school', roles: [Role.ADMIN_SCHOOL] },
  { label: 'Élèves', href: '/students', icon: 'groups', roles: [Role.ADMIN_SCHOOL] },
  { label: 'Utilisateurs', href: '/school-users', icon: 'people', roles: [Role.ADMIN_SCHOOL] },
  { label: 'Paramètres', href: '/settings', icon: 'settings', roles: [Role.ADMIN_BAAWA] },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const navItems = ALL_NAV_ITEMS.filter(
    (item) => !user?.role || item.roles.includes(user.role as Role),
  )
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Best-effort: revoke refresh token server-side. Local state is cleared either way.
    try {
      await authService.logout()
    } catch {
      // ignore — user is logging out anyway
    }
    logout()
    window.location.href = '/login'
  }

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full flex flex-col p-6 bg-white w-72 flex-shrink-0 z-50 border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Header */}
        <div className="flex flex-col gap-2 mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">shield</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                BAAWA
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto space-y-4">
          {user?.role !== Role.ADMIN_SCHOOL && (
            <button
              onClick={() => {
                navigate('/signalements/create')
                onClose?.()
              }}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_alert</span>
              Nouveau signalement
            </button>
          )}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-100">
              <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-red-600 text-[28px]">logout</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Se déconnecter ?
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {user?.firstName ? (
                  <>Vous êtes connecté en tant que <strong className="text-slate-700">{user.firstName} {user.lastName}</strong>.<br /></>
                ) : null}
                Votre session sera terminée et vous serez redirigé vers la page de connexion.
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 flex gap-3 bg-slate-50/50">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Déconnexion...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
