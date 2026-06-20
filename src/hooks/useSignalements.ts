import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { signalementService } from '../api/services/signalementService'
import { useToast } from './useToast'
import { Signalement, PaginatedResponse } from '../api/types'

export type SignalementsResponse = PaginatedResponse<Signalement>

export const useSignalements = (
  page: number = 1,
  limit: number = 10,
  filters?: {
    search?: string
    status?: string
    region?: string
    alertStatus?: string
  }
) => {
  return useQuery({
    queryKey: ['signalements', page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (filters?.search) params.append('search', filters.search)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.region) params.append('region', filters.region)
      if (filters?.alertStatus) params.append('alertStatus', filters.alertStatus)

      const response = await apiClient.get(`/signalements?${params.toString()}`)
      return (response as any).data as SignalementsResponse
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export const useSignalement = (id: string) => {
  return useQuery({
    queryKey: ['signalement', id],
    queryFn: async () => {
      const response = await apiClient.get(`/signalements/${id}`)
      return (response as any).data as Signalement
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

export const useVerifySignalement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/signalements/${id}/verify`, {})
      return (response as any).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] })
      toast.success('Signalement vérifié avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la vérification du signalement')
    },
  })
}

export const useResolveSignalement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/signalements/${id}/resolve`, {})
      return (response as any).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] })
      toast.success('Signalement résolu avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la résolution du signalement')
    },
  })
}

export const useMarkPersonAsFound = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (personId: string) => signalementService.markPersonAsFound(personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] })
      queryClient.invalidateQueries({ queryKey: ['signalement'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Personne marquée comme retrouvée. Tous les signalements liés sont archivés.')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du marquage'
      toast.error(typeof message === 'string' ? message : 'Erreur lors du marquage')
    },
  })
}

export const useDeleteSignalement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/signalements/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] })
      toast.success('Signalement supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du signalement')
    },
  })
}
