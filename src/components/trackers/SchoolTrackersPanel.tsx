import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tracker } from '../../api/types'
import { useSetTrackerSchool, useTrackers } from '../../hooks/useTrackers'
import { trackerName } from '../../utils/tracking'
import { cn } from '../../utils/cn'
import { Btn, ConfirmDialog, Dialog, EmptyState, Loading, Panel, PanelHeader, Pill } from '../ui/kit'
import { TrackerStatePill } from './TrackerBits'

function AllocateDialog({ schoolId, schoolName, onClose }: { schoolId: string; schoolName: string; onClose: () => void }) {
  const { data, isLoading } = useTrackers({ assignment: 'stock', state: 'ACTIVE', limit: 100 })
  const setSchool = useSetTrackerSchool()
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const stock = data?.data ?? []

  const togglePick = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const submit = async () => {
    setSaving(true)
    try {
      for (const id of picked) await setSchool.mutateAsync({ id, schoolId })
      onClose()
    } catch {
      // l'erreur est affichée par le hook ; la fenêtre reste ouverte pour réessayer
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon="move_down"
      title="Affecter des boîtiers"
      subtitle={`Depuis le stock BAAWA vers ${schoolName}`}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={saving}>Annuler</Btn>
          <Btn disabled={picked.size === 0} loading={saving} onClick={submit}>
            Affecter {picked.size > 0 ? `${picked.size} boîtier${picked.size > 1 ? 's' : ''}` : ''}
          </Btn>
        </>
      }
    >
      {isLoading ? (
        <Loading />
      ) : stock.length === 0 ? (
        <EmptyState
          icon="inventory_2"
          title="Le stock est vide"
          text={<>Enregistrez de nouveaux boîtiers depuis l'écran <Link to="/fleet" className="font-bold text-[#2563eb]">Boîtiers</Link>.</>}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#98a2b3]">{stock.length} boîtier{stock.length > 1 ? 's' : ''} en stock</p>
            <button
              type="button"
              className="text-[13px] font-bold text-[#2563eb] hover:underline"
              onClick={() => setPicked(picked.size === stock.length ? new Set() : new Set(stock.map((t) => t.id)))}
            >
              {picked.size === stock.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
            {stock.map((t) => (
              <label
                key={t.id}
                className={cn(
                  'flex items-center gap-3 rounded-[13px] border px-[14px] py-3 cursor-pointer transition',
                  picked.has(t.id) ? 'border-[#2563eb] bg-[#f5f8ff]' : 'border-[#eef1f5] bg-[#f9fafc] hover:border-[#d3dbe6]',
                )}
              >
                <input type="checkbox" checked={picked.has(t.id)} onChange={() => togglePick(t.id)} className="w-4 h-4 accent-[#2563eb]" />
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-[14px] text-[#101828] truncate">{trackerName(t)}</span>
                  <span className="block text-[12.5px] text-[#98a2b3] font-mono">IMEI {t.imei}</span>
                </span>
                <span className="text-[12.5px] font-semibold text-[#98a2b3]">{t.model}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </Dialog>
  )
}

/** Boîtiers d'une école, vus par l'admin BAAWA : affectation depuis le stock et retour en stock. */
export function SchoolTrackersPanel({ schoolId, schoolName }: { schoolId: string; schoolName: string }) {
  const { data, isLoading } = useTrackers({ schoolId, limit: 100 })
  const setSchool = useSetTrackerSchool()
  const [allocating, setAllocating] = useState(false)
  const [returning, setReturning] = useState<Tracker | null>(null)
  const trackers = data?.data ?? []
  const carried = trackers.filter((t) => t.studentId).length

  return (
    <Panel className="p-7">
      <PanelHeader
        icon="gps_fixed"
        title="Boîtiers GPS"
        subtitle={
          trackers.length
            ? `${carried} porté${carried > 1 ? 's' : ''} par un élève, ${trackers.length - carried} libre${trackers.length - carried > 1 ? 's' : ''}`
            : "L'école attribue elle-même ses boîtiers à ses élèves"
        }
        action={<Btn size="sm" icon="move_down" onClick={() => setAllocating(true)}>Affecter des boîtiers</Btn>}
      />

      {isLoading ? (
        <Loading />
      ) : trackers.length === 0 ? (
        <EmptyState icon="gps_off" title="Aucun boîtier affecté à cette école" text="Affectez-lui des boîtiers du stock pour qu'elle puisse équiper ses élèves." />
      ) : (
        <div className="flex flex-col gap-2">
          {trackers.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-3 bg-[#f9fafc] border border-[#eef1f5] rounded-[13px] px-[14px] py-3">
              <div className="flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-[#e6edfb] text-[#1e40af] shrink-0">
                <span className="material-symbols-outlined text-[20px]">gps_fixed</span>
              </div>
              <div className="flex-1 min-w-[160px]">
                <p className="font-bold text-[14.5px] text-[#101828] truncate">{trackerName(t)}</p>
                <p className="text-[12.5px] text-[#98a2b3] font-mono">IMEI {t.imei}</p>
              </div>
              {t.state !== 'ACTIVE' && <TrackerStatePill state={t.state} />}
              {t.traccarDeviceId === null && (
                <Pill tone="amber" icon="sync_problem" title="Ce boîtier n'est pas encore relié au serveur de géolocalisation">Non relié</Pill>
              )}
              {t.student ? (
                <Pill tone="blue" icon="person">{t.student.firstName} {t.student.lastName}</Pill>
              ) : (
                <>
                  <Pill tone="slate">Libre</Pill>
                  <Btn size="sm" variant="secondary" icon="undo" onClick={() => setReturning(t)}>Remettre en stock</Btn>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {allocating && <AllocateDialog schoolId={schoolId} schoolName={schoolName} onClose={() => setAllocating(false)} />}

      <ConfirmDialog
        open={!!returning}
        onClose={() => setReturning(null)}
        onConfirm={() => returning && setSchool.mutate({ id: returning.id, schoolId: null }, { onSuccess: () => setReturning(null) })}
        loading={setSchool.isPending}
        title="Remettre ce boîtier en stock ?"
        confirmLabel="Remettre en stock"
        message={<>Le boîtier {returning && trackerName(returning)} ne sera plus disponible pour {schoolName}.</>}
      />
    </Panel>
  )
}
