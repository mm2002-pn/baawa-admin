import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { useToast } from './useToast'

export interface MissingPerson {
  id: string
  fullName: string
  age: number
  gender: 'MASCULIN' | 'FEMININ' | 'AUTRE'
  photoUrl: string
  disappearanceDate: string
  disappearanceTime: string
  lastLatitude: number
  lastLongitude: number
  lastAddress: string
  region: string
  clothingDescription: string
  status: 'URGENT' | 'INFO_RECUE' | 'STANDARD' | 'RESOLVED'
  viewCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface Signalement {
  id: string
  missingPersonId: string
  reporterId: string
  relationship: string
  phoneNumber: string
  policeReportNumber?: string
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'VERIFIED' | 'ARCHIVED'
  createdAt: string
  publishedAt?: string
  verifiedAt?: string
  updatedAt: string
  missingPerson?: MissingPerson
  reporter?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }
  tips?: Array<{
    id: string
    description: string
    isVerified: boolean
    createdAt: string
  }>
}

export interface SignalementsResponse {
  data: Signalement[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

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
