import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { officersService, Officer, CreateOfficerDto, UpdateOfficerDto } from '../api/services/officersService'

export function useOfficers() {
  return useQuery<Officer[]>({
    queryKey: ['officers'],
    queryFn: officersService.getAll,
  })
}

export function useOfficer(userId: string) {
  return useQuery<Officer>({
    queryKey: ['officer', userId],
    queryFn: () => officersService.getByUserId(userId),
    enabled: !!userId,
  })
}

export function useCreateOfficer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateOfficerDto }) =>
      officersService.create(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officers'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateOfficer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateOfficerDto }) =>
      officersService.update(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['officers'] })
      queryClient.invalidateQueries({ queryKey: ['officer', variables.userId] })
    },
  })
}

export function useDeleteOfficer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => officersService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officers'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
