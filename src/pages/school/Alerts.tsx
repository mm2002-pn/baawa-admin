import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  Btn, Dialog, EmptyState, ErrorNote, Field, Loading, PageContainer, Panel, Pill, Segmented,
} from '../../components/ui/kit'
import { inputClass } from '../../components/ui/styles'
import { useAcknowledgeAlarm, useAlarms, useOpenAlarmsCount } from '../../hooks/useTrackers'
import { AlarmStatusFilter, TrackerAlarm } from '../../api/types'
import { cn } from '../../utils/cn'
import { shortDateTime, timeAgo, trackerName } from '../../utils/tracking'

const ALARM_ICONS: Record<string, string> = {
  sos: 'sos',
  fallDown: 'personal_injury',
  lowBattery: 'battery_alert',
  lowPower: 'battery_alert',
  powerOff: 'power_settings_new',
  powerCut: 'power_off',
  tampering: 'front_hand',
  removing: 'link_off',
  geofenceExit: 'logout',
  geofenceEnter: 'login',
}

/** Les alarmes qui peuvent signaler un enfant en danger. */
const CRITICAL = new Set(['sos', 'fallDown', 'removing', 'tampering'])

function AcknowledgeDialog({ alarm, onClose }: { alarm: TrackerAlarm; onClose: () => void }) {
  const acknowledge = useAcknowledgeAlarm()
  const [note, setNote] = useState('')
  return (
    <Dialog
      open
      onClose={onClose}
      icon="task_alt"
      title="Marquer comme traitée"
      subtitle={`${alarm.label}${alarm.student ? ` — ${alarm.student.firstName} ${alarm.student.lastName}` : ''}`}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={acknowledge.isPending}>Annuler</Btn>
          <Btn
            icon="check"
            loading={acknowledge.isPending}
            onClick={() => acknowledge.mutate({ id: alarm.id, note: note.trim() || undefined }, { onSuccess: onClose })}
          >
            Alarme traitée
          </Btn>
        </>
      }
    >
      <Field label="Ce qui a été fait (facultatif)" hint="Cette note reste dans l'historique de l'école.">
        <textarea
          autoFocus
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex. Parent joint par téléphone, fausse manipulation."
          className={cn(inputClass, 'resize-none')}
        />
      </Field>
    </Dialog>
  )
}

function AlarmCard({ alarm, onAcknowledge }: { alarm: TrackerAlarm; onAcknowledge: () => void }) {
  const open = !alarm.acknowledgedAt
  const critical = CRITICAL.has(alarm.type)
  const hasPosition = alarm.latitude !== null && alarm.longitude !== null

  return (
    <div
      className={cn(
        'flex flex-wrap items-start gap-4 bg-white border rounded-2xl px-4 py-4',
        open && critical ? 'border-[#fda29b] shadow-[0_8px_24px_-16px_rgba(217,45,32,.55)]' : 'border-[#e8ecf2]',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-[46px] h-[46px] rounded-[14px] shrink-0',
          !open ? 'bg-[#f2f4f7] text-[#98a2b3]' : critical ? 'bg-[#fef3f2] text-[#d92d20]' : 'bg-[#fffaeb] text-[#dc6803]',
        )}
      >
        <span className="material-symbols-outlined text-[24px]">{ALARM_ICONS[alarm.type] ?? 'notification_important'}</span>
      </div>

      <div className="flex-1 min-w-[220px]">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-extrabold text-[15px] text-[#101828]">
            {alarm.label}{alarm.zoneName ? ` « ${alarm.zoneName} »` : ''}
          </p>
          {alarm.count > 1 && (
            <Pill tone={open && critical ? 'red' : 'slate'} title={`Premier déclenchement ${shortDateTime(alarm.firstAt)}`}>
              × {alarm.count}
            </Pill>
          )}
          {!open && <Pill tone="green" icon="check">Traitée</Pill>}
        </div>
        <p className="text-[14px] font-bold text-[#475467] mt-1">
          {alarm.student
            ? `${alarm.student.firstName} ${alarm.student.lastName}${alarm.student.className ? ` · ${alarm.student.className}` : ''}`
            : 'Boîtier sans élève'}
        </p>
        <p className="text-[12.5px] text-[#98a2b3] mt-1">
          {shortDateTime(alarm.lastAt)} ({timeAgo(alarm.lastAt)}) · {trackerName(alarm.tracker)}
        </p>
        {alarm.student?.parentPhone && open && (
          <p className="text-[12.5px] text-[#475467] mt-2">
            Parent : {alarm.student.parentName ? `${alarm.student.parentName} · ` : ''}
            <a href={`tel:${alarm.student.parentPhone.replace(/\s/g, '')}`} className="font-bold text-[#2563eb] hover:underline">
              {alarm.student.parentPhone}
            </a>
          </p>
        )}
        {alarm.note && (
          <p className="text-[12.5px] text-[#475467] mt-2 italic">« {alarm.note} »</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {hasPosition && (
          <a href={`https://maps.google.com/?q=${alarm.latitude},${alarm.longitude}`} target="_blank" rel="noreferrer">
            <Btn size="sm" variant="secondary" icon="location_on">Position de l'alarme</Btn>
          </a>
        )}
        {alarm.studentId && open && (
          <Link to={`/map?student=${alarm.studentId}`}>
            <Btn size="sm" variant="secondary" icon="map">Carte en direct</Btn>
          </Link>
        )}
        {open && <Btn size="sm" icon="check" onClick={onAcknowledge}>Traiter</Btn>}
      </div>
    </div>
  )
}

export default function SchoolAlertsPage() {
  const [status, setStatus] = useState<AlarmStatusFilter>('open')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useAlarms(status, page)
  const { data: count } = useOpenAlarmsCount()
  const [acknowledging, setAcknowledging] = useState<TrackerAlarm | null>(null)

  const alarms = data?.data ?? []
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1

  return (
    <AdminLayout title="Alertes des boîtiers">
      <PageContainer>
        <Segmented
          value={status}
          onChange={(s) => { setStatus(s); setPage(1) }}
          options={[
            { value: 'open', label: 'À traiter', count: count?.open },
            { value: 'acknowledged', label: 'Traitées' },
            { value: 'all', label: 'Tout l’historique' },
          ]}
        />

        {isError && <ErrorNote>Impossible de récupérer les alertes. Nouvel essai automatique…</ErrorNote>}

        {isLoading ? (
          <Loading />
        ) : alarms.length === 0 ? (
          <Panel>
            {status === 'open' ? (
              <EmptyState icon="verified_user" title="Aucune alerte à traiter" text="Les alarmes des boîtiers (SOS, chute, batterie faible…) apparaissent ici dès qu'elles se déclenchent." />
            ) : (
              <EmptyState icon="history" title="Aucune alerte dans l'historique" />
            )}
          </Panel>
        ) : (
          <div className="flex flex-col gap-3">
            {alarms.map((a) => (
              <AlarmCard key={a.id} alarm={a} onAcknowledge={() => setAcknowledging(a)} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Btn size="sm" variant="secondary" icon="chevron_left" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</Btn>
            <span className="text-[13px] font-bold text-[#667085]">Page {page} sur {pages}</span>
            <Btn size="sm" variant="secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Suivant</Btn>
          </div>
        )}
      </PageContainer>

      {acknowledging && <AcknowledgeDialog alarm={acknowledging} onClose={() => setAcknowledging(null)} />}
    </AdminLayout>
  )
}
