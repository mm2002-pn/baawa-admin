import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'

interface Officer {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  badgeNumber: string
  rank: 'agent' | 'sergent' | 'inspecteur' | 'commissaire'
  status: 'actif' | 'inactif' | 'en_congé'
  verified: boolean
  joinedAt: string
  image: string
}

export default function OfficersListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [rankFilter, setRankFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  // Mock data - remplacer par des données réelles de l'API
  const officers: Officer[] = [
    {
      id: '1',
      firstName: 'Mamadou',
      lastName: 'Ba',
      email: 'mamadou.ba@police.sn',
      phoneNumber: '+221 77 123 4567',
      badgeNumber: 'PLC-001',
      rank: 'commissaire',
      status: 'actif',
      verified: true,
      joinedAt: '2024-01-15',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=100',
    },
    {
      id: '2',
      firstName: 'Fatou',
      lastName: 'Ndiaye',
      email: 'fatou.ndiaye@police.sn',
      phoneNumber: '+221 77 234 5678',
      badgeNumber: 'PLC-002',
      rank: 'inspecteur',
      status: 'actif',
      verified: true,
      joinedAt: '2023-06-20',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=101',
    },
    {
      id: '3',
      firstName: 'Moussa',
      lastName: 'Sall',
      email: 'moussa.sall@police.sn',
      phoneNumber: '+221 77 345 6789',
      badgeNumber: 'PLC-003',
      rank: 'sergent',
      status: 'actif',
      verified: true,
      joinedAt: '2022-11-10',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=102',
    },
    {
      id: '4',
      firstName: 'Aïssatou',
      lastName: 'Diallo',
      email: 'aissatou.diallo@police.sn',
      phoneNumber: '+221 77 456 7890',
      badgeNumber: 'PLC-004',
      rank: 'agent',
      status: 'actif',
      verified: true,
      joinedAt: '2023-03-05',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=103',
    },
    {
      id: '5',
      firstName: 'Baye',
      lastName: 'Sarr',
      email: 'baye.sarr@police.sn',
      phoneNumber: '+221 77 567 8901',
      badgeNumber: 'PLC-005',
      rank: 'agent',
      status: 'en_congé',
      verified: true,
      joinedAt: '2023-09-12',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=104',
    },
  ]

  const filteredOfficers = officers.filter((officer) => {
    const matchSearch =
      officer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRank = !rankFilter || officer.rank === rankFilter
    const matchStatus = !statusFilter || officer.status === statusFilter
    return matchSearch && matchRank && matchStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-700 dark:text-green-400', border: 'border-l-4 border-secondary' }
      case 'inactif':
        return { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-400', border: 'border-l-4 border-slate-300' }
      case 'en_congé':
        return { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-l-4 border-primary' }
      default:
        return { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-400', border: 'border-l-4 border-slate-300' }
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'commissaire':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'inspecteur':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'sergent':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
      case 'agent':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface">Policiers</h1>
            <p className="text-on-surface-variant mt-2">Gestion des officiers et leur validation ({filteredOfficers.length})</p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined">add</span>
            Ajouter un officier
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-on-surface-variant/60"
                  placeholder="Nom, email ou numéro de badge..."
                />
              </div>
            </div>

            {/* Rank Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Grade
              </label>
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface dark:bg-slate-800 text-on-surface focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les grades</option>
                <option value="agent">Agent</option>
                <option value="sergent">Sergent</option>
                <option value="inspecteur">Inspecteur</option>
                <option value="commissaire">Commissaire</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface dark:bg-slate-800 text-on-surface focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="en_congé">En congé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface dark:bg-slate-900 rounded-lg border border-outline overflow-hidden shadow-sm">
          {filteredOfficers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-30 block mb-4">
                security
              </span>
              <p className="text-on-surface-variant text-lg">Aucun officier ne correspond à vos critères</p>
            </div>
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-high border-b border-outline">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Officier
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Badge
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Grade
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-extrabold font-headline text-on-surface uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {filteredOfficers.map((officer) => {
                      const statusColors = getStatusColor(officer.status)
                      return (
                        <tr key={officer.id} className="hover:bg-surface-container-high transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-surface-container-high">
                                <img src={officer.image} alt={officer.firstName} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-on-surface">
                                  {officer.firstName} {officer.lastName}
                                </p>
                                <p className="text-xs text-on-surface-variant">{officer.phoneNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">{officer.email}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-primary">{officer.badgeNumber}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getRankColor(officer.rank)}`}>
                              {officer.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${statusColors.text} ${
                              officer.status === 'actif'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : officer.status === 'en_congé'
                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                : 'bg-slate-100 dark:bg-slate-800'
                            }`}>
                              {officer.status === 'en_congé' ? 'En congé' : officer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors" title="Voir détails">
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                              <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors" title="Éditer">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors" title="Désactiver">
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-outline">
                {filteredOfficers.map((officer) => {
                  const statusColors = getStatusColor(officer.status)
                  return (
                    <div
                      key={officer.id}
                      className={`p-6 hover:bg-surface-container-high transition-colors cursor-pointer ${statusColors.bg} ${statusColors.border}`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-surface-container-high">
                          <img src={officer.image} alt={officer.firstName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-on-surface">
                            {officer.firstName} {officer.lastName}
                          </h4>
                          <p className="text-xs text-on-surface-variant">{officer.badgeNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <p className="text-on-surface-variant">{officer.email}</p>
                        <p className="text-on-surface-variant">{officer.phoneNumber}</p>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getRankColor(officer.rank)}`}>
                          {officer.rank}
                        </span>
                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${statusColors.text} ${
                          officer.status === 'actif'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : officer.status === 'en_congé'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          {officer.status === 'en_congé' ? 'En congé' : officer.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">visibility</span>
                          Voir
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">edit</span>
                          Éditer
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
