import { ReactNode, useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  backTo?: string
}

export function AdminLayout({ children, title, backTo }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Connexion WebSocket temps réel (notifications + alertes Command Center)
  useRealtimeNotifications()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title={title} backTo={backTo} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
