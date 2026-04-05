import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'

interface Signalement {
  id: string
  name: string
  age: number
  category: 'enfant' | 'adulte' | 'senior'
  status: 'actif' | 'résolu' | 'suspendu'
  location: string
  reportedAt: string
  resolvedAt?: string
  reporter: string
  priority: 'high' | 'medium' | 'low'
  image: string
}

export default function SignalementsListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Mock data - remplacer par des données réelles de l'API
  const signalements: Signalement[] = [
    {
      id: '1',
      name: 'Amina Sow',
      age: 7,
      category: 'enfant',
      status: 'actif',
      location: 'Parcelles Assainies, Dakar',
      reportedAt: '2026-04-05T10:30:00Z',
      reporter: 'Fatou Ndiaye',
      priority: 'high',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    {
      id: '2',
      name: 'Ibrahima Diallo',
      age: 68,
      category: 'senior',
      status: 'actif',
      location: 'Mbour 1, Thiès',
      reportedAt: '2026-04-04T14:15:00Z',
      reporter: 'Moussa Sall',
      priority: 'high',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    },
    {
      id: '3',
      name: 'Moussa Ndiaye',
      age: 45,
      category: 'adulte',
      status: 'résolu',
      location: 'Kaolack',
      reportedAt: '2026-04-02T09:00:00Z',
      resolvedAt: '2026-04-05T16:45:00Z',
      reporter: 'Aïssatou Ba',
      priority: 'medium',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    },
    {
      id: '4',
      name: 'Seynabou Gueye',
      age: 52,
      category: 'adulte',
      status: 'résolu',
      location: 'Dakar',
      reportedAt: '2026-04-01T11:20:00Z',
      resolvedAt: '2026-04-05T13:30:00Z',
      reporter: 'Baye Sarr',
      priority: 'medium',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    },
  ]

  const filteredSignalements = signalements.filter((sig) => {
    const matchSearch = sig.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = !statusFilter || sig.status === statusFilter
    const matchCategory = !categoryFilter || sig.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return { bg: 'bg-red-50 dark:bg-red-950/20', text: 'text-red-700 dark:text-red-400', border: 'border-l-4 border-error' }
      case 'résolu':
        return { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-700 dark:text-green-400', border: 'border-l-4 border-secondary' }
      case 'suspendu':
        return { bg: 'bg-yellow-50 dark:bg-yellow-950/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-l-4 border-orange-500' }
      default:
        return { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-400', border: 'border-l-4 border-slate-300' }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error'
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      case 'low':
        return 'bg-secondary/10 text-secondary'
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
            <h1 className="text-3xl font-extrabold font-headline text-on-surface">Signalements</h1>
            <p className="text-on-surface-variant mt-2">Gestion des signalements de personnes disparues ({filteredSignalements.length})</p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined">add</span>
            Nouveau signalement
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
                  placeholder="Nom de la personne..."
                />
              </div>
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
                <option value="résolu">Résolu</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-1">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                Catégorie
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface dark:bg-slate-800 text-on-surface focus:ring-2 focus:ring-primary"
              >
                <option value="">Toutes les catégories</option>
                <option value="enfant">Enfant</option>
                <option value="adulte">Adulte</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-surface dark:bg-slate-900 rounded-lg border border-outline overflow-hidden shadow-sm">
          {filteredSignalements.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-30 block mb-4">
                person_off
              </span>
              <p className="text-on-surface-variant text-lg">Aucun signalement ne correspond à vos critères</p>
            </div>
          ) : (
            <div className="divide-y divide-outline">
              {filteredSignalements.map((signalement) => {
                const colors = getStatusColor(signalement.status)
                return (
                  <div
                    key={signalement.id}
                    className={`p-6 hover:bg-surface-container-high transition-colors cursor-pointer ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      {/* Avatar */}
                      <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-surface-container-high shadow-md">
                        <img src={signalement.image} alt={signalement.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-extrabold font-headline text-on-surface">
                            {signalement.name}, {signalement.age} ans
                          </h3>
                          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${getPriorityBadge(signalement.priority)}`}>
                            {signalement.priority === 'high' ? 'Urgent' : signalement.priority === 'medium' ? 'Moyen' : 'Faible'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {signalement.location}
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            {new Date(signalement.reportedAt).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-base">person</span>
                            Signalé par {signalement.reporter}
                          </div>
                          {signalement.resolvedAt && (
                            <div className="flex items-center gap-2 text-secondary">
                              <span className="material-symbols-outlined text-base">check_circle</span>
                              Résolu le {new Date(signalement.resolvedAt).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex flex-col items-end gap-3">
                        <span className={`text-sm font-bold uppercase px-4 py-2 rounded-full ${colors.text} ${
                          signalement.status === 'actif'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : signalement.status === 'résolu'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-yellow-100 dark:bg-yellow-900/30'
                        }`}>
                          {signalement.status}
                        </span>
                        <button className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined">arrow_forward</span>
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
