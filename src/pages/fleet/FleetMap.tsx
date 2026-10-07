import { useMemo, useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { TrackingMap } from '../../components/map/TrackingMap'
import { Battery, TrackingPill } from '../../components/trackers/TrackerBits'
import { Avatar, EmptyState, ErrorNote, Loading, Panel } from '../../components/ui/kit'
import { inputClass } from '../../components/ui/styles'
import { useSchools } from '../../hooks/useSchools'
import { useFleetPositions } from '../../hooks/useTrackers'
import { cn } from '../../utils/cn'
import { trackerName, trackingSummary } from '../../utils/tracking'

const TONE_ORDER = { red: 0, amber: 1, slate: 2, green: 3 }

/** Vue d'ensemble des boîtiers portés, toutes écoles confondues (admin BAAWA). */
export default function FleetMapPage() {
  const [schoolId, setSchoolId] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: schools } = useSchools(1, 100)
  const { data: entries, isLoading, isError } = useFleetPositions(schoolId || undefined)

  const points = useMemo(
    () =>
      [...(entries ?? [])]
        .map((e) => ({
          ...e,
          id: e.trackerId,
          name: e.student ? `${e.student.firstName} ${e.student.lastName}` : trackerName(e),
          subtitle: e.school?.name,
        }))
        .sort((a, b) => TONE_ORDER[trackingSummary(a).tone] - TONE_ORDER[trackingSummary(b).tone] || a.name.localeCompare(b.name)),
    [entries],
  )
  const located = points.filter((p) => p.position).length

  return (
    <AdminLayout title="Carte des boîtiers" backTo="/fleet">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 lg:h-[calc(100vh-7.5rem)]">
        <Panel className="flex flex-col min-h-0 order-2 lg:order-1 overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#eef1f5] flex flex-col gap-3">
            <div>
              <p className="font-extrabold text-[16px] text-[#101828]">Boîtiers portés</p>
              <p className="text-[13px] font-semibold text-[#98a2b3]">
                {located} localisé{located > 1 ? 's' : ''} sur {points.length}
              </p>
            </div>
            <select
              value={schoolId}
              onChange={(e) => { setSchoolId(e.target.value); setSelectedId(null) }}
              className={inputClass}
              aria-label="Filtrer par école"
            >
              <option value="">Toutes les écoles</option>
              {(schools?.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <Loading />
            ) : points.length === 0 ? (
              <EmptyState icon="gps_off" title="Aucun boîtier porté" text="Seuls les boîtiers attribués à un élève apparaissent sur la carte." />
            ) : (
              points.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition',
                    p.id === selectedId ? 'bg-[#eef4ff]' : 'hover:bg-[#f7f9fc]',
                  )}
                >
                  <Avatar name={p.name} size={38} />
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-[14px] text-[#101828] truncate">{p.name}</span>
                    <span className="block text-[12px] text-[#98a2b3] truncate">{p.subtitle ?? '—'} · {trackerName(p)}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1 shrink-0">
                    <TrackingPill live={p} />
                    <Battery position={p.position} className="text-[12px]" />
                  </span>
                </button>
              ))
            )}
          </div>
        </Panel>

        <div className="flex flex-col gap-3 min-h-0 order-1 lg:order-2">
          {isError && <ErrorNote>Impossible de récupérer les positions. Nouvel essai automatique…</ErrorNote>}
          <TrackingMap
            // Changer d'école recadre la carte sur ses boîtiers
            key={schoolId}
            points={points}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="h-[420px] lg:h-auto lg:flex-1 bg-white border border-[#e8ecf2] rounded-[20px]"
          />
        </div>
      </div>
    </AdminLayout>
  )
}
