import { apiClient } from '../client'
import { AppNotification } from '../types'

// Le ResponseInterceptor backend enveloppe tout dans { success, message, data }.
// L'intercepteur axios renvoie déjà response.data (l'enveloppe), donc on lit `.data`.
export const notificationsService = {
  getAll: async (): Promise<AppNotification[]> => {
    const res = await apiClient.get('/notifications')
    return ((res as any).data ?? []) as AppNotification[]
  },

  markAsRead: async (id: string): Promise<AppNotification> => {
    const res = await apiClient.patch(`/notifications/${id}/read`)
    return (res as any).data as AppNotification
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all')
  },
}
