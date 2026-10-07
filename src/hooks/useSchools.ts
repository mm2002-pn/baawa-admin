import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolsService } from '../api/services/schoolsService'
import { CreateSchoolDto, CreateSchoolUserDto } from '../api/types'
import { useToast } from './useToast'

const errorMessage = (e: any, fallback: string) => {
  const message = e.response?.data?.message
  return (Array.isArray(message) ? message[0] : message) || fallback
}

export function useSchools(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ['schools', page, limit, search],
    queryFn: () => schoolsService.getAll(page, limit, search),
    placeholderData: (previous) => previous,
  })
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: ['schools', id],
    queryFn: () => schoolsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSchool() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateSchoolDto) => schoolsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schools'] })
      toast.success('École créée')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la création')),
  })
}

export function useUpdateSchool(id: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: Partial<CreateSchoolDto>) => schoolsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schools'] })
      toast.success('École mise à jour')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la mise à jour')),
  })
}

export function useToggleSchool(id: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: () => schoolsService.toggleActive(id),
    onSuccess: (school) => {
      qc.invalidateQueries({ queryKey: ['schools'] })
      toast.success(school.isActive ? 'École réactivée' : 'École désactivée')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors du changement de statut')),
  })
}

export function useDeleteSchool() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => schoolsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schools'] })
      qc.invalidateQueries({ queryKey: ['trackers'] })
      toast.success('École supprimée')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la suppression')),
  })
}

export function useCreateSchoolAdmin(schoolId: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateSchoolUserDto) => schoolsService.createAdmin(schoolId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schools', schoolId] })
      toast.success('Compte créé — notez le mot de passe temporaire affiché')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la création du compte')),
  })
}

export function useSchoolUsers(schoolId: string) {
  return useQuery({
    queryKey: ['schools', schoolId, 'users'],
    queryFn: () => schoolsService.getUsers(schoolId),
    enabled: !!schoolId,
  })
}

export function useToggleSchoolUser(schoolId: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (userId: string) => schoolsService.toggleUser(schoolId, userId),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: ['schools', schoolId, 'users'] })
      toast.success(user.isActive ? 'Compte réactivé' : 'Compte désactivé')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors du changement de statut')),
  })
}

export function useSchoolStudents(schoolId: string) {
  return useQuery({
    queryKey: ['schools', schoolId, 'students'],
    queryFn: () => schoolsService.getStudents(schoolId),
    enabled: !!schoolId,
  })
}
