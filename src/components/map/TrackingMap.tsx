import { useEffect, useMemo, useRef } from 'react'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TraccarPosition, TrackerLive } from '../../api/types'
import { initialsOf, shortDateTime, trackingSummary, TrackingTone } from '../../utils/tracking'
import { Battery, TrackingPill } from '../trackers/TrackerBits'

export interface MapPoint extends TrackerLive {
  id: string
  name: string
  subtitle?: string | null
}

const SENEGAL_CENTER: [number, number] = [14.7167, -17.4677]

const TONE_COLORS: Record<TrackingTone, string> = {
  green: '#12b76a',
  amber: '#f79009',
  red: '#f04438',
  slate: '#98a2b3',
}

/** Repère rond aux initiales, coloré selon l'état du boîtier. */
function markerIcon(name: string, tone: TrackingTone, selected: boolean) {
  const size = selected ? 44 : 36
  const color = TONE_COLORS[tone]
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;font:800 ${selected ? 14 : 12}px Inter,system-ui,sans-serif;
      border:3px solid #fff;box-shadow:0 4px 12px rgba(16,24,40,.35)${selected ? `,0 0 0 4px ${color}55` : ''};">${initialsOf(name)}</div>`,
  })
}

function Viewport({ points, selected, route }: {
  points: [number, number][]
  selected: [number, number] | null
  route: [number, number][]
}) {
  const map = useMap()
  const fitted = useRef(false)

  // Cadrage initial sur l'ensemble des repères, une seule fois : les
  // rafraîchissements suivants ne doivent pas défaire le zoom de l'utilisateur.
  useEffect(() => {
    if (fitted.current || points.length === 0) return
    map.fitBounds(L.latLngBounds(points), { padding: [56, 56], maxZoom: 16 })
    fitted.current = true
  }, [points, map])

  const [lat, lng] = selected ?? []
  useEffect(() => {
    if (lat === undefined || lng === undefined) return
    map.flyTo([lat, lng], Math.max(map.getZoom(), 16), { duration: 0.6 })
  }, [lat, lng, map])

  const routeKey = route.length ? `${route.length}:${route[0]}:${route[route.length - 1]}` : ''
  useEffect(() => {
    if (route.length > 1) map.fitBounds(L.latLngBounds(route), { padding: [56, 56], maxZoom: 17 })
    // routeKey résume le trajet : inutile de recadrer tant qu'il ne change pas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, map])

  return null
}

interface TrackingMapProps {
  points: MapPoint[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  /** Trajet à tracer (points dans l'ordre chronologique) */
  route?: TraccarPosition[]
  className?: string
}

export function TrackingMap({ points, selectedId, onSelect, route = [], className }: TrackingMapProps) {
  const located = useMemo(() => points.filter((p) => p.position), [points])
  const coords = useMemo(
    () => located.map((p) => [p.position!.latitude, p.position!.longitude] as [number, number]),
    [located],
  )
  const routeCoords = useMemo(() => route.map((p) => [p.latitude, p.longitude] as [number, number]), [route])
  const selected = located.find((p) => p.id === selectedId)

  return (
    // `isolate` : les calques Leaflet ont des z-index élevés qui passeraient sinon au-dessus des menus
    <div className={`relative isolate overflow-hidden ${className ?? ''}`}>
      <MapContainer center={SENEGAL_CENTER} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Viewport
          points={coords}
          selected={selected ? [selected.position!.latitude, selected.position!.longitude] : null}
          route={routeCoords}
        />

        {routeCoords.length > 1 && (
          <>
            <Polyline positions={routeCoords} pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.75 }} />
            <CircleMarker center={routeCoords[0]} radius={6} pathOptions={{ color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }}>
              <Tooltip>Départ — {shortDateTime(route[0].fixTime)}</Tooltip>
            </CircleMarker>
          </>
        )}

        {located.map((p) => {
          const summary = trackingSummary(p)
          const position = p.position!
          return (
            <Marker
              key={p.id}
              position={[position.latitude, position.longitude]}
              icon={markerIcon(p.name, summary.tone, p.id === selectedId)}
              zIndexOffset={p.id === selectedId ? 1000 : 0}
              eventHandlers={{ click: () => onSelect?.(p.id) }}
            >
              <Popup>
                <div className="min-w-[190px] font-sans">
                  <p className="font-extrabold text-[14px] text-[#101828] !m-0">{p.name}</p>
                  {p.subtitle && <p className="text-[12px] text-[#98a2b3] !m-0 !mt-0.5">{p.subtitle}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <TrackingPill live={p} />
                    <Battery position={position} />
                  </div>
                  <p className="text-[12px] text-[#475467] !m-0 !mt-2">{summary.detail}</p>
                  <p className="text-[12px] text-[#98a2b3] !m-0 !mt-1">
                    {shortDateTime(position.fixTime)}
                    {position.speedKmh > 0 ? ` · ${position.speedKmh} km/h` : ''}
                  </p>
                  {position.address && <p className="text-[12px] text-[#475467] !m-0 !mt-1">{position.address}</p>}
                  <a
                    href={`https://maps.google.com/?q=${position.latitude},${position.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[12px] font-bold !text-[#2563eb] mt-2"
                  >
                    Ouvrir dans Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
