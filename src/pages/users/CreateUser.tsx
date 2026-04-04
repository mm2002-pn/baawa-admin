import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'
import { Button } from '../../components/common/Button/Button'
import { UserForm } from '../../components/UserForm'
import { useCreateUser } from '../../hooks/useUsers'
import { CreateUserFormData } from '../../schemas/userSchema'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const createUserMutation = useCreateUser()

  const handleSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        zoneGeo: data.zoneGeo,
        ...(data.badgeNumber && {
          officer: {
            badgeNumber: data.badgeNumber,
            rank: data.rank!,
            policeUnit: data.policeUnit!,
          },
        }),
      },
      {
        onSuccess: () => {
          navigate('/users')
        },
      }
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Créer un utilisateur</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Remplissez le formulaire ci-dessous pour créer un nouvel utilisateur
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="secondary" onClick={() => navigate('/users')}>
            ← Retour à la liste
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSubmit={handleSubmit} isLoading={createUserMutation.isPending} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
