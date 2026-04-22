import { User, Role } from '../../api/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface UserDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export default function UserDetailsDrawer({ isOpen, onClose, user }: UserDetailsDrawerProps) {
  if (!user) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1001] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[1002] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xl font-extrabold text-slate-900">Détails Utilisateur</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            
            {/* Profile Header */}
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                <span className="text-2xl font-black text-blue-600">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{user.firstName} {user.lastName}</h3>
              <p className="text-slate-500 font-bold">{user.email}</p>
              
              <div className="mt-4 flex justify-center gap-2">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  user.role === Role.ADMIN_BAAWA ? 'bg-purple-100 text-purple-700' :
                  user.role === Role.POLICIER ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {user.role}
                </span>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            {/* Info Sections */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</label>
                  <p className="text-sm font-extrabold text-slate-900">{user.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date d'inscription</label>
                  <p className="text-sm font-extrabold text-slate-900">
                    {format(new Date(user.createdAt), 'd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Zone Géo</label>
                  <p className="text-sm font-extrabold text-slate-900">{user.zoneGeo || 'Sénégal (National)'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vérifié</label>
                  <p className={`text-sm font-extrabold ${user.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {user.isVerified ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>

              {/* Specific Officer Data */}
              {user.role === Role.POLICIER && user.officer && (
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">policy</span>
                    Informations Professionnelles
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                      <span className="text-xs text-blue-700/60 font-bold uppercase">Matricule</span>
                      <span className="text-sm font-black text-blue-900">{user.officer.badgeNumber}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                      <span className="text-xs text-blue-700/60 font-bold uppercase">Grade</span>
                      <span className="text-sm font-black text-blue-900">{user.officer.rank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-700/60 font-bold uppercase">Unité</span>
                      <span className="text-sm font-black text-blue-900">{user.officer.policeUnit}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity (Placeholder) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Activité Récente</h4>
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <p className="text-xs text-slate-600 flex-1">
                    Dernière connexion le {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'd MMM à HH:mm', { locale: fr }) : 'Jamais'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
             <button 
               onClick={onClose}
               className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
             >
               Fermer
             </button>
          </div>
        </div>
      </div>
    </>
  )
}
