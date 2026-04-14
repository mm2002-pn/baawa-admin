import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
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

// Senegal center coordinates
const SENEGAL_CENTER: LatLngExpression = [14.4974, -14.4524]
const SENEGAL_ZOOM = 7

// Custom marker icons
const createIcon = (color: 'red' | 'orange' | 'green') => {
  const colors = {
    red: '#EF4444',
    orange: '#F97316',
    green: '#22C55E',
  }

  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${colors[color]}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const criticalIcon = createIcon('red')
const recentIcon = createIcon('orange')
const unitIcon = createIcon('green')

interface AlertMarker {
  id: string
  position: LatLngExpression
  name: string
  age?: number
  location: string
  type: 'critical' | 'recent' | 'unit'
  elapsed?: string
  photoUrl?: string
}

interface SenegalMapProps {
  markers?: AlertMarker[]
  height?: string
}

// Map controls component
function MapControls() {
  const map = useMap()

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="bg-white p-2 rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <span className="material-symbols-outlined text-slate-700">add</span>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white p-2 rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <span className="material-symbols-outlined text-slate-700">remove</span>
      </button>
      <button
        onClick={() => map.setView(SENEGAL_CENTER, SENEGAL_ZOOM)}
        className="bg-white p-2 rounded-lg shadow-lg border border-slate-200 hover:bg-blue-600 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">my_location</span>
      </button>
    </div>
  )
}

export default function SenegalMap({ markers = [], height = '320px' }: SenegalMapProps) {
  // Demo markers if none provided
  const demoMarkers: AlertMarker[] = markers.length > 0 ? markers : [
    {
      id: '1',
      position: [14.7167, -17.4677], // Dakar
      name: 'Amina Sow',
      age: 7,
      location: 'Parcelles Assainies, Dakar',
      type: 'critical',
      elapsed: '2h',
    },
    {
      id: '2',
      position: [14.7645, -16.9620], // Mbour
      name: 'Ibrahima Diallo',
      age: 68,
      location: 'Mbour, Thiès',
      type: 'recent',
      elapsed: '5h',
    },
    {
      id: '3',
      position: [14.1652, -16.0758], // Kaolack
      name: 'Unité Mobile #04',
      location: 'Kaolack',
      type: 'unit',
    },
    {
      id: '4',
      position: [16.0179, -16.4896], // Saint-Louis
      name: 'Fatou Ndiaye',
      age: 12,
      location: 'Saint-Louis',
      type: 'critical',
      elapsed: '1h',
    },
  ]

  const getIcon = (type: AlertMarker['type']) => {
    switch (type) {
      case 'critical': return criticalIcon
      case 'recent': return recentIcon
      case 'unit': return unitIcon
      default: return recentIcon
    }
  }

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={SENEGAL_CENTER}
        zoom={SENEGAL_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {demoMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getIcon(marker.type)}
          >
            <Popup>
              <div className="text-sm min-w-[150px]">
                {marker.photoUrl && (
                  <img
                    src={marker.photoUrl}
                    alt={marker.name}
                    className="w-16 h-16 object-cover rounded-lg mb-2 mx-auto"
                  />
                )}
                <p className="font-bold text-slate-900 text-center">
                  {marker.name}{marker.age ? `, ${marker.age} ans` : ''}
                </p>
                <p className="text-slate-600 text-xs mt-1 text-center">{marker.location}</p>
                {marker.elapsed && (
                  <p className={`text-xs mt-1 font-semibold text-center ${
                    marker.type === 'critical' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {marker.elapsed} écoulées
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapControls />
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Légende
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="h-3 w-3 rounded-full bg-red-500 ring-2 ring-red-200"></span>
            Alerte Critique
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="h-3 w-3 rounded-full bg-orange-500 ring-2 ring-orange-200"></span>
            Signalement récent
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-200"></span>
            Unité mobile
          </div>
        </div>
      </div>
    </div>
  )
}
