import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Signalement } from '../../api/types'
import { useResolveSignalement, useVerifySignalement, useDeleteSignalement } from '../../hooks/useSignalements'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Correction des icônes Leaflet par défaut
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface SignalementDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  signalement: Signalement | null
}

export default function SignalementDetailsDrawer({ isOpen, onClose, signalement }: SignalementDetailsDrawerProps) {
  const verifyMutation = useVerifySignalement()
  const resolveMutation = useResolveSignalement()
  const deleteMutation = useDeleteSignalement()

  if (!signalement) return null

  const mp = signalement.missingPerson
  const reporter = signalement.reporter

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'PUBLISHED': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'VERIFIED': return 'bg-green-100 text-green-700 border-green-200'
      case 'ARCHIVED': return 'bg-slate-100 text-slate-700 border-slate-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'PUBLISHED': return 'Publié'
      case 'VERIFIED': return 'Vérifié'
      case 'ARCHIVED': return 'Archivé'
      default: return status
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1001] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[1002] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-extrabold text-slate-900">Détails du Signalement</h2>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(signalement.status)}`}>
                {getStatusLabel(signalement.status)}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">ID: {signalement.id.substring(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex gap-6 items-start">
              <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white flex-shrink-0">
                <img 
                  src={mp?.photoUrl || 'https://via.placeholder.com/150'} 
                  alt={mp?.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-black text-slate-900 mb-1">{mp?.fullName}</h3>
                <div className="flex flex-wrap gap-y-2 gap-x-4">
                  <span className="flex items-center gap-1.5 text-slate-600 font-bold text-sm">
                    <span className="material-symbols-outlined text-lg text-blue-600">person</span>
                    {mp?.age} ans • {mp?.gender}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 font-bold text-sm">
                    <span className="material-symbols-outlined text-lg text-red-600">location_on</span>
                    {mp?.region}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Disappearance Details */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">event_busy</span>
                Détails de la disparition
              </h4>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Date</label>
                    <p className="text-sm font-bold text-slate-700">
                      {mp?.disappearanceDate ? format(new Date(mp.disappearanceDate), 'dd MMMM yyyy', { locale: fr }) : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Heure</label>
                    <p className="text-sm font-bold text-slate-700">{mp?.disappearanceTime || '-'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Dernière adresse connue</label>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{mp?.lastAddress || '-'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Localisation sur la carte</label>
                  <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
                    <MapContainer 
                      center={[mp?.lastLatitude || 14.7167, mp?.lastLongitude || -17.4677]} 
                      zoom={15} 
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[mp?.lastLatitude || 14.7167, mp?.lastLongitude || -17.4677]}>
                        <Popup>Dernière position connue</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Description des vêtements</label>
                  <p className="text-sm text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200 mt-1">
                    "{mp?.clothingDescription || 'Aucune description fournie'}"
                  </p>
                </div>
              </div>
            </section>

            {/* Reporter Info */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">record_voice_over</span>
                Informations du déclarant
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Nom</label>
                  <p className="text-sm font-bold text-slate-900">{reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Inconnu'}</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Relation</label>
                  <p className="text-sm font-bold text-slate-900">{signalement.relationship}</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Téléphone de contact</label>
                  <p className="text-sm font-bold text-blue-600">{signalement.phoneNumber}</p>
                </div>
              </div>
            </section>

            {/* Timeline/History */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span>
                Historique
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-slate-100">
                <div className="relative pl-6">
                  <div className="absolute left-[-9px] top-1.5 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-400">Signalé le</p>
                  <p className="text-sm font-bold text-slate-700">
                    {signalement.createdAt ? format(new Date(signalement.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr }) : '-'}
                  </p>
                </div>
                {signalement.verifiedAt && (
                  <div className="relative pl-6">
                    <div className="absolute left-[-9px] top-1.5 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-400">Vérifié le</p>
                    <p className="text-sm font-bold text-slate-700">
                      {format(new Date(signalement.verifiedAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-3">
          {signalement.status === 'PENDING' && (
            <button 
              onClick={() => verifyMutation.mutate(signalement.id)}
              disabled={verifyMutation.isPending}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Vérifier
            </button>
          )}
          {signalement.status !== 'ARCHIVED' && (
            <button 
              onClick={() => resolveMutation.mutate(signalement.id)}
              disabled={resolveMutation.isPending}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">verified</span>
              Résoudre
            </button>
          )}
          <button 
            onClick={() => deleteMutation.mutate(signalement.id, { onSuccess: onClose })}
            disabled={deleteMutation.isPending}
            className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            Supprimer
          </button>
        </div>
      </div>
    </>
  )
}
