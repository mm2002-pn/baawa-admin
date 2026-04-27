import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
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
      <AdminLayout title="Éditer l'utilisateur">
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-red-600">ID utilisateur non valide</p>
        </div>
      </AdminLayout>
    )
  }

  if (userLoading) {
    return (
      <AdminLayout title="Éditer l'utilisateur">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout title="Éditer l'utilisateur">
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-red-600">Utilisateur non trouvé</p>
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
      },
      {
        onSuccess: () => {
          navigate(`/users/${id}`)
        },
      }
    )
  }

  return (
    <AdminLayout title={`Éditer: ${user.firstName} ${user.lastName}`}>
      <div className="space-y-6 max-w-2xl">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Retour aux détails
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Informations de l'utilisateur</h2>
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            isLoading={updateUserMutation.isPending}
            isEditing
          />
        </div>
      </div>
    </AdminLayout>
  )
}
