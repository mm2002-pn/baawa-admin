import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useStudentPositions } from '../../hooks/useStudentPositions'
import type { TraccarPosition, TrackerStatus } from '../../api/types'

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

const STATUS_STYLES: Record<TrackerStatus, { label: string; className: string }> = {
  online: { label: 'En ligne', className: 'bg-green-100 text-green-700' },
  offline: { label: 'Hors ligne', className: 'bg-red-100 text-red-700' },
  unknown: { label: 'Jamais connecté', className: 'bg-slate-100 text-slate-500' },
}

function StatusBadge({ status }: { status: TrackerStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.unknown
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.className}`}>{s.label}</span>
}

function batteryText(position: TraccarPosition | null): string {
  if (!position || position.batteryLevel == null) return '—'
  return `${position.batteryLevel} %${position.charging ? ' (en charge)' : ''}`
}

function batteryClass(position: TraccarPosition | null): string {
  if (!position || position.batteryLevel == null) return 'text-slate-400'
  if (position.batteryLevel <= 20) return 'text-red-600 font-semibold'
  if (position.batteryLevel <= 40) return 'text-amber-600'
  return 'text-slate-700'
}

export default function MapViewPage() {
  const { data: entries, isLoading, isError } = useStudentPositions()
  const located = (entries ?? []).filter((e) => e.position)
  const unlocated = (entries ?? []).filter((e) => !e.position)

  return (
    <AdminLayout title="Carte des élèves">
      <div className="relative isolate bg-white border border-slate-100 rounded-xl overflow-hidden mb-4" style={{ height: 480 }}>
        <MapContainer center={SENEGAL_CENTER} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {located.map((e) => (
            <Marker key={e.studentId} position={[e.position!.latitude, e.position!.longitude]}>
              <Popup>
                <strong>{e.firstName} {e.lastName}</strong> <StatusBadge status={e.deviceStatus} /><br />
                {new Date(e.position!.fixTime).toLocaleString()}<br />
                Batterie : <span className={batteryClass(e.position)}>{batteryText(e.position)}</span>
                {e.position!.address ? <><br />{e.position!.address}</> : null}
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
          <p className="text-sm text-slate-500 mb-3">{located.length} élève(s) localisé(s) · {unlocated.length} sans position</p>
          {(entries ?? []).length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-4 font-medium">Élève</th>
                    <th className="py-2 pr-4 font-medium">Traceur</th>
                    <th className="py-2 pr-4 font-medium">Batterie</th>
                    <th className="py-2 font-medium">Dernière activité</th>
                  </tr>
                </thead>
                <tbody>
                  {(entries ?? []).map((e) => (
                    <tr key={e.studentId} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 pr-4 text-slate-800">{e.firstName} {e.lastName}</td>
                      <td className="py-2 pr-4"><StatusBadge status={e.deviceStatus} /></td>
                      <td className={`py-2 pr-4 ${batteryClass(e.position)}`}>{batteryText(e.position)}</td>
                      <td className="py-2 text-slate-500">
                        {e.lastUpdate ? new Date(e.lastUpdate).toLocaleString() : 'Jamais'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
