import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Battery, TrackerStatePill, TrackingPill } from '../../components/trackers/TrackerBits'
import {
  Btn, ConfirmDialog, Dialog, EmptyState, ErrorNote, Field, IconBtn, Loading, PageContainer, Panel, Pill,
  Segmented, StatCard,
} from '../../components/ui/kit'
import { inputClass } from '../../components/ui/styles'
import { useStudents } from '../../hooks/useStudents'
import {
  useAssignTracker, useMySchoolTrackers, useUnassignTracker, useUpdateMySchoolTracker,
} from '../../hooks/useTrackers'
import { SchoolTracker, TrackerState } from '../../api/types'
import { coverageSummary } from '../../utils/billing'
import { TRACKER_STATE_LABELS, timeAgo, trackerName } from '../../utils/tracking'

type Filter = 'all' | 'assigned' | 'free' | 'down'

function AssignDialog({ tracker, onClose }: { tracker: SchoolTracker; onClose: () => void }) {
  const { data: students, isLoading } = useStudents()
  const assign = useAssignTracker()
  const [studentId, setStudentId] = useState('')
  const candidates = (students ?? []).filter((s) => !s.tracker)

  return (
    <Dialog
      open
      onClose={onClose}
      icon="person_pin_circle"
      title="Attribuer le boîtier"
      subtitle={`${trackerName(tracker)} · IMEI ${tracker.imei}`}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={assign.isPending}>Annuler</Btn>
          <Btn
            disabled={!studentId}
            loading={assign.isPending}
            onClick={() => assign.mutate({ id: tracker.id, studentId }, { onSuccess: onClose })}
          >
            Attribuer
          </Btn>
        </>
      }
    >
      {isLoading ? (
        <Loading />
      ) : candidates.length === 0 ? (
        <EmptyState
          icon="groups"
          title="Tous vos élèves ont déjà un boîtier"
          text={<>Ajoutez un élève depuis l'écran <Link to="/students" className="font-bold text-[#2563eb]">Élèves</Link>, ou retirez d'abord un boîtier.</>}
        />
      ) : (
        <Field label="Élève" hint="Seuls les élèves sans boîtier sont proposés.">
          <select autoFocus value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass}>
            <option value="">Choisir un élève…</option>
            {candidates.map((s) => (
              <option key={s.id} value={s.id}>
                {s.lastName} {s.firstName}{s.className ? ` — ${s.className}` : ''}
              </option>
            ))}
          </select>
        </Field>
      )}
    </Dialog>
  )
}

function EditDialog({ tracker, onClose }: { tracker: SchoolTracker; onClose: () => void }) {
  const update = useUpdateMySchoolTracker()
  const [label, setLabel] = useState(tracker.label ?? '')
  const [state, setState] = useState<TrackerState>(tracker.state)

  return (
    <Dialog
      open
      onClose={onClose}
      icon="edit"
      title="Modifier le boîtier"
      subtitle={`IMEI ${tracker.imei}`}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={update.isPending}>Annuler</Btn>
          <Btn type="submit" form="tracker-form" loading={update.isPending}>Enregistrer</Btn>
        </>
      }
    >
      <form
        id="tracker-form"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          update.mutate({ id: tracker.id, data: { label: label.trim(), state } }, { onSuccess: onClose })
        }}
      >
        <Field label="Étiquette" hint="Le nom que vous donnez à ce boîtier, par exemple celui écrit dessus.">
          <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} placeholder="Ex. B-012" className={inputClass} />
        </Field>
        <Field
          label="État"
          hint={state !== 'ACTIVE' ? 'Un boîtier hors service ou perdu ne peut plus être attribué à un élève.' : undefined}
        >
          <select value={state} onChange={(e) => setState(e.target.value as TrackerState)} className={inputClass}>
            {(Object.keys(TRACKER_STATE_LABELS) as TrackerState[]).map((s) => (
              <option key={s} value={s}>{TRACKER_STATE_LABELS[s]}</option>
            ))}
          </select>
        </Field>
      </form>
    </Dialog>
  )
}

