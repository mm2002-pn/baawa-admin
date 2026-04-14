import { useQuery } from '@tanstack/react-query'
import { statsService, DashboardStatsResponse, RegionStatsItem } from '../api/services/statsService'

export function useDashboardStats() {
  return useQuery<DashboardStatsResponse>({
    queryKey: ['dashboard-stats'],
    queryFn: statsService.getDashboardStats,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
  })
}

export function useRegionStats() {
  return useQuery<RegionStatsItem[]>({
    queryKey: ['region-stats'],
    queryFn: statsService.getRegionStats,
    staleTime: 60 * 1000, // 1 minute
  })
}
