import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useOfficers, useDeleteOfficer } from '../../hooks/useOfficers'
import { useToast } from '../../hooks/useToast'
import { Modal } from '../../components/common/Modal/Modal'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function OfficersListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [rankFilter, setRankFilter] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; officerId: string | null }>({
    open: false,
    officerId: null,
  })

  const { data: officers, isLoading, error, refetch } = useOfficers()
  const deleteOfficer = useDeleteOfficer()
  const toast = useToast()

  const filteredOfficers = (officers ?? []).filter((officer) => {
    const matchSearch =
      officer.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRank = !rankFilter || officer.rank.toLowerCase() === rankFilter.toLowerCase()
    return matchSearch && matchRank
  })

  const handleDelete = async () => {
    if (!deleteModal.officerId) return
    try {
      await deleteOfficer.mutateAsync(deleteModal.officerId)
      toast.success('Profil officier supprimé')
      setDeleteModal({ open: false, officerId: null })
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRankColor = (rank: string) => {
    const r = rank.toLowerCase()
    if (r.includes('commissaire')) return 'bg-purple-100 text-purple-700'
    if (r.includes('inspecteur') || r.includes('capitaine')) return 'bg-blue-100 text-blue-700'
    if (r.includes('sergent') || r.includes('lieutenant')) return 'bg-cyan-100 text-cyan-700'
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Policiers</h1>
            <p className="text-slate-500 mt-1">
              Gestion des officiers de police ({filteredOfficers.length})
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">
                Rechercher
              </label>
              <div className="flex items-center bg-slate-50 px-4 py-3 rounded-lg gap-2 border border-slate-200">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-400"
                  placeholder="Nom, email ou badge..."
                />
              </div>
            </div>

            {/* Rank Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">
                Grade
              </label>
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les grades</option>
                <option value="agent">Agent</option>
                <option value="sergent">Sergent</option>
                <option value="lieutenant">Lieutenant</option>
                <option value="capitaine">Capitaine</option>
                <option value="inspecteur">Inspecteur</option>
                <option value="commissaire">Commissaire</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Chargement des officiers...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400 mb-2">error</span>
              <p className="text-slate-700 font-semibold">Erreur de chargement</p>
              <p className="text-slate-500 text-sm mt-1">Impossible de charger les officiers</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
                local_police
              </span>
              <p className="text-slate-700 font-semibold">Aucun officier trouvé</p>
              <p className="text-slate-500 text-sm mt-1">
                {officers?.length === 0
                  ? "Aucun profil officier n'a été créé"
                  : 'Aucun résultat ne correspond à vos critères'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Officier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Grade / Unité
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOfficers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {officer.user.firstName.charAt(0)}
                            {officer.user.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {officer.user.firstName} {officer.user.lastName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {officer.joinedAt
                                ? `Depuis ${formatDistanceToNow(new Date(officer.joinedAt), { locale: fr })}`
                                : 'Date inconnue'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{officer.user.email}</p>
                        <p className="text-xs text-slate-500">{officer.user.phoneNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-blue-600">{officer.badgeNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${getRankColor(officer.rank)}`}>
                          {officer.rank}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{officer.policeUnit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {officer.zoneGeo || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          officer.user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {officer.user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, officerId: officer.userId })}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer le profil officier"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, officerId: null })}
        title="Supprimer le profil officier"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Êtes-vous sûr de vouloir supprimer ce profil officier ? Cette action supprimera uniquement
            le profil policier, pas le compte utilisateur.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ open: false, officerId: null })}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteOfficer.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              {deleteOfficer.isPending ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}
