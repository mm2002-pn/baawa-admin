import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { SchoolAccounts } from '../../components/schools/SchoolAccounts'
import { PageContainer } from '../../components/ui/kit'
import { mySchoolService } from '../../api/services/mySchoolService'
import { CreateSchoolUserDto } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function SchoolUsersPage() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const { data: users, isLoading } = useQuery({ queryKey: ['my-school', 'users'], queryFn: mySchoolService.getUsers })
  const refresh = () => qc.invalidateQueries({ queryKey: ['my-school'] })

  const createUser = useMutation({
    mutationFn: (data: CreateSchoolUserDto) => mySchoolService.createUser(data),
    onSuccess: () => {
      refresh()
      toast.success('Compte créé — notez le mot de passe temporaire affiché')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors de la création'),
  })

  const toggleUser = useMutation({
    mutationFn: (id: string) => mySchoolService.toggleUser(id),
    onSuccess: (user) => {
      refresh()
      toast.success(user.isActive ? 'Compte réactivé' : 'Compte désactivé')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors du changement de statut'),
  })

  return (
    <AdminLayout title="Utilisateurs de mon école">
      <PageContainer>
        <SchoolAccounts
          users={users}
          isLoading={isLoading}
          onCreate={(data) => createUser.mutateAsync(data) as Promise<any>}
          creating={createUser.isPending}
          onToggle={(id) => toggleUser.mutateAsync(id)}
          toggling={toggleUser.isPending}
        />
      </PageContainer>
    </AdminLayout>
  )
}
