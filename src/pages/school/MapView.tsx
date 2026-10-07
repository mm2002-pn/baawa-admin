import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { TrackingMap } from '../../components/map/TrackingMap'
import { Battery, TrackingPill } from '../../components/trackers/TrackerBits'
import { Avatar, Btn, EmptyState, ErrorNote, IconBtn, Loading, Panel, Segmented } from '../../components/ui/kit'
import { useStudentPositions, useStudentRoute } from '../../hooks/useStudentPositions'
import { StudentPositionEntry, TraccarPosition } from '../../api/types'
import { cn } from '../../utils/cn'
import { shortDateTime, timeAgo, trackerName, trackingSummary } from '../../utils/tracking'

type RouteRange = 'none' | '1' | '6' | '24'

/** Distance parcourue le long du trajet, en kilomètres (formule de haversine). */
function routeDistanceKm(route: TraccarPosition[]) {
  const rad = (deg: number) => (deg * Math.PI) / 180
  let total = 0
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1]
    const b = route[i]
    const dLat = rad(b.latitude - a.latitude)
    const dLon = rad(b.longitude - a.longitude)
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2
    total += 2 * 6371 * Math.asin(Math.sqrt(h))
  }
  return total
}

// Les élèves qui demandent de l'attention remontent en tête de liste
const TONE_ORDER = { red: 0, amber: 1, slate: 2, green: 3 }

