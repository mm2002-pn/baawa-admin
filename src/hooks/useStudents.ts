import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsService } from '../api/services/studentsService'
import { CreateStudentDto, UpdateStudentDto } from '../api/types'
import { useToast } from './useToast'

export function useStudents(search?: string) {
  return useQuery({
    queryKey: ['students', search],
    queryFn: () => studentsService.getAll(search),
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast.success('Élève ajouté')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Erreur lors de l'ajout"),
  })
}

export function useUpdateStudent(id: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: UpdateStudentDto) => studentsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast.success('Élève mis à jour')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors de la mise à jour'),
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => studentsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast.success('Élève supprimé')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors de la suppression'),
  })
}
