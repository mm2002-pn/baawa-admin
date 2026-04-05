import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'

interface KPICard {
  label: string
  value: string | number
  trend: string
  icon: string
  bgColor: string
  textColor: string
}

interface CriticalAlert {
  id: number
  name: string
  age: number
  location: string
  elapsed: string
  image: string
  priority: 'critical' | 'warning'
}

interface SuccessCase {
  name: string
  location: string
  time: string
  image: string
}

export default function DashboardPage() {
  const [searchQuery] = useState('')

  // KPI Statistics
  const kpis: KPICard[] = [
    {
      label: 'Retrouvailles totales',
      value: '1,428',
      trend: '+12%',
      icon: 'handshake',
      bgColor: '#10B981',
      textColor: '#10B981',
    },
    {
      label: 'Recherches actives',
      value: '142',
      trend: '8 Actifs',
      icon: 'search_insights',
      bgColor: '#0066FF',
      textColor: '#0066FF',
    },
    {
      label: 'Temps de réponse',
      value: '18 min',
      trend: '-4m',
      icon: 'timer',
      bgColor: '#F59E0B',
      textColor: '#D97706',
    },
    {
      label: 'Évolution hebdo',
      value: '+24.5%',
      trend: '📈',
      icon: 'trending_up',
      bgColor: '#0066FF',
      textColor: '#0066FF',
    },
  ]

  // Critical Alerts
  const criticalAlerts: CriticalAlert[] = [
    {
      id: 1,
      name: 'Amina Sow',
      age: 7,
      location: 'Parcelles Assainies, Dakar',
      elapsed: '2h écoulées',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      priority: 'critical',
    },
    {
      id: 2,
      name: 'Ibrahima Diallo',
      age: 68,
      location: 'Mbour 1, Thiès',
      elapsed: '5h écoulées',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      priority: 'warning',
    },
  ]

  // Recent Successes
  const recentSuccesses: SuccessCase[] = [
    {
      name: 'Moussa Ndiaye',
      location: 'Retrouvé à Kaolack',
      time: 'Il y a 4 heures',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    },
    {
      name: 'Seynabou Gueye',
      location: 'Retrouvée à Dakar',
      time: 'Il y a 6 heures',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    },
    {
      name: 'Pathé Sarr',
      location: 'Retrouvé à Thiès',
      time: 'Il y a 8 heures',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    },
    {
      name: 'Khady Diop',
      location: 'Retrouvée à Touba',
      time: 'Il y a 10 heures',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    },
  ]

  // Operations Live Feed
  const operationsFeed = [
    {
      time: 'À l\'instant',
      message: 'Unité Mobile #04 déployée à Grand Yoff.',
      priority: 'high',
    },
    {
      time: 'Il y a 3 min',
      message: 'Nouveau signalement reçu : Zone Touba Mbacké.',
      priority: 'normal',
    },
    {
      time: 'Il y a 12 min',
      message: 'RECONNAISSANCE FACIALE POSITIVE : Dossier #2284.',
      priority: 'high',
    },
    {
      time: 'Il y a 15 min',
      message: 'Clôture du dossier #2241 (Retrouvailles confirmées).',
      priority: 'normal',
    },
  ]

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-8">
        {/* Statistics Banner (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-surface dark:bg-slate-900 p-6 rounded-lg border border-outline shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${kpi.bgColor}15` }}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: kpi.textColor }}
                  >
                    {kpi.icon}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ color: kpi.textColor, backgroundColor: `${kpi.bgColor}15` }}
                >
                  {kpi.trend}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {kpi.label}
                </p>
                <h3 className="text-3xl font-bold font-headline text-on-surface mt-1 tracking-tight">
                  {kpi.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section - Full width on mobile */}
          <div className="lg:col-span-2 bg-surface dark:bg-slate-900 rounded-lg border border-outline shadow-sm overflow-hidden min-h-96">
            <div className="w-full h-96 bg-surface-container-low flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-40">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs4j9VqV0tfe8YnImwF3ih_XW-eRsNplG_XikyDSiVDeFchPyXgWJlGfB0G1bA80FUXa2de4axGHrclBkGBHwvY8iPBWYDYJ2KsQIeTp1CEnQozWTGPCnrDYSB_H_y_sCnBPFGeWX3lFEulb0GGCckgXHK22nEVRqnzGNGrQRRdsFr94TTWQX2TUYiP-Da1jklOdYvbhw5qOi5DL247m6AkleqR2vARMgUPkL4gj4jMrtyjpkjUGM-PrUhI1N83GWIXdfi0xsP8mzN"
                  alt="Senegal Map"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Map Legend */}
              <div className="absolute top-6 left-6 z-10 bg-surface/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-outline">
                <h4 className="text-[10px] font-extrabold font-headline text-on-surface-variant uppercase tracking-widest mb-3">
                  Légende
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs font-semibold text-on-surface">
                    <span className="h-2.5 w-2.5 rounded-full bg-error ring-4 ring-error/20"></span>
                    Alerte Critique
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-on-surface">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></span>
                    Signalement récent
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-on-surface">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary ring-4 ring-secondary/20"></span>
                    Unité mobile
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                <button className="bg-surface p-2.5 rounded-lg shadow-lg border border-outline hover:bg-surface-container-high text-on-surface transition-all">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="bg-surface p-2.5 rounded-lg shadow-lg border border-outline hover:bg-surface-container-high text-on-surface transition-all">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <button className="bg-surface p-2.5 rounded-lg shadow-lg border border-outline hover:bg-primary hover:text-on-primary text-on-surface transition-all">
                  <span className="material-symbols-outlined">my_location</span>
                </button>
              </div>
            </div>

            {/* Map Filters */}
            <div className="p-5 bg-surface border-t border-outline flex justify-between items-center">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">
                  Filtres :
                </span>
                <div className="flex gap-2">
                  <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-[10px] font-extrabold cursor-pointer">
                    Tout voir
                  </span>
                  <span className="bg-surface-container-low text-on-surface-variant px-4 py-1.5 rounded-full text-[10px] font-extrabold hover:bg-surface-container transition-all cursor-pointer">
                    Enfant
                  </span>
                  <span className="bg-surface-container-low text-on-surface-variant px-4 py-1.5 rounded-full text-[10px] font-extrabold hover:bg-surface-container transition-all cursor-pointer">
                    Adulte
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                Mise à jour : il y a 2 minutes
              </div>
            </div>
          </div>

          {/* Right Panel: Alerts & Operations Feed */}
          <div className="flex flex-col gap-8">
            {/* Critical Alerts */}
            <div className="bg-surface dark:bg-slate-900 rounded-lg border border-outline shadow-sm p-6 flex flex-col overflow-hidden max-h-96">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-extrabold font-headline text-on-surface flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-error text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  Alertes Critiques ({criticalAlerts.length})
                </h3>
                <a className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-wider">
                  Voir tout
                </a>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 flex gap-4 group hover:opacity-80 transition-all cursor-pointer ${
                      alert.priority === 'critical'
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-error'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-orange-500'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border border-outline shadow-sm">
                      <img
                        alt={alert.name}
                        className="h-full w-full object-cover"
                        src={alert.image}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-on-surface">
                        {alert.name}, {alert.age} ans
                      </h4>
                      <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {alert.location}
                      </p>
                      <p
                        className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${
                          alert.priority === 'critical'
                            ? 'text-error'
                            : 'text-orange-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {alert.elapsed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Live Feed */}
            <div className="bg-slate-900 text-white rounded-lg shadow-xl p-6 flex flex-col overflow-hidden flex-1 relative border border-slate-800">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <span className="material-symbols-outlined text-8xl">radar</span>
              </div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-sm font-extrabold font-headline flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    broadcast_on_home
                  </span>
                  Flux Opérations
                </h3>
                <span className="text-[10px] font-extrabold bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                  24 NOUVEAUX
                </span>
              </div>
              <div className="space-y-5 overflow-y-auto pr-2 flex-1 relative z-10">
                {operationsFeed.map((item, idx) => (
                  <div key={idx} className={`border-l-2 pl-5 py-0.5 relative ${
                    item.priority === 'high'
                      ? 'border-primary/30'
                      : 'border-white/10'
                  }`}>
                    <div
                      className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                        item.priority === 'high'
                          ? 'bg-primary shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                          : 'bg-slate-700'
                      }`}
                    ></div>
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      item.priority === 'high'
                        ? 'text-primary'
                        : 'text-slate-500'
                    }`}>
                      {item.time}
                    </p>
                    <p className={`text-xs font-medium leading-relaxed mt-1 ${
                      item.priority === 'high'
                        ? 'text-white font-bold'
                        : 'text-slate-300'
                    }`}>
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-lg text-xs font-extrabold transition-all shadow-lg shadow-primary/20">
                Ouvrir le terminal complet
              </button>
            </div>
          </div>
        </div>

        {/* Recent Successes */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold font-headline text-on-surface tracking-tight">
              Dernières Retrouvailles
            </h3>
            <div className="flex gap-3">
              <button className="p-2.5 bg-surface border border-outline rounded-lg text-on-surface-variant hover:text-primary hover:border-primary transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-2.5 bg-surface border border-outline rounded-lg text-on-surface-variant hover:text-primary hover:border-primary transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSuccesses.map((success, idx) => (
              <div
                key={idx}
                className="bg-surface dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-outline flex items-center gap-5 group hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 relative ring-2 ring-surface-container-high">
                  <img
                    alt={success.name}
                    className="h-full w-full object-cover"
                    src={success.image}
                  />
                  <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      className="material-symbols-outlined text-white text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-on-surface">{success.name}</h4>
                  <p className="text-[10px] text-secondary font-extrabold mt-1 uppercase tracking-wider">
                    {success.location}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1 font-medium">
                    {success.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Float FAB for quick signalement */}
      <button className="fixed bottom-10 right-10 h-16 w-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group hover:bg-primary-dark ring-4 ring-primary/20">
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-6 bg-slate-900 text-white px-5 py-3 rounded-lg text-sm font-extrabold opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
          Signaler une disparition
        </span>
      </button>
    </AdminLayout>
  )
}
