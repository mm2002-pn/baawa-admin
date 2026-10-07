import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { studentsService } from '../api/services/studentsService'
import { CreateStudentDto, UpdateStudentDto } from '../api/types'
import { useToast } from './useToast'

const errorMessage = (e: any, fallback: string) => {
  const message = e.response?.data?.message
  return (Array.isArray(message) ? message[0] : message) || fallback
}

/** Un élève porte un boîtier : le modifier peut changer les boîtiers libres et la carte. */
function invalidateStudents(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['students'] })
  qc.invalidateQueries({ queryKey: ['my-school'] })
  qc.invalidateQueries({ queryKey: ['student-positions'] })
}

export function useStudents(search?: string) {
  return useQuery({
    queryKey: ['students', search],
    queryFn: () => studentsService.getAll(search),
    placeholderData: (previous) => previous,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentsService.create(data),
    onSuccess: () => {
      invalidateStudents(qc)
      toast.success('Élève ajouté')
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'ajout")),
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) => studentsService.update(id, data),
    onSuccess: () => {
      invalidateStudents(qc)
      toast.success('Élève mis à jour')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la mise à jour')),
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => studentsService.remove(id),
    onSuccess: () => {
      invalidateStudents(qc)
      toast.success('Élève supprimé')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la suppression')),
  })
}
