import { useAuthStore } from '../../store/authStore'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuthStore()

  return (
    <header className="flex justify-between items-center h-16 px-6 lg:px-8 w-full sticky top-0 z-40 bg-white border-b border-slate-100">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {title && (
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        )}

        <div className="hidden sm:flex items-center gap-2 text-green-600 font-semibold text-xs bg-green-50 px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>En ligne</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
