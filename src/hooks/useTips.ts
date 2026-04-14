import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { temoignageService, Temoignage } from '../api/services/temoignageService'

export function useTipsBySignalement(signalementId: string) {
  return useQuery<Temoignage[]>({
    queryKey: ['tips', signalementId],
    queryFn: () => temoignageService.getBySignalement(signalementId),
    enabled: !!signalementId,
  })
}

export function useVerifyTip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => temoignageService.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] })
      queryClient.invalidateQueries({ queryKey: ['signalements'] })
    },
  })
}
