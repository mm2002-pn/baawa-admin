import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon, LatLngExpression, LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'

// Fix pour les icônes par défaut de Leaflet avec Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
if (Icon.Default.prototype._getIconUrl) {
  // @ts-ignore
  delete Icon.Default.prototype._getIconUrl
}

Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const SENEGAL_CENTER: LatLngExpression = [14.4974, -14.4524]

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialLocation?: { lat: number; lng: number }
}

function MapEvents({ onSelect }: { onSelect: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(
    initialLocation ? new LatLng(initialLocation.lat, initialLocation.lng) : null
  )
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)

  // Mettre à jour la position si les props changent (ex: reset du formulaire)
  useEffect(() => {
    if (initialLocation) {
      setPosition(new LatLng(initialLocation.lat, initialLocation.lng))
    } else {
      setPosition(null)
    }
  }, [initialLocation])

  const handleMapClick = async (latlng: LatLng) => {
    setPosition(latlng)
    setIsReverseGeocoding(true)

    let address = ""
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr' // Pour avoir l'adresse en français
          }
        }
      )
      const data = await response.json()
      address = data.display_name || ""
    } catch (error) {
      console.error("Erreur de géocodage inverse:", error)
    } finally {
      setIsReverseGeocoding(false)
      onLocationSelect(latlng.lat, latlng.lng, address)
    }
  }

  return (
    <div className="space-y-2">
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
        <MapContainer
          center={position ? [position.lat, position.lng] : SENEGAL_CENTER}
          zoom={position ? 15 : 7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <Marker position={position} />}
          <MapEvents onSelect={handleMapClick} />
        </MapContainer>
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 min-h-[40px]">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-blue-600 text-sm ${isReverseGeocoding ? 'animate-spin' : ''}`}>
            {isReverseGeocoding ? 'sync' : 'location_on'}
          </span>
          <span className="text-xs font-bold text-blue-700">
            {isReverseGeocoding 
              ? "Recherche de l'adresse..." 
              : position 
                ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
                : "Cliquez sur la carte pour sélectionner le lieu"}
          </span>
        </div>
        {!position && !isReverseGeocoding && (
          <span className="text-[10px] text-blue-500 animate-pulse font-medium uppercase tracking-wider">
            Sélectionnez un point
          </span>
        )}
      </div>
    </div>
  )
}
