import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolsService } from '../api/services/schoolsService'
import { CreateSchoolDto, CreateSchoolUserDto } from '../api/types'
import { useToast } from './useToast'

export function useSchools(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ['schools', page, limit, search],
    queryFn: () => schoolsService.getAll(page, limit, search),
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
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors de la création'),
  })
}

export function useCreateSchoolAdmin(schoolId: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateSchoolUserDto) => schoolsService.createAdmin(schoolId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schools', schoolId] })
      toast.success('Compte admin créé — notez le mot de passe temporaire affiché')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors de la création du compte'),
  })
}

export function useSchoolStudents(schoolId: string) {
  return useQuery({
    queryKey: ['schools', schoolId, 'students'],
    queryFn: () => schoolsService.getStudents(schoolId),
    enabled: !!schoolId,
  })
}