export default function SchoolTrackersPage() {
  const { data: trackers, isLoading, isError } = useMySchoolTrackers()
  const unassign = useUnassignTracker()
  const [filter, setFilter] = useState<Filter>('all')
  const [assigning, setAssigning] = useState<SchoolTracker | null>(null)
  const [editing, setEditing] = useState<SchoolTracker | null>(null)
  const [removing, setRemoving] = useState<SchoolTracker | null>(null)

  const all = trackers ?? []
  const assigned = all.filter((t) => t.studentId)
  const free = all.filter((t) => !t.studentId && t.state === 'ACTIVE')
  const down = all.filter((t) => t.state !== 'ACTIVE')
  const shown = { all, assigned, free, down }[filter]

  return (
    <AdminLayout title="Boîtiers GPS">
      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="gps_fixed" label="Boîtiers de l'école" value={all.length} />
          <StatCard icon="person_pin_circle" label="Portés par un élève" value={assigned.length} tone="green" />
          <StatCard icon="inventory_2" label="Libres" value={free.length} tone="slate" hint="En service et sans élève" />
          <StatCard icon="build" label="Hors service ou perdus" value={down.length} tone={down.length ? 'amber' : 'slate'} />
        </div>

        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tous', count: all.length },
            { value: 'assigned', label: 'Attribués', count: assigned.length },
            { value: 'free', label: 'Libres', count: free.length },
            { value: 'down', label: 'Hors service', count: down.length },
          ]}
        />

        {isError && <ErrorNote>Impossible de récupérer les boîtiers. Nouvel essai automatique…</ErrorNote>}

        {isLoading ? (
          <Loading />
        ) : all.length === 0 ? (
          <Panel>
            <EmptyState
              icon="gps_off"
              title="Aucun boîtier pour le moment"
              text="Les boîtiers GPS sont fournis par BAAWA. Dès qu'ils sont affectés à votre école, ils apparaissent ici et vous pouvez les attribuer à vos élèves."
            />
          </Panel>
        ) : shown.length === 0 ? (
          <Panel><EmptyState icon="filter_alt_off" title="Aucun boîtier dans cette catégorie" /></Panel>
        ) : (
          <div className="flex flex-col gap-3">
            {shown.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-3">
                <div className="flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-[#eef4ff] text-[#2563eb] shrink-0">
                  <span className="material-symbols-outlined text-[23px]">gps_fixed</span>
                </div>

                <div className="flex-1 min-w-[170px]">
                  <p className="font-extrabold text-[15px] text-[#101828] truncate">{trackerName(t)}</p>
                  <p className="text-[12.5px] font-semibold text-[#98a2b3] font-mono">IMEI {t.imei}</p>
                </div>

                <div className="min-w-[170px]">
                  {t.student ? (
                    <>
                      <p className="font-bold text-[14px] text-[#101828] truncate">{t.student.firstName} {t.student.lastName}</p>
                      <p className="text-[12.5px] text-[#98a2b3]">
                        {t.student.className || 'Classe non renseignée'}
                        {t.assignedAt && ` · depuis ${timeAgo(t.assignedAt).replace('il y a ', '')}`}
                      </p>
                    </>
                  ) : (
                    <Pill tone="slate" icon="inventory_2">Libre</Pill>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 min-w-[190px]">
                  {t.student && (
                    <Pill tone={coverageSummary(t).tone} icon="workspace_premium" title={coverageSummary(t).detail}>
                      {coverageSummary(t).label}
                    </Pill>
                  )}
                  {t.state !== 'ACTIVE' ? (
                    <TrackerStatePill state={t.state} />
                  ) : (
                    <>
                      <TrackingPill live={t} />
                      <Battery position={t.position} />
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  {t.student ? (
                    <Btn size="sm" variant="secondary" icon="link_off" onClick={() => setRemoving(t)}>Retirer</Btn>
                  ) : (
                    <Btn size="sm" icon="person_add" disabled={t.state !== 'ACTIVE'} onClick={() => setAssigning(t)}>Attribuer</Btn>
                  )}
                  <IconBtn icon="edit" label="Modifier l'étiquette ou l'état" tone="blue" onClick={() => setEditing(t)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>

      {assigning && <AssignDialog tracker={assigning} onClose={() => setAssigning(null)} />}
      {editing && <EditDialog tracker={editing} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing && unassign.mutate(removing.id, { onSuccess: () => setRemoving(null) })}
        loading={unassign.isPending}
        title="Retirer ce boîtier ?"
        confirmLabel="Retirer"
        message={
          <>
            <strong className="text-[#101828]">{removing?.student?.firstName} {removing?.student?.lastName}</strong> ne
            sera plus suivi sur la carte. Le boîtier {removing && trackerName(removing)} redeviendra libre.
          </>
        }
      />
    </AdminLayout>
  )
}
