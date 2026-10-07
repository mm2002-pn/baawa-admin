import { useState } from 'react'
import { BulkCreateTrackersResult, Tracker, TrackerState } from '../../api/types'
import { useSchools } from '../../hooks/useSchools'
import {
  useBulkCreateTrackers, useCreateTracker, useSetTrackerSchool, useUpdateTracker,
} from '../../hooks/useTrackers'
import { IMEI_REGEX, TRACKER_STATE_LABELS, trackerName } from '../../utils/tracking'
import { cn } from '../../utils/cn'
import { Btn, Dialog, Field, Pill, Segmented } from '../ui/kit'
import { inputClass } from '../ui/styles'

function SchoolSelect({ value, onChange, emptyLabel }: {
  value: string
  onChange: (value: string) => void
  emptyLabel: string
}) {
  const { data } = useSchools(1, 100)
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">{emptyLabel}</option>
      {(data?.data ?? []).map((s) => (
        <option key={s.id} value={s.id}>{s.name}{s.region ? ` — ${s.region}` : ''}</option>
      ))}
    </select>
  )
}

/** Enregistrement d'un boîtier, ou d'un lot à partir d'une liste d'IMEI. */
export function AddTrackersDialog({ onClose }: { onClose: () => void }) {
  const createTracker = useCreateTracker()
  const bulkCreate = useBulkCreateTrackers()
  const [mode, setMode] = useState<'one' | 'bulk'>('one')
  const [form, setForm] = useState({ imei: '', label: '', simNumber: '', schoolId: '' })
  const [imeis, setImeis] = useState('')
  const [result, setResult] = useState<BulkCreateTrackersResult | null>(null)
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const imeiError = form.imei && !IMEI_REGEX.test(form.imei) ? `15 chiffres attendus (${form.imei.length} saisis)` : null
  const list = imeis.split(/[\s,;]+/).filter(Boolean)
  const pending = createTracker.isPending || bulkCreate.isPending

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'one') {
      createTracker.mutate(
        {
          imei: form.imei,
          label: form.label.trim() || undefined,
          simNumber: form.simNumber.trim() || undefined,
          schoolId: form.schoolId || undefined,
        },
        { onSuccess: onClose },
      )
    } else {
      bulkCreate.mutate({ imeis: list, schoolId: form.schoolId || undefined }, { onSuccess: setResult })
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon="add_circle"
      title="Enregistrer des boîtiers"
      subtitle="Les boîtiers arrivent en stock, sauf si vous choisissez une école."
      size="lg"
      footer={
        result ? (
          <Btn onClick={onClose}>Terminer</Btn>
        ) : (
          <>
            <Btn variant="secondary" onClick={onClose} disabled={pending}>Annuler</Btn>
            <Btn
              type="submit"
              form="add-trackers-form"
              loading={pending}
              disabled={mode === 'one' ? !IMEI_REGEX.test(form.imei) : list.length === 0}
            >
              {mode === 'one' ? 'Enregistrer le boîtier' : `Enregistrer ${list.length || ''} boîtier${list.length > 1 ? 's' : ''}`}
            </Btn>
          </>
        )
      }
    >
      {result ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#abefc6] bg-[#ecfdf3] px-4 py-3 text-[14px] font-bold text-[#067647]">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {result.created} boîtier{result.created > 1 ? 's' : ''} enregistré{result.created > 1 ? 's' : ''}
          </div>
          {result.skipped.length > 0 && (
            <div>
              <p className="text-[13px] font-bold text-[#475467] mb-2">{result.skipped.length} ligne{result.skipped.length > 1 ? 's' : ''} ignorée{result.skipped.length > 1 ? 's' : ''}</p>
              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto">
                {result.skipped.map((s) => (
                  <div key={s.imei} className="flex items-center justify-between gap-3 rounded-[10px] bg-[#f9fafc] border border-[#eef1f5] px-3 py-2 text-[13px]">
                    <code className="font-mono text-[#101828] truncate">{s.imei}</code>
                    <span className="text-[#b54708] font-semibold shrink-0">{s.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form id="add-trackers-form" onSubmit={submit} className="flex flex-col gap-4">
          <Segmented
            value={mode}
            onChange={setMode}
            options={[{ value: 'one', label: 'Un boîtier' }, { value: 'bulk', label: 'Un lot' }]}
          />

          {mode === 'one' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="IMEI *" className="sm:col-span-2" error={imeiError} hint="15 chiffres, imprimés sur le côté du boîtier.">
                <input
                  required
                  autoFocus
                  inputMode="numeric"
                  maxLength={15}
                  value={form.imei}
                  onChange={(e) => set({ imei: e.target.value.replace(/\D/g, '') })}
                  placeholder="862476051234567"
                  className={cn(inputClass, 'font-mono tracking-wider')}
                />
              </Field>
              <Field label="Étiquette" hint="Le repère écrit sur le boîtier.">
                <input value={form.label} onChange={(e) => set({ label: e.target.value })} maxLength={40} placeholder="Ex. B-012" className={inputClass} />
              </Field>
              <Field label="Numéro de la SIM" hint="Sert à envoyer les commandes SMS.">
                <input type="tel" value={form.simNumber} onChange={(e) => set({ simNumber: e.target.value })} maxLength={20} placeholder="+221 77 123 45 67" className={inputClass} />
              </Field>
            </div>
          ) : (
            <Field
              label="Liste d'IMEI *"
              hint={list.length ? `${list.length} IMEI détecté${list.length > 1 ? 's' : ''}. Les lignes invalides ou déjà connues seront ignorées et listées.` : 'Un IMEI par ligne (ou séparés par des virgules).'}
            >
              <textarea
                autoFocus
                rows={7}
                value={imeis}
                onChange={(e) => setImeis(e.target.value)}
                placeholder={'862476051234567\n862476051234568\n862476051234569'}
                className={cn(inputClass, 'font-mono resize-none')}
              />
            </Field>
          )}

          <Field label="École">
            <SchoolSelect value={form.schoolId} onChange={(schoolId) => set({ schoolId })} emptyLabel="Garder en stock" />
          </Field>
        </form>
      )}
    </Dialog>
  )
}

export function EditTrackerDialog({ tracker, onClose }: { tracker: Tracker; onClose: () => void }) {
  const update = useUpdateTracker()
  const [form, setForm] = useState({
    label: tracker.label ?? '',
    model: tracker.model,
    simNumber: tracker.simNumber ?? '',
    notes: tracker.notes ?? '',
    state: tracker.state,
  })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <Dialog
      open
      onClose={onClose}
      icon="edit"
      title="Modifier le boîtier"
      subtitle={`IMEI ${tracker.imei} — non modifiable`}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={update.isPending}>Annuler</Btn>
          <Btn type="submit" form="edit-tracker-form" loading={update.isPending}>Enregistrer</Btn>
        </>
      }
    >
      <form
        id="edit-tracker-form"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          update.mutate(
            {
              id: tracker.id,
              data: {
                label: form.label.trim(),
                model: form.model.trim() || tracker.model,
                simNumber: form.simNumber.trim(),
                notes: form.notes.trim(),
                state: form.state,
              },
            },
            { onSuccess: onClose },
          )
        }}
      >
        <Field label="Étiquette">
          <input autoFocus value={form.label} onChange={(e) => set({ label: e.target.value })} maxLength={40} placeholder="Ex. B-012" className={inputClass} />
        </Field>
        <Field label="Modèle">
          <input value={form.model} onChange={(e) => set({ model: e.target.value })} maxLength={40} className={inputClass} />
        </Field>
        <Field label="Numéro de la SIM">
          <input type="tel" value={form.simNumber} onChange={(e) => set({ simNumber: e.target.value })} maxLength={20} placeholder="+221 77 123 45 67" className={inputClass} />
        </Field>
        <Field label="État">
          <select value={form.state} onChange={(e) => set({ state: e.target.value as TrackerState })} className={inputClass}>
            {(Object.keys(TRACKER_STATE_LABELS) as TrackerState[]).map((s) => (
              <option key={s} value={s}>{TRACKER_STATE_LABELS[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <textarea rows={3} maxLength={500} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Ex. Coque fissurée, renvoyé au fournisseur le 3 octobre." className={cn(inputClass, 'resize-none')} />
        </Field>
      </form>
    </Dialog>
  )
}

/** Affecte un boîtier libre à une école, ou le remet en stock. */
export function TrackerSchoolDialog({ tracker, onClose }: { tracker: Tracker; onClose: () => void }) {
  const setSchool = useSetTrackerSchool()
  const [schoolId, setSchoolId] = useState(tracker.schoolId ?? '')
  const unchanged = schoolId === (tracker.schoolId ?? '')

  return (
    <Dialog
      open
      onClose={onClose}
      icon="move_down"
      title="Affecter à une école"
      subtitle={`${trackerName(tracker)} · IMEI ${tracker.imei}`}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={setSchool.isPending}>Annuler</Btn>
          <Btn
            disabled={unchanged}
            loading={setSchool.isPending}
            onClick={() => setSchool.mutate({ id: tracker.id, schoolId: schoolId || null }, { onSuccess: onClose })}
          >
            {schoolId ? 'Affecter' : 'Remettre en stock'}
          </Btn>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {tracker.school && (
          <p className="text-[13.5px] text-[#475467]">
            Actuellement affecté à <Pill tone="blue" icon="school">{tracker.school.name}</Pill>
          </p>
        )}
        <Field label="École" hint="L'école attribuera ensuite le boîtier à l'un de ses élèves.">
          <SchoolSelect value={schoolId} onChange={setSchoolId} emptyLabel="Stock BAAWA (aucune école)" />
        </Field>
      </div>
    </Dialog>
  )
}
