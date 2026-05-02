import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSignalements, useResolveSignalement, useVerifySignalement, useDeleteSignalement } from '../../hooks/useSignalements'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CreateSignalementModal from '../../components/signalements/CreateSignalementModal'
import SignalementDetailsDrawer from '../../components/signalements/SignalementDetailsDrawer'
import { useQueryClient } from '@tanstack/react-query'
import { Signalement } from '../../api/types'

export default function SignalementsListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedSignalement, setSelectedSignalement] = useState<Signalement | null>(null)
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false)

  const { data, isLoading } = useSignalements(page, limit, {
    search: search || undefined,
    status: statusFilter,
  })

  const verifyMutation = useVerifySignalement()
  const resolveMutation = useResolveSignalement()
  const deleteMutation = useDeleteSignalement()

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null)
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100', label: 'En attente' }
      case 'PUBLISHED':
        return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100', label: 'Publié' }
      case 'VERIFIED':
        return { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100', label: 'Vérifié' }
      case 'ARCHIVED':
        return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100', label: 'Archivé' }
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100', label: status }
    }
  }

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'URGENT':
        return 'bg-red-100 text-red-700'
      case 'INFO_RECUE':
        return 'bg-blue-100 text-blue-700'
      case 'RESOLVED':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const totalItems = data?.pagination?.total || 0
  const totalPages = data?.pagination?.totalPages || 1

  return (
    <AdminLayout title="Signalements">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-slate-600">{totalItems} signalements au total</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            <span className="material-symbols-outlined">add</span>
            Nouveau signalement
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Rechercher
              </label>
              <div className="flex items-center bg-slate-100 px-4 py-3 rounded-lg gap-2 border border-slate-200">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-400"
                  placeholder="Nom de la personne..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="PUBLISHED">Publié</option>
                <option value="VERIFIED">Vérifié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('ALL')
                setPage(1)
              }}
              className="px-6 py-2 text-sm font-bold text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Signalements List */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-400 opacity-50 animate-spin block mb-4">
                refresh
              </span>
              <p className="text-slate-500">Chargement des signalements...</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-400 opacity-30 block mb-4">
                person_off
              </span>
              <p className="text-slate-500 text-lg">Aucun signalement ne correspond à vos critères</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {data.data.map((signalement) => {
                const mp = signalement.missingPerson
                const reporter = signalement.reporter
                const colors = getStatusColor(signalement.status)
                const alertStatus = mp?.status || 'STANDARD'

                return (
                  <div
                    key={signalement.id}
                    className={`p-6 hover:bg-slate-50 transition-colors`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      {/* Photo */}
                      {mp?.photoUrls && mp.photoUrls.length > 0 && (
                        <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-200 shadow-md">
                          <img src={mp.photoUrls[0]} alt={mp.fullName} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-extrabold text-slate-900">
                            {mp?.fullName || 'Inconnu'}, {mp?.age || '?'} ans
                          </h3>
                          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${getAlertStatusColor(alertStatus)}`}>
                            {alertStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {mp?.lastAddress || mp?.region || '-'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            {signalement.createdAt ? format(new Date(signalement.createdAt), 'd MMM yyyy', { locale: fr }) : '-'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-base">person</span>
                            {reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Anonyme'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-base">phone</span>
                            {signalement.phoneNumber || '-'}
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                        <span className={`text-sm font-bold uppercase px-4 py-2 rounded-full ${colors.text} ${colors.badge}`}>
                          {colors.label}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedSignalement(signalement)
                              setIsDetailsDrawerOpen(true)
                            }}
                            className="px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Détails
                          </button>
                          {signalement.status === 'PENDING' && (
                            <button
                              onClick={() => verifyMutation.mutate(signalement.id)}
                              disabled={verifyMutation.isPending}
                              className="px-3 py-2 text-sm font-bold text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Vérifier
                            </button>
                          )}
                          {signalement.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => resolveMutation.mutate(signalement.id)}
                              disabled={resolveMutation.isPending}
                              className="px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Résoudre
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(signalement.id)}
                            className="px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Affichage {(page - 1) * limit + 1} à {Math.min(page * limit, totalItems)} sur {totalItems} résultats
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="flex items-center px-4 text-sm font-bold text-slate-900">
                  Page {page} sur {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Supprimer le signalement</h3>
            <p className="text-slate-700 mb-6">
              Êtes-vous sûr de vouloir supprimer ce signalement? Cette action est irréversible.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateSignalementModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['signalements'] })
        }}
      />
      <SignalementDetailsDrawer 
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false)
          setSelectedSignalement(null)
        }}
        signalement={selectedSignalement}
      />
    </AdminLayout>
  )
}
