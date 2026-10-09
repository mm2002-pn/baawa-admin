import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CommandParam, CommandTemplate, SendCommandDto, Tracker, TrackerCommand, TrackerCommandStatus, TrackerFilters,
} from '../../api/types'
import { useCommandTemplates, useSendCommand, useTrackerCommands } from '../../hooks/useTrackers'
import { COMMAND_FORMAT, missingParams, previewCommand, RISKY_COMMAND } from '../../utils/commands'
import { shortDateTime, trackerName } from '../../utils/tracking'
import { cn } from '../../utils/cn'
import { Btn, Dialog, EmptyState, Field, Loading, Pill, Tone } from '../ui/kit'
import { inputClass } from '../ui/styles'

const COUNT_LABEL: Record<TrackerCommandStatus, (n: number) => string> = {
  ANSWERED: (n) => (n > 1 ? 'réponses' : 'réponse'),
  SENT: (n) => (n > 1 ? 'envoyées' : 'envoyée'),
  QUEUED: () => 'en attente',
  FAILED: (n) => (n > 1 ? 'échecs' : 'échec'),
}

const STATUS: Record<TrackerCommandStatus, { tone: Tone; label: string; icon: string }> = {
  ANSWERED: { tone: 'green', label: 'Réponse reçue', icon: 'check_circle' },
  SENT: { tone: 'blue', label: 'Envoyée', icon: 'send' },
  QUEUED: { tone: 'amber', label: 'En attente', icon: 'schedule' },
  FAILED: { tone: 'red', label: 'Échec', icon: 'error' },
}

function CommandRow({ command, showTracker }: { command: TrackerCommand; showTracker: boolean }) {
  const status = STATUS[command.status]
  return (
    <div className="rounded-[13px] border border-[#eef1f5] bg-[#f9fafc] px-[14px] py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <div className="flex-1 min-w-[180px]">
          {showTracker ? (
            <>
              <p className="font-bold text-[14px] text-[#101828] truncate">{trackerName(command.tracker)}</p>
              <p className="text-[12px] text-[#98a2b3] truncate">
                <span className="font-mono">IMEI {command.tracker.imei}</span>
                {command.tracker.student && ` · ${command.tracker.student.firstName} ${command.tracker.student.lastName}`}
              </p>
            </>
          ) : (
            <>
              {command.label && <p className="font-bold text-[14px] text-[#101828] truncate">{command.label}</p>}
              <p className="text-[12.5px] font-semibold text-[#98a2b3]">{shortDateTime(command.createdAt)}</p>
            </>
          )}
        </div>
        <code className="font-mono text-[12.5px] text-[#475467] bg-white border border-[#e2e7ee] rounded-md px-2 py-0.5">{command.command}</code>
        <Pill tone={status.tone} icon={status.icon}>{status.label}</Pill>
      </div>
      {command.response && (
        <p className="mt-2 font-mono text-[12.5px] text-[#101828] break-words whitespace-pre-wrap">{command.response}</p>
      )}
      {command.error && <p className="mt-2 text-[12.5px] font-semibold text-[#b42318]">{command.error}</p>}
      {command.status === 'QUEUED' && (
        <p className="mt-2 text-[12.5px] text-[#b54708]">Boîtier non connecté : la commande partira dès qu'il se reconnectera.</p>
      )}
    </div>
  )
}

/** Champ de saisie d'un paramètre, selon son type. */
function ParamField({ param, value, onChange }: { param: CommandParam; value: string; onChange: (v: string) => void }) {
  const label = `${param.label}${param.required === false ? '' : ' *'}`
  if (param.type === 'phones') {
    return (
      <Field label={label} hint={`Jusqu'à ${param.maxItems ?? 4} numéros, un par ligne ou séparés par des virgules.`}>
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.placeholder}
          className={cn(inputClass, 'font-mono resize-none')}
        />
      </Field>
    )
  }
  const bounds = param.type === 'number' && (param.min !== undefined || param.max !== undefined)
    ? `Entre ${param.min ?? '…'} et ${param.max ?? '…'}.`
    : undefined
  return (
    <Field label={label} hint={bounds}>
      <input
        type={param.type === 'number' ? 'number' : param.type === 'phone' ? 'tel' : 'text'}
        min={param.min}
        max={param.max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.placeholder}
        className={cn(inputClass, param.type !== 'text' && 'font-mono')}
      />
    </Field>
  )
}

