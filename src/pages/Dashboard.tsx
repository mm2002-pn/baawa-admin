import { Link, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../components/layout/AdminLayout'
import { useDashboardStats, useRegionStats } from '../hooks/useStats'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import SenegalMap from '../components/map/SenegalMap'
import { LatLngExpression } from 'leaflet'
import { useMemo } from 'react'

export default function DashboardPage() {
  const navigate = useNavigate()

  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: regionStats, isLoading: regionsLoading } = useRegionStats()

  // Transform real alerts to map markers
  const mapMarkers = useMemo(() => {
    if (!stats?.recentAlerts) return []

    return stats.recentAlerts
      .filter((alert) => {
        const mp = alert.missingPerson
        return mp?.lastLatitude && mp?.lastLongitude
      })
      .map((alert) => {
        const mp = alert.missingPerson
        const hoursSinceCreation = (Date.now() - new Date(alert.createdAt).getTime()) / (1000 * 60 * 60)

        return {
          id: alert.id,
          position: [mp.lastLatitude, mp.lastLongitude] as LatLngExpression,
          name: mp.fullName,
          age: mp.age,
          location: mp.region || mp.lastAddress || 'Sénégal',
          type: mp.status === 'URGENT' ? 'critical' as const : 'recent' as const,
          elapsed: hoursSinceCreation < 1
            ? 'Moins d\'1h'
            : `${Math.floor(hoursSinceCreation)}h`,
          photoUrl: mp.photoUrls?.[0],
        }
      })
  }, [stats?.recentAlerts])

  // Build KPI cards from real data
  const overview = stats?.overview
  const kpis = [
    {
      label: 'Signalements Total',
      value: overview?.totalSignalements ?? '-',
      trend: `${overview?.totalUsers ?? 0} utilisateurs`,
      icon: 'description',
      color: '#3B82F6',
    },
    {
      label: 'Alertes Actives',
      value: overview?.activeAlerts ?? '-',
      trend: 'En cours',
      icon: 'search_insights',
      color: '#F59E0B',
    },
    {
      label: 'Résolus (30j)',
      value: overview?.resolvedAlerts30j ?? '-',
      trend: overview?.successRate ?? '0%',
      icon: 'check_circle',
      color: '#10B981',
    },
    {
      label: 'Taux de Succès',
      value: overview?.successRate ?? '0%',
      trend: 'Global',
      icon: 'trending_up',
      color: '#8B5CF6',
    },
  ]

  return (
    <AdminLayout title="Tableau de bord">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: kpi.color + '15' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: kpi.color }}
                    >
                      {kpi.icon}
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ color: kpi.color, backgroundColor: kpi.color + '15' }}
                  >
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {kpi.label}
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {statsLoading ? (
                    <span className="animate-pulse bg-slate-200 rounded w-16 h-8 inline-block"></span>
                  ) : (
                    kpi.value
                  )}
                </h3>
              </div>
            ))}
          </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <SenegalMap height="320px" markers={mapMarkers} />

          {/* Map Filters */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Filtres :
              </span>
              <div className="flex gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer">
                  Tout voir
                </span>
                <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
                  Enfant
                </span>
                <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
                  Adulte
                </span>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Mise à jour : il y a 2 minutes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Alertes Récentes</h3>
                <Link
                  to="/signalements"
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Voir tout
                </Link>
              </div>

              {statsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : stats?.recentAlerts && stats.recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAlerts.map((alert) => {
                    const mp = alert.missingPerson
                    const alertStatus = mp?.status || 'STANDARD'
                    return (
                      <Link
                        key={alert.id}
                        to={`/signalements/${alert.id}`}
                        className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          alertStatus === 'URGENT' ? 'bg-red-100' :
                          alertStatus === 'INFO_RECUE' ? 'bg-blue-100' : 'bg-slate-200'
                        }`}>
                          <span className={`material-symbols-outlined ${
                            alertStatus === 'URGENT' ? 'text-red-600' :
                            alertStatus === 'INFO_RECUE' ? 'text-blue-600' : 'text-slate-600'
                          }`}>
                            {alertStatus === 'URGENT' ? 'warning' : 'person_search'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900">
                            {mp?.fullName || 'Inconnu'}, {mp?.age || '?'} ans
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {mp?.region || '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            alertStatus === 'URGENT' ? 'bg-red-100 text-red-700' :
                            alertStatus === 'INFO_RECUE' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {alertStatus}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: fr })}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                  <p>Aucune alerte récente</p>
                </div>
              )}
            </div>

          {/* Region Stats */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Par Région</h3>
              </div>

              {regionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                    </div>
                  ))}
                </div>
              ) : regionStats && regionStats.length > 0 ? (
                <div className="space-y-3">
                  {regionStats.map((region, idx) => (
                    <div
                      key={region.region}
                      className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${
                          idx === 0 ? 'bg-red-500' :
                          idx === 1 ? 'bg-orange-500' :
                          idx === 2 ? 'bg-yellow-500' : 'bg-slate-400'
                        }`}></span>
                        <span className="text-sm font-semibold text-slate-700">{region.region}</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{region.activeAlertsCount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <span className="material-symbols-outlined text-3xl mb-2">map</span>
                  <p className="text-sm">Aucune donnée régionale</p>
                </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/signalements/create')}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-blue-600">add_alert</span>
              <span className="text-sm font-semibold text-blue-700">Nouveau signalement</span>
            </button>
            <button
              onClick={() => navigate('/users')}
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-green-600">people</span>
              <span className="text-sm font-semibold text-green-700">Gérer utilisateurs</span>
            </button>
            <button
              onClick={() => navigate('/officers')}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-purple-600">local_police</span>
              <span className="text-sm font-semibold text-purple-700">Gérer policiers</span>
            </button>
            <button
              onClick={() => navigate('/tips')}
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-orange-600">record_voice_over</span>
              <span className="text-sm font-semibold text-orange-700">Voir témoignages</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
