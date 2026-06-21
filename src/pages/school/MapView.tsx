import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useStudentPositions } from '../../hooks/useStudentPositions'

// Fix for default marker icons in React-Leaflet (bundlers break Leaflet's icon resolution)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const SENEGAL_CENTER: [number, number] = [14.7167, -17.4677]

export default function MapViewPage() {
  const { data: entries, isLoading, isError } = useStudentPositions()
  const located = (entries ?? []).filter((e) => e.position)
  const unlocated = (entries ?? []).filter((e) => !e.position)

  return (
    <AdminLayout title="Carte des élèves">
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden mb-4" style={{ height: 480 }}>
        <MapContainer center={SENEGAL_CENTER} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {located.map((e) => (
            <Marker key={e.studentId} position={[e.position!.latitude, e.position!.longitude]}>
              <Popup>
                <strong>{e.firstName} {e.lastName}</strong><br />
                {new Date(e.position!.fixTime).toLocaleString()}<br />
                {e.position!.address || ''}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {isError ? (
        <p className="text-red-600 text-sm">Impossible de récupérer les positions. Réessai automatique…</p>
      ) : isLoading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl p-4">
          <p className="text-sm text-slate-500 mb-2">{located.length} élève(s) localisé(s) · {unlocated.length} sans position</p>
          {unlocated.length > 0 && (
            <div className="text-sm text-slate-500">
              <span className="font-semibold">Pas encore localisés :</span>{' '}
              {unlocated.map((e) => `${e.firstName} ${e.lastName}`).join(', ')}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
