import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '../api/services/usersService'
import { useToast } from './useToast'
import { User, CreateUserDto, UpdateUserDto, UserFilters, PaginatedResponse } from '../api/types'

export function useUsers(page = 1, limit = 10, filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', page, limit, filters],
    queryFn: () => usersService.getAll(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getById(id),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: (newUser) => {
      // Don't show toast here - let the component handle it (for officer profile creation flow)
      // Invalidate the users list to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
      return newUser
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
      toast.error(Array.isArray(message) ? message.join(', ') : message)
    },
  })
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: UpdateUserDto) => usersService.update(userId, data),
    onSuccess: (updatedUser) => {
      toast.success('Utilisateur mis à jour avec succès')
      // Invalidate both the specific user and the list
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      return updatedUser
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      toast.error(message)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (userId: string) => usersService.delete(userId),
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur'
      toast.error(message)
    },
  })
}

export function useToggleUserActive() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (userId: string) => usersService.toggleActive(userId),
    onSuccess: (updatedUser, userId) => {
      const status = updatedUser.isActive ? 'activé' : 'désactivé'
      toast.success(`Utilisateur ${status} avec succès`)
      // Invalidate both the list and the specific user
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      return updatedUser
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification du statut'
      toast.error(message)
    },
  })
}

export function useCreateOfficerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string; badgeNumber: string; rank: string; policeUnit: string }) =>
      usersService.createOfficerProfile(data.userId, {
        badgeNumber: data.badgeNumber,
        rank: data.rank,
        policeUnit: data.policeUnit,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['officers'] })
    },
  })
}
