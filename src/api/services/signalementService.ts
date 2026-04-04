import { apiClient } from '../client'
import {
  Signalement,
  SignalementWithDetails,
  PaginatedResponse,
  DashboardStats,
  SignalementFilters,
} from '../types'

export const signalementService = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: SignalementFilters
  ): Promise<PaginatedResponse<Signalement>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      if (filters.status) params.append('status', filters.status)
      if (filters.alertStatus) params.append('alertStatus', filters.alertStatus)
      if (filters.region) params.append('region', filters.region)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.search) params.append('search', filters.search)
    }

    const response = await apiClient.get(`/signalements?${params.toString()}`)
    return response as unknown as PaginatedResponse<Signalement>
  },

  getById: async (id: string): Promise<SignalementWithDetails> => {
    const response = await apiClient.get(`/signalements/${id}`)
    return response as unknown as SignalementWithDetails
  },

  getForMap: async (filters?: SignalementFilters): Promise<Signalement[]> => {
    const params = new URLSearchParams()

    if (filters) {
      if (filters.status) params.append('status', filters.status)
      if (filters.alertStatus) params.append('alertStatus', filters.alertStatus)
      if (filters.region) params.append('region', filters.region)
    }

    const response = await apiClient.get(`/signalements/map?${params.toString()}`)
    return response as unknown as Signalement[]
  },

  getByRegion: async (region: string): Promise<Signalement[]> => {
    const response = await apiClient.get(`/signalements/region/${region}`)
    return response as unknown as Signalement[]
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/signalements/dashboard/stats')
    return response as unknown as DashboardStats
  },

  verify: async (id: string): Promise<Signalement> => {
    const response = await apiClient.patch(`/signalements/${id}/verify`, {})
    return response as unknown as Signalement
  },

  resolve: async (id: string): Promise<Signalement> => {
    const response = await apiClient.patch(`/signalements/${id}/resolve`, {})
    return response as unknown as Signalement
  },

  archive: async (id: string): Promise<Signalement> => {
    const response = await apiClient.patch(`/signalements/${id}/archive`, {})
    return response as unknown as Signalement
  },
}
