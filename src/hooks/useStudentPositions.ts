import { useQuery } from '@tanstack/react-query'
import { positionsService } from '../api/services/positionsService'

export function useStudentPositions() {
  return useQuery({
    queryKey: ['student-positions'],
    queryFn: positionsService.getPositions,
    refetchInterval: 30_000,
  })
}
