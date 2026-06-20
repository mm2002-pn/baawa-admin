import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNotifications } from '../../hooks/useNotifications'
import { AppNotification } from '../../api/types'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  return `il y a ${days} j`
}

const typeStyles: Record<string, string> = {
  ALERT: 'bg-red-100 text-red-600',
  SUCCESS: 'bg-green-100 text-green-600',
  INFO: 'bg-blue-100 text-blue-600',
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuthStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le menu au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 max-h-[28rem] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg flex flex-col z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-bold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">
                    Aucune notification
                  </p>
                ) : (
                  notifications.map((n: AppNotification) => (
                    <button
                      key={n.id}
                      onClick={() => !n.isRead && markAsRead(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 flex gap-3 ${
                        n.isRead ? 'opacity-60' : ''
                      }`}
                    >
                      <span
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          n.isRead ? 'bg-transparent' : 'bg-blue-500'
                        }`}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-slate-800 truncate">
                            {n.title}
                          </span>
                          <span
                            className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              typeStyles[n.type] ?? 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {n.type}
                          </span>
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">{n.message}</span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
