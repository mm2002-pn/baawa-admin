import { useState } from 'react'
import { SendCommandDto, Tracker, TrackerCommand, TrackerCommandStatus, TrackerFilters } from '../../api/types'
import { useSendCommand, useTrackerCommands } from '../../hooks/useTrackers'
import { shortDateTime, trackerName } from '../../utils/tracking'
import { cn } from '../../utils/cn'
import { Btn, Dialog, Field, Loading, Pill, Tone } from '../ui/kit'
import { inputClass } from '../ui/styles'

/** Commandes proposées en un clic. Le texte est celui des commandes SMS du boîtier. */
const PRESETS: { label: string; command: string; hint: string }[] = [
  { label: 'Lire les réglages', command: 'PARAM#', hint: 'Le boîtier renvoie son IMEI, ses intervalles d’envoi et ses numéros SOS.' },
  { label: 'Numéro SOS = parent', command: 'SOS,A,{parent}#', hint: 'Enregistre le numéro du parent de chaque boîtier comme numéro SOS.' },
]

/** Mêmes commandes que le serveur considère comme risquées : elles peuvent détacher le boîtier de BAAWA. */
const RISKY = /^\s*(SERVER|APN|FACTORY|RESET)\b/i

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
            <p className="text-[12.5px] font-semibold text-[#98a2b3]">{shortDateTime(command.createdAt)}</p>
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
 * Envoi d'une commande à un boîtier ou à tout un ensemble, puis suivi des réponses.
 * Monté uniquement quand il est ouvert.
 */
export function CommandDialog({ tracker, filters, count = 0, targetLabel, onClose }: Props) {
  const send = useSendCommand()
  const [command, setCommand] = useState('')
  const [confirmRisky, setConfirmRisky] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)
  // Statut affiché dans la liste des résultats ; null : tous
  const [only, setOnly] = useState<TrackerCommandStatus | null>(null)

  const batch = useTrackerCommands({ batchId: batchId ?? undefined, status: only ?? undefined })
  const history = useTrackerCommands({ trackerId: tracker?.id }, !!tracker)

  const text = command.trim()
  const risky = RISKY.test(text)
  const formatError = text && !/^[\x20-\x7E]{1,160}#$/.test(text) ? 'La commande doit se terminer par # (caractères simples, 160 au plus).' : null
  const preset = PRESETS.find((p) => p.command === text)
  const total = tracker ? 1 : count

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const dto: SendCommandDto = tracker
      ? { command: text, target: 'selection', trackerIds: [tracker.id], confirmRisky }
      : { ...filters, command: text, target: 'filter', confirmRisky }
    send.mutate(dto, {
      onSuccess: (result) => {
        setBatchId(result.batchId)
        setOnly(null)
        setCommand('')
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
              disabled={!text || !!formatError || total === 0 || (risky && !confirmRisky)}
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
          <div>
            <p className="text-[12.5px] font-bold text-[#475467] mb-2">Commandes courantes</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.command}
                  type="button"
                  onClick={() => setCommand(p.command)}
                  className={cn(
                    'px-3 py-2 rounded-[10px] border text-[13px] font-bold transition',
                    text === p.command ? 'border-[#2563eb] bg-[#f5f8ff] text-[#1d4ed8]' : 'border-[#e2e7ee] bg-white text-[#475467] hover:bg-[#f7f9fc]',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Commande"
            error={formatError}
            hint={preset?.hint ?? 'Le même texte qu’une commande SMS, terminé par #. {parent} est remplacé par le numéro du parent de chaque boîtier.'}
          >
            <input
              autoFocus
              value={command}
              onChange={(e) => { setCommand(e.target.value); setConfirmRisky(false) }}
              placeholder="PARAM#"
              spellCheck={false}
              className={cn(inputClass, 'font-mono')}
            />
          </Field>

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

          {tracker && !!history.data?.data.length && (
            <div>
              <p className="text-[12.5px] font-bold text-[#475467] mb-2">Dernières commandes de ce boîtier</p>
              <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
                {history.data.data.slice(0, 10).map((c) => <CommandRow key={c.id} command={c} showTracker={false} />)}
              </div>
            </div>
          )}
        </form>
      )}
    </Dialog>
  )
}
