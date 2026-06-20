import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { UserForm } from '../../components/UserForm'
import { useCreateUser, useCreateOfficerProfile } from '../../hooks/useUsers'
import { CreateUserFormData } from '../../schemas/userSchema'
import { useToast } from '../../hooks/useToast'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createUserMutation = useCreateUser()
  const createOfficerMutation = useCreateOfficerProfile()

  const handleSubmit = async (data: CreateUserFormData) => {
    // First create the user
    createUserMutation.mutate(
      {
        email: data.email,
        password: data.password!,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: data.role,
      },
      {
        onSuccess: (response) => {
          // If role is POLICIER, create officer profile
          if (data.role === 'POLICIER' && data.badgeNumber) {
            const userId = response.id
            createOfficerMutation.mutate(
              {
                userId,
                badgeNumber: data.badgeNumber,
                rank: data.rank!,
                policeUnit: data.policeUnit!,
              },
              {
                onSuccess: () => {
                  toast.success('Utilisateur et profil officier créés avec succès')
                  navigate('/users')
                },
                onError: () => {
                  toast.warning('Utilisateur créé mais erreur lors de la création du profil officier')
                  navigate('/users')
                },
              }
            )
          } else {
            toast.success('Utilisateur créé avec succès')
            navigate('/users')
          }
        },
      }
    )
  }

  return (
    <AdminLayout title="Créer un utilisateur">
      <div className="space-y-6 max-w-2xl">
        <div>
          <p className="text-slate-600">
            Remplissez le formulaire ci-dessous pour créer un nouvel utilisateur
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/users')}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Retour à la liste
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Informations de l'utilisateur</h2>
          <UserForm onSubmit={handleSubmit} isLoading={createUserMutation.isPending} />
        </div>
      </div>
    </AdminLayout>
  )
}
