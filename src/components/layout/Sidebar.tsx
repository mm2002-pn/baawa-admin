import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/', icon: 'dashboard' },
  { label: 'Utilisateurs', href: '/users', icon: 'people' },
  { label: 'Policiers', href: '/officers', icon: 'local_police' },
  { label: 'Signalements', href: '/signalements', icon: 'person_search' },
  { label: 'Témoignages', href: '/tips', icon: 'record_voice_over' },
  { label: 'Paramètres', href: '/settings', icon: 'settings' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = () => {
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}
