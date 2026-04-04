import { apiClient } from '../client'
import { Tip, TipWithDetails, PaginatedResponse, TipFilters } from '../types'

export const tipsService = {
  getAllTips: async (
    page = 1,
    limit = 10,
    filters?: TipFilters
  ): Promise<PaginatedResponse<Tip>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString())
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.search) params.append('search', filters.search)
    }

    const response = await apiClient.get(`/tips?${params.toString()}`)
    return response as unknown as PaginatedResponse<Tip>
  },

  getBySignalement: async (signalementId: string): Promise<Tip[]> => {
    const response = await apiClient.get(`/signalements/${signalementId}/tips`)
    return response as unknown as Tip[]
  },

  getById: async (id: string): Promise<TipWithDetails> => {
    const response = await apiClient.get(`/tips/${id}`)
    return response as unknown as TipWithDetails
  },

  getUnverified: async (page = 1, limit = 10): Promise<PaginatedResponse<Tip>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      isVerified: 'false',
    })
    const response = await apiClient.get(`/tips?${params.toString()}`)
    return response as unknown as PaginatedResponse<Tip>
  },

  verify: async (id: string): Promise<Tip> => {
    const response = await apiClient.patch(`/tips/${id}/verify`, {})
    return response as unknown as Tip
  },

  reject: async (id: string): Promise<Tip> => {
    const response = await apiClient.patch(`/tips/${id}/reject`, {})
    return response as unknown as Tip
  },
}
