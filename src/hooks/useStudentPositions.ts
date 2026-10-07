import { useQuery } from '@tanstack/react-query'
import { positionsService } from '../api/services/positionsService'

export function useStudentPositions() {
  return useQuery({
    queryKey: ['student-positions'],
    queryFn: positionsService.getPositions,
    refetchInterval: 30_000,
  })
}

/** Trajet d'un élève sur les `hours` dernières heures (désactivé si l'un des deux manque). */
export function useStudentRoute(studentId: string | null, hours: number | null) {
  return useQuery({
    queryKey: ['student-route', studentId, hours],
    queryFn: () =>
      positionsService.getRoute(studentId!, new Date(Date.now() - hours! * 3_600_000).toISOString()),
    enabled: !!studentId && !!hours,
    refetchInterval: 60_000,
  })
}