function StudentDetails({ entry, range, onRange, onClose }: {
  entry: StudentPositionEntry
  range: RouteRange
  onRange: (range: RouteRange) => void
  onClose: () => void
}) {
  const hours = range === 'none' ? null : Number(range)
  const { data: route, isFetching } = useStudentRoute(entry.studentId, hours)
  const summary = trackingSummary(entry)
  const { position } = entry

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <Avatar name={`${entry.firstName} ${entry.lastName}`} size={46} />
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-[16px] text-[#101828] truncate">{entry.firstName} {entry.lastName}</p>
          <p className="text-[13px] font-semibold text-[#98a2b3] truncate">
            {entry.className || 'Classe non renseignée'}
            {entry.tracker && ` · ${trackerName(entry.tracker)}`}
          </p>
        </div>
        <IconBtn icon="close" label="Revenir à la liste" onClick={onClose} className="-mr-2 -mt-1" />
      </div>

      <div className="rounded-xl border border-[#eef1f5] bg-[#f9fafc] p-4">
        <div className="flex items-center justify-between gap-2">
          <TrackingPill live={entry} />
          <Battery position={position} />
        </div>
        <p className="text-[13px] text-[#475467] mt-3">{summary.detail}</p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3 text-[12.5px]">
          <dt className="text-[#98a2b3]">Dernier signal</dt>
          <dd className="text-right font-semibold text-[#101828]">{entry.lastUpdate ? timeAgo(entry.lastUpdate) : 'Jamais'}</dd>
          {position && (
            <>
              <dt className="text-[#98a2b3]">Point GPS</dt>
              <dd className="text-right font-semibold text-[#101828]">{shortDateTime(position.fixTime)}</dd>
              <dt className="text-[#98a2b3]">Vitesse</dt>
              <dd className="text-right font-semibold text-[#101828]">{position.speedKmh > 0 ? `${position.speedKmh} km/h` : 'À l’arrêt'}</dd>
            </>
          )}
        </dl>
        {position && (
          <a
            href={`https://maps.google.com/?q=${position.latitude},${position.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#2563eb] mt-3 hover:underline"
          >
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            Ouvrir dans Google Maps
          </a>
        )}
      </div>

      <div>
        <p className="text-[12.5px] font-bold text-[#475467] mb-2">Trajet</p>
        <Segmented
          value={range}
          onChange={onRange}
          options={[
            { value: 'none', label: 'Masqué' },
            { value: '1', label: '1 h' },
            { value: '6', label: '6 h' },
            { value: '24', label: '24 h' },
          ]}
        />
        {hours && (
          <p className="text-[12.5px] text-[#667085] mt-3">
            {isFetching && !route ? (
              'Chargement du trajet…'
            ) : !route || route.length < 2 ? (
              'Aucun déplacement enregistré sur cette période.'
            ) : (
              <>
                <strong className="text-[#101828]">{routeDistanceKm(route).toFixed(1)} km</strong> parcourus,{' '}
                {route.length} points depuis {shortDateTime(route[0].fixTime)}.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export default function MapViewPage() {
  const { data: entries, isLoading, isError } = useStudentPositions()
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('student')
  const [range, setRange] = useState<RouteRange>('none')

  const select = (id: string | null) => {
    setRange('none')
    setParams(id ? { student: id } : {}, { replace: true })
  }

  const sorted = useMemo(
    () =>
      [...(entries ?? [])].sort(
        (a, b) =>
          TONE_ORDER[trackingSummary(a).tone] - TONE_ORDER[trackingSummary(b).tone] ||
          a.lastName.localeCompare(b.lastName),
      ),
    [entries],
  )
  const selected = sorted.find((e) => e.studentId === selectedId) ?? null
  const { data: route } = useStudentRoute(selected?.studentId ?? null, range === 'none' ? null : Number(range))

  const points = useMemo(
    () => sorted.map((e) => ({ ...e, id: e.studentId, name: `${e.firstName} ${e.lastName}`, subtitle: e.className })),
    [sorted],
  )
  const located = sorted.filter((e) => e.position).length

  return (
    <AdminLayout title="Carte des élèves">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 lg:h-[calc(100vh-7.5rem)]">
        <Panel className="flex flex-col min-h-0 order-2 lg:order-1 overflow-hidden">
          {selected ? (
            <div className="overflow-y-auto">
              <StudentDetails entry={selected} range={range} onRange={setRange} onClose={() => select(null)} />
            </div>
          ) : (
            <>
              <div className="px-5 pt-5 pb-3 border-b border-[#eef1f5]">
                <p className="font-extrabold text-[16px] text-[#101828]">Élèves équipés</p>
                <p className="text-[13px] font-semibold text-[#98a2b3]">
                  {located} localisé{located > 1 ? 's' : ''} sur {sorted.length}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {isLoading ? (
                  <Loading />
                ) : sorted.length === 0 ? (
                  <EmptyState
                    icon="gps_off"
                    title="Aucun élève équipé"
                    text="Attribuez un boîtier à un élève pour le voir apparaître ici."
                    action={<Link to="/trackers"><Btn size="sm" icon="gps_fixed">Voir les boîtiers</Btn></Link>}
                  />
                ) : (
                  sorted.map((e) => (
                    <button
                      key={e.studentId}
                      onClick={() => select(e.studentId)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition hover:bg-[#f7f9fc]',
                      )}
                    >
                      <Avatar name={`${e.firstName} ${e.lastName}`} size={38} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-[14px] text-[#101828] truncate">{e.firstName} {e.lastName}</span>
                        <span className="block text-[12px] text-[#98a2b3] truncate">{trackingSummary(e).detail}</span>
                      </span>
                      <span className="flex flex-col items-end gap-1 shrink-0">
                        <TrackingPill live={e} />
                        <Battery position={e.position} className="text-[12px]" />
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </Panel>

        <div className="flex flex-col gap-3 min-h-0 order-1 lg:order-2">
          {isError && <ErrorNote>Impossible de récupérer les positions. Nouvel essai automatique…</ErrorNote>}
          <TrackingMap
            points={points}
            selectedId={selectedId}
            onSelect={select}
            route={selected ? route : undefined}
            className="h-[420px] lg:h-auto lg:flex-1 bg-white border border-[#e8ecf2] rounded-[20px]"
          />
        </div>
      </div>
    </AdminLayout>
  )
}
