import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSignalement, useVerifySignalement, useResolveSignalement, useDeleteSignalement } from '../../hooks/useSignalements'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function SignalementDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: signalement, isLoading } = useSignalement(id!)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const verifyMutation = useVerifySignalement()
  const resolveMutation = useResolveSignalement()
  const deleteMutation = useDeleteSignalement()

  const handleDelete = () => {
    if (!id) return
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate('/signalements')
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' }
      case 'PUBLISHED':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Publié' }
      case 'VERIFIED':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Vérifié' }
      case 'ARCHIVED':
        return { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Archivé' }
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', label: status }
    }
  }

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'URGENT':
        return { bg: 'bg-red-100', text: 'text-red-700' }
      case 'INFO_RECUE':
        return { bg: 'bg-blue-100', text: 'text-blue-700' }
      case 'RESOLVED':
        return { bg: 'bg-green-100', text: 'text-green-700' }
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700' }
    }
  }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: fr })
    } catch {
      return 'N/A'
    }
  }

  const formatDateTime = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'd MMMM yyyy à HH:mm', { locale: fr })
    } catch {
      return 'N/A'
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Détails Signalement">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!signalement) {
    return (
      <AdminLayout title="Détails Signalement">
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-red-600">Signalement non trouvé</p>
        </div>
      </AdminLayout>
    )
  }

  const mp = signalement.missingPerson
  const reporter = signalement.reporter
  const statusColor = getStatusColor(signalement.status)
  const alertStatusColor = getAlertStatusColor(mp?.status || 'STANDARD')

  return (
    <AdminLayout title={`${mp?.fullName || 'Inconnu'}, ${mp?.age || '?'} ans`}>
      <div className="space-y-6">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-4">
          <span className={`text-sm font-bold uppercase px-4 py-2 rounded-full ${statusColor.text} ${statusColor.bg}`}>
            {statusColor.label}
          </span>
          <span className={`text-sm font-bold uppercase px-4 py-2 rounded-full ${alertStatusColor.text} ${alertStatusColor.bg}`}>
            {mp?.status || 'STANDARD'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/signalements')}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Retour à la liste
          </button>
          {signalement.status === 'PENDING' && (
            <button
              onClick={() => verifyMutation.mutate(signalement.id)}
              disabled={verifyMutation.isPending}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              {verifyMutation.isPending ? 'Vérification...' : 'Vérifier'}
            </button>
          )}
          {signalement.status !== 'ARCHIVED' && (
            <button
              onClick={() => resolveMutation.mutate(signalement.id)}
              disabled={resolveMutation.isPending}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              {resolveMutation.isPending ? 'Résolution...' : 'Résoudre'}
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            Supprimer
          </button>
        </div>

        {/* Photo & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo */}
          {mp?.photoUrl && (
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <img
                src={mp.photoUrl}
                alt={mp.fullName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Person Info */}
          <div className={`bg-white rounded-xl border border-slate-100 p-6 ${mp?.photoUrl ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Informations de la Personne</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Nom Complet
                </label>
                <p className="text-slate-900 font-medium">{mp?.fullName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Âge
                </label>
                <p className="text-slate-900 font-medium">{mp?.age || '?'} ans</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Genre
                </label>
                <p className="text-slate-900 font-medium">
                  {mp?.gender === 'MASCULIN' ? 'Masculin' : mp?.gender === 'FEMININ' ? 'Féminin' : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Date de Disparition
                </label>
                <p className="text-slate-900 font-medium">
                  {formatDate(mp?.disappearanceDate)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Heure de Disparition
                </label>
                <p className="text-slate-900 font-medium">{mp?.disappearanceTime || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Région
                </label>
                <p className="text-slate-900 font-medium">{mp?.region || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Description */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Détails de la Disparition</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Dernière Adresse Connue
                </label>
                <p className="text-slate-900 font-medium">{mp?.lastAddress || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description des Vêtements
                </label>
                <p className="text-slate-900 font-medium">{mp?.clothingDescription || 'N/A'}</p>
              </div>
              {mp?.lastLatitude && mp?.lastLongitude && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Coordonnées GPS
                  </label>
                  <p className="text-slate-900 font-medium">
                    {mp.lastLatitude}, {mp.lastLongitude}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Informations du Déclarant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Nom
              </label>
              <p className="text-slate-900 font-medium">
                {reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Anonyme'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Téléphone de Contact
              </label>
              <p className="text-slate-900 font-medium">{signalement.phoneNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Lien avec la Personne
              </label>
              <p className="text-slate-900 font-medium">{signalement.relationship || 'N/A'}</p>
            </div>
            {signalement.policeReportNumber && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Numéro de Plainte
                </label>
                <p className="text-slate-900 font-medium">{signalement.policeReportNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Historique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Signalé le
              </label>
              <p className="text-slate-900 font-medium">
                {formatDateTime(signalement.createdAt)}
              </p>
            </div>
            {signalement.publishedAt && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Publié le
                </label>
                <p className="text-slate-900 font-medium">
                  {formatDateTime(signalement.publishedAt)}
                </p>
              </div>
            )}
            {signalement.verifiedAt && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Vérifié le
                </label>
                <p className="text-slate-900 font-medium">
                  {formatDateTime(signalement.verifiedAt)}
                </p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Dernière Modification
              </label>
              <p className="text-slate-900 font-medium">
                {formatDateTime(signalement.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Supprimer le signalement</h3>
            <p className="text-slate-700 mb-6">
              Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible.
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
                disabled={deleteMutation.isPending}
                className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