interface Props {
  /** Un boîtier précis ; sinon la commande vise tous ceux des filtres */
  tracker?: Tracker
  filters?: Omit<TrackerFilters, 'page' | 'limit'>
  /** Nombre de boîtiers visés par les filtres */
  count?: number
  /** Description de la cible, par exemple « les 12 boîtiers de l'ESMT » */
  targetLabel?: string
  onClose: () => void
}

/**
 * Envoi d'une commande à un boîtier ou à tout un ensemble, puis suivi des
 * réponses. L'admin choisit une action dans le catalogue et remplit ses
 * champs ; la saisie libre reste possible. Monté uniquement quand il est ouvert.
 */
export function CommandDialog({ tracker, filters, count = 0, targetLabel, onClose }: Props) {
  const send = useSendCommand()
  const catalogue = useCommandTemplates(true)
  const [template, setTemplate] = useState<CommandTemplate | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  // Saisie libre, pour une commande qui n'est pas encore au catalogue
  const [advanced, setAdvanced] = useState(false)
  const [freeText, setFreeText] = useState('')
  const [confirmRisky, setConfirmRisky] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)
  // Statut affiché dans la liste des résultats ; null : tous
  const [only, setOnly] = useState<TrackerCommandStatus | null>(null)

  const batch = useTrackerCommands({ batchId: batchId ?? undefined, status: only ?? undefined })
  const history = useTrackerCommands({ trackerId: tracker?.id }, !!tracker)

  const total = tracker ? 1 : count
  const text = freeText.trim()
  const formatError = advanced && text && !COMMAND_FORMAT.test(text) ? 'La commande doit se terminer par # (caractères simples, 160 au plus).' : null
  const preview = template ? previewCommand(template, values) : ''
  const missing = template ? missingParams(template, values) : []
  const risky = advanced ? RISKY_COMMAND.test(text) : !!template && (template.risky || RISKY_COMMAND.test(preview))
  const ready = advanced ? !!text && !formatError : !!template && missing.length === 0

  const pick = (t: CommandTemplate) => {
    setTemplate(t)
    setValues(Object.fromEntries(t.params.map((p) => [p.key, p.defaultValue ?? ''])))
    setConfirmRisky(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const what: Pick<SendCommandDto, 'templateId' | 'values' | 'command'> = advanced
      ? { command: text }
      : { templateId: template!.id, values }
    const dto: SendCommandDto = tracker
      ? { ...what, target: 'selection', trackerIds: [tracker.id], confirmRisky }
      : { ...filters, ...what, target: 'filter', confirmRisky }
    send.mutate(dto, {
      onSuccess: (result) => {
        setBatchId(result.batchId)
        setOnly(null)
        setConfirmRisky(false)
      },
    })
  }

  const counts = batch.data?.counts
  const waiting = counts ? counts.SENT + counts.QUEUED : 0

  return (
    <Dialog
      open
      onClose={onClose}
      icon="terminal"
      title={tracker ? 'Commande au boîtier' : 'Commande par lot'}
      subtitle={tracker ? `${trackerName(tracker)} · IMEI ${tracker.imei}` : targetLabel}
      size="lg"
      footer={
        batchId ? (
          <>
            <Btn variant="secondary" onClick={() => setBatchId(null)}>Nouvelle commande</Btn>
            <Btn onClick={onClose}>Fermer</Btn>
          </>
        ) : (
          <>
            <Btn variant="secondary" onClick={onClose} disabled={send.isPending}>Annuler</Btn>
            <Btn
              type="submit"
              form="command-form"
              icon="send"
              loading={send.isPending}
              disabled={!ready || total === 0 || (risky && !confirmRisky)}
            >
              {tracker ? 'Envoyer' : `Envoyer à ${total} boîtier${total > 1 ? 's' : ''}`}
            </Btn>
          </>
        )
      }
    >
      {batchId ? (
        <div className="flex flex-col gap-4">
          {counts && (
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(STATUS) as TrackerCommandStatus[]).filter((s) => counts[s] > 0 || s === 'ANSWERED').map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setOnly(only === s ? null : s)}
                  aria-pressed={only === s}
                  title={only === s ? 'Afficher tous les boîtiers' : 'N’afficher que ces boîtiers'}
                  className={cn('rounded-full transition', only === s ? 'ring-2 ring-[#2563eb] ring-offset-1' : 'hover:brightness-95')}
                >
                  <Pill tone={STATUS[s].tone} icon={STATUS[s].icon}>{counts[s]} {COUNT_LABEL[s](counts[s])}</Pill>
                </button>
              ))}
              {waiting > 0 && (
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#98a2b3]">
                  <span className="material-symbols-outlined animate-spin text-[15px]">progress_activity</span>
                  Réponses en cours de réception…
                </span>
              )}
            </div>
          )}
          {batch.isLoading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {batch.data?.data.map((c) => <CommandRow key={c.id} command={c} showTracker={!tracker} />)}
            </div>
          )}
          {batch.data && batch.data.total > batch.data.data.length && (
            <p className="text-[12.5px] text-[#98a2b3]">
              {batch.data.data.length} boîtiers affichés sur {batch.data.total}. Cliquez sur un décompte pour n'afficher que ce statut.
            </p>
          )}
        </div>
      ) : (
        <form id="command-form" onSubmit={submit} className="flex flex-col gap-4">
          {advanced ? (
            <Field
              label="Commande libre"
              error={formatError}
              hint="Le même texte qu’une commande SMS, terminé par #. {parent} est remplacé par le numéro du parent de chaque boîtier."
            >
              <input
                autoFocus
                value={freeText}
                onChange={(e) => { setFreeText(e.target.value); setConfirmRisky(false) }}
                placeholder="PARAM#"
                spellCheck={false}
                className={cn(inputClass, 'font-mono')}
              />
            </Field>
          ) : catalogue.isLoading ? (
            <Loading />
          ) : !catalogue.data?.length ? (
            <EmptyState
              icon="list_alt"
              title="Le catalogue est vide"
              text={<>Ajoutez des commandes depuis le <Link to="/fleet/commands" className="font-bold text-[#2563eb]">catalogue</Link>, ou utilisez la saisie libre ci-dessous.</>}
            />
          ) : (
            <div>
              <p className="text-[12.5px] font-bold text-[#475467] mb-2">Que voulez-vous faire ?</p>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1" role="radiogroup">
                {catalogue.data.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={template?.id === t.id}
                    onClick={() => pick(t)}
                    className={cn(
                      'text-left rounded-[13px] border px-[14px] py-3 transition',
                      template?.id === t.id ? 'border-[#2563eb] bg-[#f5f8ff]' : 'border-[#eef1f5] bg-[#f9fafc] hover:border-[#d3dbe6]',
                    )}
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[14px] text-[#101828]">{t.name}</span>
                      {t.risky && <Pill tone="red" icon="warning">À risque</Pill>}
                      {!t.verified && <Pill tone="amber" title="Cette commande n'a pas encore été essayée sur un vrai boîtier">Non vérifiée</Pill>}
                    </span>
                    {t.description && <span className="block text-[12.5px] text-[#667085] mt-1">{t.description}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!advanced && template && (
            <>
              {template.params.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {template.params.map((p) => (
                    <div key={p.key} className={cn(p.type === 'phones' && 'sm:col-span-2')}>
                      <ParamField param={p} value={values[p.key] ?? ''} onChange={(v) => setValues((old) => ({ ...old, [p.key]: v }))} />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#eef1f5] bg-[#f9fafc] px-4 py-3">
                <span className="text-[12.5px] font-bold text-[#667085]">Commande envoyée</span>
                <code className="font-mono text-[13px] text-[#101828] break-all">{preview}</code>
              </div>
            </>
          )}

          {risky && (
            <label className="flex items-start gap-3 rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 cursor-pointer">
              <input type="checkbox" checked={confirmRisky} onChange={(e) => setConfirmRisky(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#d92d20]" />
              <span className="text-[13px] text-[#912018]">
                <strong>Cette commande peut détacher {total > 1 ? `les ${total} boîtiers` : 'le boîtier'} de BAAWA.</strong>{' '}
                Une erreur dans l'adresse du serveur ou dans le réseau les rend injoignables : il faudrait alors les reconfigurer par SMS, un par un. Je confirme l'envoi.
              </span>
            </label>
          )}

          {!tracker && total === 0 && (
            <p className="text-[13px] font-semibold text-[#b42318]">Aucun boîtier ne correspond aux filtres actuels.</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] font-bold">
            <button type="button" className="text-[#2563eb] hover:underline" onClick={() => { setAdvanced(!advanced); setConfirmRisky(false) }}>
              {advanced ? '← Revenir au catalogue' : 'Commande libre (avancé)'}
            </button>
            <Link to="/fleet/commands" className="text-[#667085] hover:text-[#2563eb]">Gérer le catalogue</Link>
          </div>

          {tracker && !!history.data?.data.length && (
            <div>
              <p className="text-[12.5px] font-bold text-[#475467] mb-2">Dernières commandes de ce boîtier</p>
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {history.data.data.slice(0, 10).map((c) => <CommandRow key={c.id} command={c} showTracker={false} />)}
              </div>
            </div>
          )}
        </form>
      )}
    </Dialog>
  )
}
