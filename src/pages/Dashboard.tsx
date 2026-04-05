import { useState } from 'react'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'Sûr', value: '3', textColor: '#0066FF', bgColor: '#0066FF1a' },
    { label: 'Zone Étendue', value: '1', textColor: '#eb851c', bgColor: '#eb851c1a' },
    { label: 'Alerte', value: '1', textColor: '#FF3B30', bgColor: '#FF3B301a' },
  ]

  const members = [
    {
      id: 1,
      name: 'Papa Samba',
      relationship: 'Grand-père',
      location: 'Terminal du Ferry de Gorée',
      status: 'sos',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwUQVOh2rgw4UswhDIOtd76iU4UaiCyRXqzPwGmcLv6vCSSS9Dc_C9FGNor5NrKX8Swljoz1Y7g2aV4tSXMSh5Pv35T5gpAz7m8M8cctK4jVOpWXCcQVvQkl_H44mBpI66XMLwadMquN9UTIA1Lt0b55UP-RYaOw0BI3zwXl8bmTq5TTZV7rkkuDcWgdpbg2dw-SvLbMjeu4LwWdz1VI0xh0SbO2inSHuKWgMQk_NUvc7h3wNsiU3U2YF782d4EXudzWFDwP5l8xs3',
    },
    {
      id: 2,
      name: 'Moussa',
      relationship: 'Fils • Université',
      battery: 82,
      status: 'safe',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC23NJTJ6Kqvd5KDOXdEo3ou3nvkNyomdnel-FQOqJS07eHKU9e18m-r8KDr_mCvQ8LJmKEdb2CMtKTQH_T8RsnMA4mJZTFFgCUiC_wSjdNiLiq_5ED8sQD8MslxuZK7MfJzjsoLpib9AB6exNo_9lzj00YqPV0d0Sc4PZT3lXGxK17P_dACJlKgR2Yr7B9exHXbL7MSY_MqEvGQsFNdKAUdoAoeVUzi7KMhgneWouEUsGxA6v6aIjZr3qIaidaF5G4952ri-Dl_edZ',
    },
    {
      id: 3,
      name: 'Awa',
      relationship: 'Fille • École',
      location: 'Hors de la zone scolaire depuis 15 mins',
      status: 'away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9CCNPXtDHpwn8e_iPs_do7S4WUkGzCtoMU0kYShhMQS-1xOokTb2KH5uUfglOBY-eBjejBPwpP1rLCSykPk3ecIPsJ2W1cRrn90T-LXfM1Mw0bbG_7WfrS0VusNSOOPUszTKBE7LAqm7hpcIy_FbKQeQ05XGzJuwHYGqzTDO07OL4T5Muo7VRuOgG2rbVKQ4qMe2zIVSuAXRLg14IHUP7ZiYnRbPyZ9owISTC86ZJLG-P8IeqIZGLeD6hxVjK_yXouKInACE1AInp',
    },
  ]

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col md:flex-row">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none h-16 flex justify-between items-center px-8">
        <div className="flex items-center gap-8">
          <div className="h-10 w-auto flex items-center font-headline font-bold text-2xl text-primary">
            BA
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <a className="font-headline text-sm font-medium transition-colors dark:text-blue-400 border-b-2 pb-1 text-primary border-primary" href="#">
              Tableau de Bord
            </a>
            <a className="font-headline text-sm font-medium transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-700" href="#">
              Carte
            </a>
            <a className="font-headline text-sm font-medium transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-700" href="#">
              Alertes
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container-high transition-colors">
              notifications
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container-high transition-colors">
            settings
          </span>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-headline text-sm font-bold active:scale-95 duration-150 shadow-lg shadow-primary/20">
            Nouveau Signalement
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-highest bg-primary flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </header>

      {/* Side Navigation Bar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-slate-50 dark:bg-slate-950 flex flex-col p-4 z-40 transition-all duration-200 ease-in-out border-r border-transparent md:flex hidden">
        <div className="mb-8 px-4">
          <h2 className="text-blue-900 dark:text-blue-50 font-headline font-bold text-lg">Tableau de Bord</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Gestion des Signalements</p>
        </div>
        <nav className="flex-1 space-y-2">
          <a className="text-blue-700 dark:text-blue-300 font-bold flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-3 transition-all duration-200" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              map
            </span>
            <span className="font-headline">Carte Tactique</span>
          </a>
          <a className="text-slate-600 dark:text-slate-400 flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200" href="#">
            <span className="material-symbols-outlined">group</span>
            <span className="font-headline">Signalements</span>
          </a>
          <a className="text-slate-600 dark:text-slate-400 flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200" href="#">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="font-headline">Alertes</span>
          </a>
          <a className="text-slate-600 dark:text-slate-400 flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200" href="#">
            <span className="material-symbols-outlined">history</span>
            <span className="font-headline">Historique</span>
          </a>
        </nav>
        <div className="mt-auto space-y-4">
          <button className="w-full bg-error text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-error/20 active:scale-[0.98] transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            Alerte Urgence
          </button>
          <a className="text-slate-600 dark:text-slate-400 flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined">help</span>
            <span className="font-headline">Centre d'aide</span>
          </a>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 mt-16 relative w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* Background Map */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpsRYvD1hUOavvrvZ5qlf4ZAopYILEexQ7KRv7HsrJGmzoW46mTX-4D7M9G9jsF2Mz-AgHdDRgilIaAFE3VEplwM3TKTiWSvOy12hrJDNI_Jg59OBrv2My5tWqKOuaGW51ScjzFN6Ti_yngaib5DimzBUEyCf7bBMGMQQ-b15WIMJgDL7eYAkwwo6o0MURxioedtxRcObltycfxsPNi8pIE4UgeWoCN9sp1ZPORQJjW9P8pH7KtHZOapDgUL66zZ_01-KZeyOZLFlY"
            alt="Mapa Dakar"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 pointer-events-none"></div>
        </div>

        {/* Floating Markers */}
        <div className="absolute top-[25%] left-[35%] z-10">
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-secondary shadow-2xl overflow-hidden ring-4 ring-white/50">
              <img className="w-full h-full object-cover" src={members[1].image} alt="Member safe" />
            </div>
            <div className="mt-2 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Zone Sûre
            </div>
            <div className="w-1 h-4 bg-secondary/80 rounded-full mt-1"></div>
          </div>
        </div>

        <div className="absolute top-[45%] left-[60%] z-10">
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-on-tertiary-container shadow-2xl overflow-hidden ring-4 ring-white/50">
              <img className="w-full h-full object-cover" src={members[2].image} alt="Member away" />
            </div>
            <div className="mt-2 bg-on-tertiary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Zone Étendue
            </div>
            <div className="w-1 h-4 bg-on-tertiary-container/80 rounded-full mt-1"></div>
          </div>
        </div>

        <div className="absolute top-[70%] left-[45%] z-10">
          <div className="relative flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full border-4 border-error shadow-2xl overflow-hidden ring-4 ring-white/50"
              style={{ boxShadow: '0 0 20px rgba(255, 59, 48, 0.6)' }}
            >
              <img className="w-full h-full object-cover" src={members[0].image} alt="Member alert" />
            </div>
            <div className="mt-2 bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Alerte SOS
            </div>
            <div className="w-1 h-4 bg-error/80 rounded-full mt-1"></div>
          </div>
        </div>

        {/* Right Sidebar: Active Members */}
        <div className="absolute top-6 right-6 bottom-6 w-80 flex flex-col gap-4 z-20 overflow-hidden hidden lg:flex">
          {/* Summary Stats Card */}
          <div className="glass p-5 rounded-2xl border border-white/40 shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
            <h3 className="font-headline text-primary font-bold text-lg mb-4">Aperçu des Signalements</h3>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: stat.bgColor }}>
                  <span className="block font-extrabold text-xl" style={{ color: stat.textColor }}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-tighter" style={{ color: stat.textColor }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Member List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {members.map((member) => (
              <div
                key={member.id}
                className={`glass p-4 rounded-2xl border-2 shadow-2xl relative overflow-hidden ${
                  member.status === 'sos'
                    ? 'border-error/30 bg-red-50/30'
                    : 'border-white/40'
                }`}
                style={{
                  background: member.status === 'sos' ? 'rgba(255, 59, 48, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {member.status === 'sos' && (
                  <div className="absolute top-0 right-0 bg-error px-3 py-1 rounded-bl-xl text-white text-[10px] font-bold uppercase tracking-widest">
                    Urgent
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0">
                    <img className="w-full h-full object-cover" src={member.image} alt={member.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-primary truncate">{member.name}</h4>
                      {member.status !== 'sos' && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            member.status === 'safe'
                              ? 'bg-secondary'
                              : 'bg-on-tertiary-container'
                          }`}
                        ></span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mb-2">{member.relationship}</p>
                    {member.status === 'sos' ? (
                      <div className="flex items-center gap-1 text-error">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          location_on
                        </span>
                        <span className="text-[11px] font-semibold">{member.location}</span>
                      </div>
                    ) : member.status === 'safe' ? (
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="material-symbols-outlined text-sm">battery_5_bar</span>
                        <span className="text-[11px]">{member.battery}% • Actif il y a 2 mins</span>
                      </div>
                    ) : (
                      <div className="bg-on-tertiary-container/10 p-2 rounded-lg mt-1">
                        <p className="text-[10px] text-on-tertiary-fixed-variant font-medium">{member.location}</p>
                      </div>
                    )}
                  </div>
                </div>
                {member.status === 'sos' && (
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-error text-white text-xs font-bold py-2 rounded-lg hover:bg-on-error-container transition-colors">
                      Appel d'Urgence
                    </button>
                    <button className="px-3 bg-surface-container-high rounded-lg text-primary">
                      <span className="material-symbols-outlined text-lg">directions</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Left Top Widget: Search & Filters */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-3 w-64">
          <div className="glass flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/40 shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none p-0 text-sm focus:ring-0 placeholder:text-on-surface-variant/60 w-full"
              placeholder="Rechercher un signalement..."
            />
          </div>
          <div className="flex gap-2">
            <button className="glass px-4 py-2 rounded-full text-[11px] font-bold text-primary border border-white/60 shadow-sm hover:bg-white transition-colors" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
              Repères
            </button>
            <button className="glass px-4 py-2 rounded-full text-[11px] font-bold text-primary border border-white/60 shadow-sm hover:bg-white transition-colors" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
              Trafic
            </button>
          </div>
        </div>

        {/* Bottom Left: Safety Metrics */}
        <div className="absolute bottom-6 left-6 z-20 hidden md:block">
          <div className="glass p-4 rounded-2xl border border-white/40 shadow-xl max-w-xs" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Indice de Sécurité</p>
                <p className="text-lg font-extrabold text-primary">Stabilité Élevée</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-tertiary-fixed-dim to-secondary w-[88%] rounded-full"></div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 leading-tight">
              Tous les signalements sont actuellement stables dans la région de Dakar.
            </p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="fixed bottom-10 right-96 z-30 flex flex-col gap-2 hidden lg:flex">
          <button className="w-10 h-10 glass rounded-xl border border-white/40 shadow-lg flex items-center justify-center text-primary hover:bg-white transition-all" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="w-10 h-10 glass rounded-xl border border-white/40 shadow-lg flex items-center justify-center text-primary hover:bg-white transition-all" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button className="w-10 h-10 glass rounded-xl border border-white/40 shadow-lg flex items-center justify-center text-primary hover:bg-white transition-all" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </main>
    </div>
  )
}
