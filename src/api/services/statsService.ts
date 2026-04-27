import { apiClient } from '../client'

export interface DashboardStatsResponse {
  overview: {
    totalUsers: number
    totalSignalements: number
    activeAlerts: number
    resolvedAlerts30j: number
    successRate: string
  }
  recentAlerts: Array<{
    id: string
    status: string
    createdAt: string
    missingPerson: {
      id: string
      fullName: string
      age: number
      region: string
      status: string
      photoUrl: string
      lastLatitude?: number
      lastLongitude?: number
      lastAddress?: string
    }
  }>
}

export interface RegionStatsItem {
  region: string
  activeAlertsCount: number
}

export const statsService = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get('/stats/dashboard')
    return response as unknown as DashboardStatsResponse
  },

  getRegionStats: async (): Promise<RegionStatsItem[]> => {
    const response = await apiClient.get('/stats/regions')
    return response as unknown as RegionStatsItem[]
  },
}
