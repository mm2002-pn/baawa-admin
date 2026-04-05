import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'
import { Button } from '../../components/common/Button/Button'
import { Badge, RoleBadge } from '../../components/common/Badge/Badge'
import { Table } from '../../components/common/Table/Table'
import { Modal } from '../../components/common/Modal/Modal'
import { useUsers, useDeleteUser, useToggleUserActive } from '../../hooks/useUsers'
import { useToast } from '../../hooks/useToast'
import { User, Role } from '../../api/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function UsersListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
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

  const handleToggleActive = async (userId: string) => {
    toggleActiveMutation.mutate(userId)
  }

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <div className="text-sm font-medium text-slate-900 dark:text-white">{value}</div>
      ),
    },
    {
      key: 'firstName',
      label: 'Nom',
      render: (value: string, item: User) => (
        <div className="text-sm text-slate-700 dark:text-slate-300">
          {item.firstName} {item.lastName}
        </div>
      ),
    },
    {
      key: 'phoneNumber',
      label: 'Téléphone',
      render: (value: string) => <div className="text-sm text-slate-600 dark:text-slate-400">{value}</div>,
    },
    {
      key: 'role',
      label: 'Rôle',
      render: (value: Role) => <RoleBadge role={value} />,
    },
    {
      key: 'isActive',
      label: 'Statut',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'}>{value ? 'Actif' : 'Inactif'}</Badge>
      ),
    },
    {
      key: 'isVerified',
      label: 'Vérifié',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'info'}>{value ? 'Oui' : 'Non'}</Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date création',
      render: (value: string) => (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {format(new Date(value), 'd MMM yyyy', { locale: fr })}
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value: string, item: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/users/${item.id}`)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            title="Voir détails"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate(`/users/${item.id}/edit`)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            title="Éditer"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => handleToggleActive(item.id)}
            disabled={toggleActiveMutation.isPending}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
            title={item.isActive ? 'Désactiver' : 'Activer'}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.707 10.707a1 1 0 10-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3zM13.707 5.707a1 1 0 10-1.414-1.414l-6 6a1 1 0 001.414 1.414l6-6z" />
            </svg>
          </button>
          <button
            onClick={() => setDeleteConfirm(item)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors hover:text-red-600"
            title="Supprimer"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des utilisateurs</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Utilisateurs</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {data?.total || 0} utilisateurs au total
            </p>
          </div>
          <Button onClick={() => navigate('/users/create')}>Créer un utilisateur</Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rechercher
                </label>
                <input
                  type="text"
                  placeholder="Email, nom, téléphone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rôle
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value)
                    setPage(1)
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les rôles</option>
                  <option value={Role.CITOYEN}>Citoyen</option>
                  <option value={Role.POLICIER}>Policier</option>
                  <option value={Role.ADMIN_BAAWA}>Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Statut
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setPage(1)
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch('')
                    setSelectedRole('')
                    setSelectedStatus('')
                    setPage(1)
                  }}
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              emptyMessage="Aucun utilisateur trouvé"
            />

            {/* Pagination */}
            {data && data.total > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Affichage {(page - 1) * limit + 1} à {Math.min(page * limit, data.total)} sur {data.total}{' '}
                  résultats
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Précédent
                  </Button>
                  <span className="flex items-center px-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Page {page} sur {Math.ceil(data.total / limit)}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= Math.ceil(data.total / limit)}
                    onClick={() => setPage(page + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Supprimer l'utilisateur"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              isLoading={deleteUserMutation.isPending}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Supprimer
            </Button>
          </div>
        }
      >
        <p className="text-slate-700 dark:text-slate-300">
          Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
          <strong>
            {deleteConfirm?.firstName} {deleteConfirm?.lastName}
          </strong>
          ? Cette action est irréversible.
        </p>
      </Modal>
    </AdminLayout>
  )
}
