import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'
import { Button } from '../../components/common/Button/Button'
import { Badge, RoleBadge } from '../../components/common/Badge/Badge'
import { Modal } from '../../components/common/Modal/Modal'
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

  if (!id) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">ID utilisateur non valide</p>
        </div>
      </AdminLayout>
    )
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

  const handleDelete = () => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        navigate('/users')
      },
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              Éditer
            </Button>
            <Button
              variant={user.isActive ? 'secondary' : 'warning'}
              onClick={() => toggleActiveMutation.mutate(user.id)}
              disabled={toggleActiveMutation.isPending}
            >
              {user.isActive ? 'Désactiver' : 'Activer'}
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Supprimer
            </Button>
          </div>
        </div>

        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <p className="text-slate-900 dark:text-white font-medium">{user.email}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Téléphone
                </label>
                <p className="text-slate-900 dark:text-white font-medium">{user.phoneNumber}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Rôle
                </label>
                <div className="flex items-center gap-2">
                  <RoleBadge role={user.role} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Statut
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant={user.isActive ? 'success' : 'warning'}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Vérification
                </label>
                <Badge variant={user.isVerified ? 'success' : 'info'}>
                  {user.isVerified ? 'Vérifié' : 'Non vérifié'}
                </Badge>
              </div>

              {user.zoneGeo && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Zone Géographique
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">{user.zoneGeo}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Date de création
                </label>
                <p className="text-slate-900 dark:text-white font-medium">
                  {user.createdAt ? format(new Date(user.createdAt), 'd MMMM yyyy', { locale: fr }) : 'N/A'}
                </p>
              </div>

              {user.lastLoginAt ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Dernière connexion
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {format(new Date(user.lastLoginAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Signalements créés</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Pistes soumises</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Pistes vérifiées</p>
            </CardContent>
          </Card>
        </div>

        {/* Officer Information (if applicable) */}
        {user.role === 'POLICIER' && (
          <Card>
            <CardHeader>
              <CardTitle>Informations du Policier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Numéro de Badge
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">N/A</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Rang
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">N/A</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Unité de Police
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">N/A</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Zone de Patrouille
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">{user.zoneGeo || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Historique d'activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-slate-600 dark:text-slate-400 py-8">
              <p>Aucune activité enregistrée</p>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/users')}>
            ← Retour à la liste
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Supprimer l'utilisateur"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              isLoading={deleteUserMutation.isPending}
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </div>
        }
      >
        <p className="text-slate-700 dark:text-slate-300">
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>
            {user.firstName} {user.lastName}
          </strong>
          ? Cette action est irréversible.
        </p>
      </Modal>
    </AdminLayout>
  )
}
