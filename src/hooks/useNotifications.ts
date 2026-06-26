import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '../api/services/notificationsService'
import { AppNotification } from '../api/types'

const QUERY_KEY = ['notifications']

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: notificationsService.getAll,
    // Filet de sécurité si le WebSocket est indisponible
    refetchInterval: 60_000,
  })

  const unreadCount = notifications.filter((n: AppNotification) => !n.isRead).length

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const markAllAsRead = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
  }
}
