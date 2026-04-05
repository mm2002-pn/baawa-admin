import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearchFocus, setShowSearchFocus] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-outline bg-surface dark:bg-slate-950 shadow-sm h-20">
      <div className="flex items-center justify-between h-full px-10 w-full">
        {/* Left: Direct Live Badge & Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-surface-container-high rounded-lg lg:hidden transition-colors text-on-surface-variant"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          <div className="h-4 w-[1px] bg-outline mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-2 text-secondary font-bold text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            Direct Live
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex items-center bg-surface-container-low px-5 py-2.5 rounded-full gap-3 w-96">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            onFocus={() => setShowSearchFocus(true)}
            onBlur={() => setShowSearchFocus(false)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full font-label placeholder-on-surface-variant/60"
            placeholder="Rechercher un dossier ou une zone..."
          />
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-full transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-error rounded-full border-2 border-surface"></span>
          </button>

          {/* Help */}
          <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all hidden sm:block">
            <span className="material-symbols-outlined">help</span>
          </button>

          {/* Emergency Button */}
          <button className="bg-error text-on-error px-6 py-2 rounded-lg text-sm font-bold hover:bg-on-error-container shadow-md shadow-error/10 transition-all active:scale-95 hidden sm:block">
            Emergency
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-surface-container-high px-2 py-1 rounded-lg transition-colors"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-headline font-extrabold text-on-surface leading-none mb-0.5">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none">
                  Admin
                </span>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-surface-container-highest bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-surface dark:bg-slate-900 border border-outline rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-outline">
                  <p className="text-sm font-headline font-bold text-on-surface">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">{user?.email}</p>
                </div>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors font-headline"
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-2">account_circle</span>
                  Profil
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors font-headline"
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-2">settings</span>
                  Paramètres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
