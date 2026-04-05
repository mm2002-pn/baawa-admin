import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useUsers, useDeleteUser, useToggleUserActive } from '../../hooks/useUsers'
import { useToast } from '../../hooks/useToast'
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
  const toggleActiveMutation = useToggleUserActive()

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
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case Role.POLICIER:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case Role.CITOYEN:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-error">Erreur lors du chargement des utilisateurs</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface">Utilisateurs</h1>
            <p className="text-on-surface-variant mt-2">{data?.total || 0} utilisateurs au total</p>
          </div>
          <button
            onClick={() => navigate('/users/create')}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            <span className="material-symbols-outlined">add</span>
            Créer un utilisateur
          </button>
        </div>

        {/* Filters */}
        <div className="bg-surface dark:bg-slate-900 rounded-lg border border-outline p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Rechercher
              </label>
              <div className="flex items-center bg-surface-container-low px-4 py-3 rounded-lg gap-2 border border-outline">
                <span className="material-symbols-outlined text-on-surface-variant">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-on-surface-variant/60"
                  placeholder="Email, nom, téléphone..."
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Rôle
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface dark:bg-slate-800 text-on-surface focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les rôles</option>
                <option value={Role.CITOYEN}>Citoyen</option>
                <option value={Role.POLICIER}>Policier</option>
                <option value={Role.ADMIN_BAAWA}>Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface dark:bg-slate-800 text-on-surface focus:ring-2 focus:ring-primary"
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
              className="px-6 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface dark:bg-slate-900 rounded-lg border border-outline overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-50 animate-spin block mb-4">
                refresh
              </span>
              <p className="text-on-surface-variant">Chargement des utilisateurs...</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-30 block mb-4">
                person_off
              </span>
              <p className="text-on-surface-variant text-lg">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-high border-b border-outline">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Rôle
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Créé le
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {data.data.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-container-high transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-on-surface-variant">{user.phoneNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                              user.isActive
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {user.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {format(new Date(user.createdAt), 'd MMM yyyy', { locale: fr })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/users/${user.id}`)}
                              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            <button
                              onClick={() => navigate(`/users/${user.id}/edit`)}
                              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                              title="Éditer"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => {}}
                              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                              title={user.isActive ? 'Désactiver' : 'Activer'}
                            >
                              <span className="material-symbols-outlined text-lg">
                                {user.isActive ? 'toggle_on' : 'toggle_off'}
                              </span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(user)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
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
              <div className="sm:hidden divide-y divide-outline">
                {data.data.map((user) => (
                  <div key={user.id} className="p-6 hover:bg-surface-container-high transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-on-surface">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-on-surface-variant">{user.phoneNumber}</p>
                      <p className="text-on-surface-variant">
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
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="flex-1 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                        Voir
                      </button>
                      <button
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                        className="flex-1 px-3 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center justify-center gap-2"
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
            <div className="p-6 bg-surface-container-low border-t border-outline flex items-center justify-between">
              <div className="text-sm text-on-surface-variant">
                Affichage {(page - 1) * limit + 1} à {Math.min(page * limit, data.total)} sur {data.total} résultats
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                  Précédent
                </button>
                <span className="flex items-center px-4 text-sm font-bold text-on-surface">
                  Page {page} sur {Math.ceil(data.total / limit)}
                </span>
                <button
                  disabled={page >= Math.ceil(data.total / limit)}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <div className="bg-surface dark:bg-slate-900 rounded-lg p-6 max-w-sm w-full border border-outline">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-error text-3xl">warning</span>
              <h3 className="text-lg font-bold font-headline text-on-surface">Supprimer l'utilisateur</h3>
            </div>
            <p className="text-on-surface-variant mb-6">
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong className="text-on-surface">
                {deleteConfirm.firstName} {deleteConfirm.lastName}
              </strong>
              ? Cette action est irréversible.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={deleteUserMutation.isPending}
                className="px-6 py-2 text-sm font-bold text-on-error bg-error hover:bg-on-error-container rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
