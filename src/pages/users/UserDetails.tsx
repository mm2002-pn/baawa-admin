import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useUser, useDeleteUser, useToggleUserActive } from '../../hooks/useUsers'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function UserDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useUser(id!)
  const deleteUserMutation = useDeleteUser()
  const toggleActiveMutation = useToggleUserActive()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    deleteUserMutation.mutate(user!.id, {
      onSuccess: () => {
        navigate('/users')
      },
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN_BAAWA':
        return 'bg-purple-100 text-purple-700'
      case 'POLICIER':
        return 'bg-blue-100 text-blue-700'
      case 'CITOYEN':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (!id) {
    return (
      <AdminLayout title="Détails Utilisateur">
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-red-600">ID utilisateur non valide</p>
        </div>
      </AdminLayout>
    )
  }

  if (isLoading) {
    return (
      <AdminLayout title="Détails Utilisateur">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout title="Détails Utilisateur">
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-red-600">Utilisateur non trouvé</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`${user.firstName} ${user.lastName}`}>
      <div className="space-y-6">
        {/* Email */}
        <p className="text-slate-600">{user.email}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/users/${id}/edit`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            Éditer
          </button>
          <button
            onClick={() => toggleActiveMutation.mutate(user.id)}
            disabled={toggleActiveMutation.isPending}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
          >
            {user.isActive ? 'Désactiver' : 'Activer'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            Supprimer
          </button>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <p className="text-slate-900 font-medium">{user.email}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Téléphone
              </label>
              <p className="text-slate-900 font-medium">{user.phoneNumber}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Rôle
              </label>
              <span className={`inline-block text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Statut
              </label>
              <span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {user.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Vérification
              </label>
              <span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {user.isVerified ? 'Vérifié' : 'Non vérifié'}
              </span>
            </div>

            {user.zoneGeo && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Zone Géographique
                </label>
                <p className="text-slate-900 font-medium">{user.zoneGeo}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Date de création
              </label>
              <p className="text-slate-900 font-medium">
                {user.createdAt ? format(new Date(user.createdAt), 'd MMMM yyyy', { locale: fr }) : 'N/A'}
              </p>
            </div>

            {user.lastLoginAt ? (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Dernière connexion
                </label>
                <p className="text-slate-900 font-medium">
                  {format(new Date(user.lastLoginAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-sm text-slate-600 mt-2">Signalements créés</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-sm text-slate-600 mt-2">Pistes soumises</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-sm text-slate-600 mt-2">Pistes vérifiées</p>
          </div>
        </div>

        {/* Officer Information (if applicable) */}
        {user.role === 'POLICIER' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Informations du Policier</h2>
            {user.officer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Numéro de Badge
                  </label>
                  <p className="text-slate-900 font-medium">{user.officer.badgeNumber}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Rang
                  </label>
                  <p className="text-slate-900 font-medium">{user.officer.rank}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Unité de Police
                  </label>
                  <p className="text-slate-900 font-medium">{user.officer.policeUnit}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Zone de Patrouille
                  </label>
                  <p className="text-slate-900 font-medium">{user.officer.zoneGeo || user.zoneGeo || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <span className="material-symbols-outlined text-3xl mb-2">badge</span>
                <p>Profil officier non configuré</p>
                <button
                  onClick={() => navigate(`/users/${id}/edit`)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Configurer le profil officier
                </button>
              </div>
            )}
          </div>
        )}

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Historique d'activité</h2>
          <div className="text-center text-slate-600 py-8">
            <p>Aucune activité enregistrée</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/users')}
          className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Retour à la liste
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Supprimer l'utilisateur</h3>
            <p className="text-slate-700 mb-6">
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              ? Cette action est irréversible.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteUserMutation.isPending}
                className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteUserMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
