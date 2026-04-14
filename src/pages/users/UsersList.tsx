import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useUsers, useDeleteUser, useToggleUserActive } from '../../hooks/useUsers'
import { User, Role } from '../../api/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function UsersListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null)

  const { data, isLoading, error } = useUsers(page, limit, {
    search: search || undefined,
    role: (selectedRole as Role) || undefined,
    isActive: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
  })

  const deleteUserMutation = useDeleteUser()

  const handleDelete = async (user: User) => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        setDeleteConfirm(null)
      },
    })
  }

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN_BAAWA:
        return 'bg-purple-100 text-purple-700'
      case Role.POLICIER:
        return 'bg-blue-100 text-blue-700'
      case Role.CITOYEN:
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (error) {
    return (
      <AdminLayout title="Utilisateurs">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-slate-500 text-sm">{data?.total || 0} utilisateurs au total</p>
            <button
              onClick={() => navigate('/users/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 justify-center"
            >
              <span className="material-symbols-outlined">add</span>
              Créer un utilisateur
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <p className="text-red-600">Erreur lors du chargement des utilisateurs</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Utilisateurs">
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-slate-500 text-sm">{data?.total || 0} utilisateurs au total</p>
          <button
            onClick={() => navigate('/users/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            <span className="material-symbols-outlined">add</span>
            Créer un utilisateur
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-1">
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
                  placeholder="Email, nom, téléphone..."
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Rôle
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Tous les rôles</option>
                <option value={Role.CITOYEN}>Citoyen</option>
                <option value={Role.POLICIER}>Policier</option>
                <option value={Role.ADMIN_BAAWA}>Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearch('')
                setSelectedRole('')
                setSelectedStatus('')
                setPage(1)
              }}
              className="px-6 py-2 text-sm font-bold text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-400 opacity-50 animate-spin block mb-4">
                refresh
              </span>
              <p className="text-slate-500">Chargement des utilisateurs...</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-400 opacity-30 block mb-4">
                person_off
              </span>
              <p className="text-slate-500 text-lg">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        Utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        Rôle
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        Créé le
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.data.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-blue-600">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-slate-500">{user.phoneNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {format(new Date(user.createdAt), 'd MMM yyyy', { locale: fr })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/users/${user.id}`)}
                              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            <button
                              onClick={() => navigate(`/users/${user.id}/edit`)}
                              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Éditer"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(user)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Supprimer"
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

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-slate-200">
                {data.data.map((user) => (
                  <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-14 w-14 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-slate-600">{user.phoneNumber}</p>
                      <p className="text-slate-600">
                        {format(new Date(user.createdAt), 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="flex-1 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                        Voir
                      </button>
                      <button
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                        className="flex-1 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">edit</span>
                        Éditer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {data && data.total > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Affichage {(page - 1) * limit + 1} à {Math.min(page * limit, data.total)} sur {data.total} résultats
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                  Précédent
                </button>
                <span className="flex items-center px-4 text-sm font-bold text-slate-900">
                  Page {page} sur {Math.ceil(data.total / limit)}
                </span>
                <button
                  disabled={page >= Math.ceil(data.total / limit)}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Suivant
                  <span className="material-symbols-outlined">chevron_right</span>
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
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
              <h3 className="text-lg font-bold text-slate-900">Supprimer l'utilisateur</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong className="text-slate-900">
                {deleteConfirm.firstName} {deleteConfirm.lastName}
              </strong>
              ? Cette action est irréversible.
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
                disabled={deleteUserMutation.isPending}
                className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
