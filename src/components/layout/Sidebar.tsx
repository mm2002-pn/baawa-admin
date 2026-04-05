import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../store/authStore'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    href: '/',
    icon: 'dashboard',
  },
  {
    label: 'Cartographie',
    href: '/map',
    icon: 'map',
  },
  {
    label: 'Dossiers actifs',
    href: '/cases',
    icon: 'person_search',
  },
  {
    label: 'Ressources',
    href: '/resources',
    icon: 'folder_shared',
  },
  {
    label: 'Paramètres',
    href: '/settings',
    icon: 'settings',
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Material Design 3 style */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-72 border-r border-outline bg-surface dark:bg-slate-950 transition-transform duration-300 z-40 lg:relative lg:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo & Header */}
        <div className="flex flex-col gap-2 px-6 py-6 border-b border-outline">
          <div className="h-14 w-auto object-contain flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-headline font-bold text-xl">
              BA
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-sm font-extrabold text-on-surface font-headline uppercase tracking-tight">
              Centre de Commandement
            </h2>
            <p className="text-[10px] text-on-surface-variant font-label tracking-widest uppercase font-semibold">
              Unité de Recherche
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-bold transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                )}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto space-y-4 px-4 py-6 border-t border-outline">
          <button className="w-full py-3.5 px-4 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-dark transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">add_alert</span>
            Signaler une disparition
          </button>
          <div className="pt-4 border-t border-outline">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all duration-200 font-headline"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-bold">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
