import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface KPICard {
  label: string
  value: string | number
  trend: string
  icon: string
  trendColor: string
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

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/', icon: 'dashboard' },
  { label: 'Cartographie', href: '/map', icon: 'map' },
  { label: 'Dossiers actifs', href: '/cases', icon: 'person_search' },
  { label: 'Ressources', href: '/resources', icon: 'folder_shared' },
  { label: 'Paramètres', href: '/settings', icon: 'settings' },
]

export default function DashboardPage() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [searchQuery] = useState('')

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  // KPI Statistics
  const kpis: KPICard[] = [
    {
      label: 'Retrouvailles totales',
      value: '1,428',
      trend: '+12%',
      icon: 'handshake',
      trendColor: '#10B981',
    },
    {
      label: 'Recherches actives',
      value: '142',
      trend: '8 Actifs',
      icon: 'search_insights',
      trendColor: '#3B82F6',
    },
    {
      label: 'Temps de réponse',
      value: '18 min',
      trend: '-4m',
      icon: 'timer',
      trendColor: '#F59E0B',
    },
    {
      label: 'Évolution hebdo',
      value: '+24.5%',
      trend: '📈',
      icon: 'trending_up',
      trendColor: '#3B82F6',
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
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD46_OTCesflJY5R3jWjdUkz17o4OwpHFHvt6l2VwZuz704yWQUWrn1sXx5NxPhxb-YLjcXR2ww_c1z6tqB5UkAvlbAX4EPk7r--7UsHWjXkyOJnI5hlgdYBhUldBtLfSlonZK6epENir-GW-9snwR4R2HyI6ufn0mpeC2W7TgCLFqrV_mAVOjm1epwD6INISOuA-bngMK8eB2OwxFIYXUCOyn7BTwWO10CiFjPYLJvAIVU76BjIhqY78S6Ql-Lxyy_cV4459OBiKya',
      priority: 'critical',
    },
    {
      id: 2,
      name: 'Ibrahima Diallo',
      age: 68,
      location: 'Mbour 1, Thiès',
      elapsed: '5h écoulées',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjycimVzq31R6SCMRDtS98t8q0cpwWUR-hPocrm89KrGV3nD0AnKnj4VUefaSprNcyADnoERjHoOOEjE9jKNYxo5dztobQMHIt4cF4OeB4lSvrxnJR2vXbNCSx3uNugS2BtLVGDWLyMJt1fWrWyate1rhX8TkFS4gZBCU6NPAzXPrjWSSH1KO6_8zPWAk3-n0N_rF9YvrKgBByx-NyI_NEkyceZXY0xA-KMmgJric9VEW2PVxLC7n7a1nRmad5pGOP6UhWwHAQmE7u',
      priority: 'warning',
    },
  ]

  // Recent Successes
  const recentSuccesses: SuccessCase[] = [
    {
      name: 'Moussa Ndiaye',
      location: 'Retrouvé à Kaolack',
      time: 'Il y a 4 heures',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTlzFmmUCozKZI6ZCBLWjQGMVEnmEBbrxktGeeq7TlL3qQrw_jXE2ir0vYK173urjIwCvn6ll4PRZ5iaRbPbWSBfAk03p4m7DAemYC1ON2PbKS2M-o8g3yACN3c7tbyhhkFkaCSQaj4Umfrx56R2FEUZzcQsX-aAwtgiPEDx6uZCB8NNWg5LaBclzQ9cBu70C8T2_zX1Ov_L2jRSAaIITMLE4Jael2QKThuDqpmvf1ImtToFGnuJRmK-60H8Vcf4Ie9PAr7WKmokHW',
    },
    {
      name: 'Seynabou Gueye',
      location: 'Retrouvée à Dakar',
      time: 'Il y a 6 heures',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN-M77gYmPv2hAEgNm-Axmyd8IzIG_wHk_4QgaxRPrq-AIeE3GqrRRM6Fb4WfgpJpCpNs_NAFnQXTc1PQQzIw_6hC3aaJCdF0ThrPLgjrGhGtCukYkq05vjZpYf7kCnVbHOf78ny_-Kvr6igkv5edjaO57ekPax7owtv34RJPSI1BnaBHjSKWmGKLEODVgfeg0O0oByFUJ_k9LEq8-xo9eV_89LKlXEDSCtbiNPi-yM9gBFp9C21SJXVOD0JxPlkw5p0gnzIRKoGLp',
    },
    {
      name: 'Pathé Sarr',
      location: 'Retrouvé à Thiès',
      time: 'Il y a 8 heures',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9ybAok0PR2gJktyWoQVCSdfJQtGQmZCMevy39y6NlEhai4VsX0WJQWQEyIZ_zZmIA04hl4Rt8nvkxlTUZLzxzMEm4vR9cFp9SEy1P_WWEoeQVT8OqUKhdfaAa6jjNEzpJP2N9Umc_yY4V2t9Tkm0laDV30UlTldPpTJck2NW-oonLReR37PVE734lV1JQFrvFK_vCPEDG7z56RIBVke5JxVrZgyyW6Y7ItXoO-2I1_00b19JfSIABMTkyXJMvHThz9OM-1LBsdZjm',
    },
    {
      name: 'Khady Diop',
      location: 'Retrouvée à Touba',
      time: 'Il y a 10 heures',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-sWf_1VvB_JfCVyqu7X9wQZ4s7AChGuzIAxoOu6XljBAT_yHUd6xhXqvw72ZaiHdBmC3MCTS1RG7cTAdn7Qicg-edGA_4B9qQXMOKmW4XBzTtSBvNVvLk0Jr1Nm51kLsvS67LYRgWeWlrCRcBBHx_SNlY5fOnQotzNIPEaoDpy1Hxn0lH9tOa_Ikq8-04dAEyQ0sgn4aLFfah6dXZxzo1VyyDkvG6AfGwLAP2l0fUzR2BXYg7r091vQfjvSRJpGhPV-LGNCoj-Dsw',
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

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col p-6 border-r border-outline bg-white w-72 flex-shrink-0 z-50">
        {/* Logo & Header */}
        <div className="flex flex-col gap-2 mb-10 px-2">
          <img
            alt="BAAWA Logo"
            className="h-14 w-auto object-contain self-start"
            src="https://lh3.googleusercontent.com/aida/ADBb0uihi1Lb4ysvZ8AtbnDJKIj7DxxTEEcCV7VrvBpIzcwaBoYhXGHb-Anx83guv-6OG7tDPcm8E_6Tom0KxhHtYqTlwy4SXrUdtc_2rS2sdsUhXMGzTiH18dyXqQwBCDM14iyfhLcrj25PFI9xSUfbC9dRqZmpfS724VnS54n4YjEW-67JZBxAGQIhaOD0SUoHgm07LigolM4CmYFNUjed07x41io1WD_1MdbdNV6jFOOZxpXirJC0mgfrK7YMz_8o4r_es6TI205IJg"
          />
          <div className="mt-2">
            <h2 className="text-sm font-extrabold text-slate-900 font-montserrat uppercase tracking-tight">
              Centre de Commandement
            </h2>
            <p className="text-[10px] text-slate-500 font-label tracking-widest uppercase font-semibold">
              Unité de Recherche
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-montserrat text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto space-y-4">
          <button className="w-full py-3.5 px-4 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all">
            <span className="material-symbols-outlined text-lg">add_alert</span>
            Signaler une disparition
          </button>
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-error hover:bg-error/5 rounded-lg transition-all duration-200 w-full"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-montserrat text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center h-20 px-10 w-full sticky top-0 z-40 bg-white border-b border-outline">
          <div className="flex items-center gap-4">
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 text-secondary font-bold text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              Direct Live
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Search Bar */}
            <div className="flex items-center bg-slate-100 px-5 py-2.5 rounded-full gap-3 w-96">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full font-label placeholder-slate-400"
                placeholder="Rechercher un dossier ou une zone..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-primary rounded-full transition-all relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-error rounded-full border-2 border-white"></span>
              </button>

              {/* Help */}
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
                <span className="material-symbols-outlined">help</span>
              </button>

              {/* Emergency */}
              <button className="bg-error text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-600 shadow-md shadow-error/10 transition-all">
                Emergency
              </button>

              {/* User Profile */}
              <div className="flex flex-col items-end mr-1">
                <span className="text-sm font-extrabold text-slate-900 leading-none mb-0.5" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Superviseure Senior
                </span>
              </div>

              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-200 bg-primary flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="flex-1 p-10 grid grid-cols-12 gap-8 overflow-y-auto custom-scrollbar">
          {/* KPI Cards */}
          <div className="col-span-12 grid grid-cols-4 gap-6">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white p-6 rounded-lg  shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-secondary/10 rounded-lg" style={{
                    backgroundColor: kpi.icon === 'handshake' ? '#10B981' + '15' :
                                   kpi.icon === 'search_insights' ? '#3B82F6' + '15' :
                                   kpi.icon === 'timer' ? '#F59E0B' + '15' : '#3B82F6' + '15'
                  }}>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: kpi.icon === 'handshake' ? '#10B981' :
                               kpi.icon === 'search_insights' ? '#3B82F6' :
                               kpi.icon === 'timer' ? '#D97706' : '#3B82F6'
                      }}
                    >
                      {kpi.icon}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      color: kpi.icon === 'handshake' ? '#10B981' :
                             kpi.icon === 'search_insights' ? '#3B82F6' :
                             kpi.icon === 'timer' ? '#D97706' : '#3B82F6',
                      backgroundColor: kpi.icon === 'handshake' ? '#10B981' + '15' :
                                       kpi.icon === 'search_insights' ? '#3B82F6' + '15' :
                                       kpi.icon === 'timer' ? '#F59E0B' + '15' : '#3B82F6' + '15'
                    }}
                  >
                    {kpi.trend}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {kpi.label}
                  </p>
                  <h3 className="text-3xl font-bold font-montserrat text-slate-900 mt-1 tracking-tight">
                    {kpi.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section & Right Panel */}
          <div className="col-span-8 bg-white rounded-lg  shadow-sm relative overflow-hidden h-[620px]">
            {/* Map Legend */}
            <div className="absolute top-6 left-6 z-10 space-y-4">
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl ">
                <h4 className="text-[10px] font-extrabold font-montserrat text-slate-400 uppercase tracking-widest mb-3">
                  Légende
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-error ring-4 ring-error/20"></span>
                    Alerte Critique
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></span>
                    Signalement récent
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary ring-4 ring-secondary/20"></span>
                    Unité mobile
                  </div>
                </div>
              </div>
            </div>

            {/* Map Image */}
            <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
              <img
                className="w-full h-full object-cover opacity-60 mix-blend-multiply filter grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs4j9VqV0tfe8YnImwF3ih_XW-eRsNplG_XikyDSiVDeFchPyXgWJlGfB0G1bA80FUXa2de4axGHrclBkGBHwvY8iPBWYDYJ2KsQIeTp1CEnQozWTGPCnrDYSB_H_y_sCnBPFGeWX3lFEulb0GGCckgXHK22nEVRqnzGNGrQRRdsFr94TTWQX2TUYiP-Da1jklOdYvbhw5qOi5DL247m6AkleqR2vARMgUPkL4gj4jMrtyjpkjUGM-PrUhI1N83GWIXdfi0xsP8mzN"
                alt="Map of Senegal"
              />

              {/* Map Markers SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
                <g className="cursor-pointer pointer-events-auto">
                  <circle className="animate-pulse" cx="100" cy="280" fill="#EF4444" r="7"></circle>
                  <text fill="#0F172A" fontFamily="Montserrat" fontSize="12" fontWeight="800" x="112" y="285">
                    Dakar (24)
                  </text>
                  <circle cx="160" cy="270" fill="#F59E0B" r="5"></circle>
                  <text fill="#0F172A" fontFamily="Montserrat" fontSize="10" fontWeight="700" x="172" y="275">
                    Thiès (12)
                  </text>
                  <circle cx="180" cy="80" fill="#EF4444" r="6"></circle>
                  <text fill="#0F172A" fontFamily="Montserrat" fontSize="10" fontWeight="700" x="192" y="85">
                    Saint-Louis (8)
                  </text>
                  <circle cx="280" cy="240" fill="#F59E0B" r="6"></circle>
                  <text fill="#0F172A" fontFamily="Montserrat" fontSize="10" fontWeight="700" x="292" y="245">
                    Touba (15)
                  </text>
                  <circle cx="270" cy="350" fill="#10B981" r="5"></circle>
                  <text fill="#0F172A" fontFamily="Montserrat" fontSize="10" fontWeight="700" x="282" y="355">
                    Kaolack (4)
                  </text>
                  <circle cx="230" cy="520" fill="#EF4444" r="6"></circle>
                  <text fill="#0F172A" fontFamily="Montserrat" fontSize="10" fontWeight="700" x="242" y="525">
                    Ziguinchor (9)
                  </text>
                </g>
              </svg>

              {/* Map Controls */}
              <div className="absolute bottom-10 right-6 flex flex-col gap-3">
                <button className="bg-white p-2.5 rounded-lg shadow-lg  hover:bg-slate-50 text-slate-700 transition-all">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="bg-white p-2.5 rounded-lg shadow-lg  hover:bg-slate-50 text-slate-700 transition-all">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <button className="bg-white p-2.5 rounded-lg shadow-lg  hover:bg-primary hover:text-white text-slate-700 transition-all">
                  <span className="material-symbols-outlined">my_location</span>
                </button>
              </div>
            </div>

            {/* Map Filters */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-outline flex justify-between items-center">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Filtres :
                </span>
                <div className="flex gap-2">
                  <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-extrabold cursor-pointer">
                    Tout voir
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-extrabold hover:bg-slate-200 cursor-pointer transition-all">
                    Enfant
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-extrabold hover:bg-slate-200 cursor-pointer transition-all">
                    Adulte
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Mise à jour : il y a 2 minutes
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-4 flex flex-col gap-8 h-[620px]">
            {/* Critical Alerts */}
            <div className="bg-white rounded-lg  shadow-sm p-6 flex flex-col overflow-hidden max-h-[300px]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-extrabold font-montserrat text-slate-900 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-error text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  Alertes Critiques ({criticalAlerts.length})
                </h3>
                <a href="#" className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-wider">
                  Voir tout
                </a>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg flex gap-4 group hover:bg-opacity-50 transition-all cursor-pointer ${
                      alert.priority === 'critical'
                        ? 'bg-red-50/50 border-error'
                        : 'bg-slate-50 border-orange-500'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border border-red-100 shadow-sm">
                      <img alt={alert.name} className="h-full w-full object-cover" src={alert.image} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900">
                        {alert.name}, {alert.age} ans
                      </h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {alert.location}
                      </p>
                      <p
                        className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${
                          alert.priority === 'critical' ? 'text-error' : 'text-orange-600'
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
                <h3 className="text-sm font-extrabold font-montserrat flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    broadcast_on_home
                  </span>
                  Flux Opérations
                </h3>
                <span className="text-[10px] font-extrabold bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                  24 NOUVEAUX
                </span>
              </div>
              <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar flex-1 relative z-10">
                {operationsFeed.map((item, idx) => (
                  <div
                    key={idx}
                    className={`border-l-2 pl-5 py-0.5 relative ${
                      item.priority === 'high' ? 'border-primary/30' : 'border-white/10'
                    }`}
                  >
                    <div
                      className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                        item.priority === 'high'
                          ? 'bg-primary shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                          : 'bg-slate-700'
                      }`}
                    ></div>
                    <p
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        item.priority === 'high' ? 'text-primary' : 'text-slate-500'
                      }`}
                    >
                      {item.time}
                    </p>
                    <p
                      className={`text-xs font-medium leading-relaxed mt-1 ${
                        item.priority === 'high' ? 'text-white font-bold uppercase tracking-tight' : 'text-slate-300'
                      }`}
                    >
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-extrabold transition-all shadow-lg shadow-primary/20">
                Ouvrir le terminal complet
              </button>
            </div>
          </div>

          {/* Recent Successes */}
          <div className="col-span-12 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold font-montserrat text-slate-900 tracking-tight">
                Dernières Retrouvailles
              </h3>
              <div className="flex gap-3">
                <button className="p-2.5 bg-white  rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="p-2.5 bg-white  rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {recentSuccesses.map((success, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-lg shadow-sm  flex items-center gap-5 group hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 relative ring-2 ring-slate-100">
                    <img alt={success.name} className="h-full w-full object-cover" src={success.image} />
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
                    <h4 className="text-xs font-extrabold text-slate-900">{success.name}</h4>
                    <p className="text-[10px] text-secondary font-extrabold mt-1 uppercase tracking-wider">
                      {success.location}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{success.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Float FAB */}
      <button className="fixed bottom-10 right-10 h-16 w-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group hover:bg-primary-hover ring-4 ring-primary/20">
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-6 bg-slate-900 text-white px-5 py-3 rounded-lg text-sm font-extrabold opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
          Signaler une disparition
        </span>
      </button>
    </div>
  )
}
