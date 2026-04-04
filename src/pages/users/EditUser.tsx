import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'
import { Button } from '../../components/common/Button/Button'
import { UserForm } from '../../components/UserForm'
import { useUser, useUpdateUser } from '../../hooks/useUsers'
import { CreateUserFormData } from '../../schemas/userSchema'

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading: userLoading } = useUser(id!)
  const updateUserMutation = useUpdateUser(id!)

  if (!id) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">ID utilisateur non valide</p>
        </div>
      </AdminLayout>
    )
  }

  if (userLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Utilisateur non trouvé</p>
        </div>
      </AdminLayout>
    )
  }

  const handleSubmit = (data: CreateUserFormData) => {
    updateUserMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        zoneGeo: data.zoneGeo,
      },
      {
        onSuccess: () => {
          navigate(`/users/${id}`)
        },
      }
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Éditer l'utilisateur</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="secondary" onClick={() => navigate(`/users/${id}`)}>
            ← Retour aux détails
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              initialData={user}
              onSubmit={handleSubmit}
              isLoading={updateUserMutation.isPending}
              isEditing
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
