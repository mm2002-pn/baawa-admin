import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { temoignageService, Temoignage, CreateTemoignageDto } from '../api/services/temoignageService'

export function useTemoignagesBySignalement(signalementId: string) {
  return useQuery<Temoignage[]>({
    queryKey: ['temoignages', signalementId],
    queryFn: () => temoignageService.getBySignalement(signalementId),
    enabled: !!signalementId,
  })
}

export function useCreateTemoignage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTemoignageDto) => temoignageService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['temoignages', variables.signalementId] })
      queryClient.invalidateQueries({ queryKey: ['signalement', variables.signalementId] })
    },
  })
}

export function useVerifyTemoignage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => temoignageService.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temoignages'] })
    },
  })
}
