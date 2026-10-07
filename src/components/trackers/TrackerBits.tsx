import type { TraccarPosition, TrackerLive, TrackerState } from '../../api/types'
import { TRACKER_STATE_LABELS, trackingSummary } from '../../utils/tracking'
import { cn } from '../../utils/cn'
import { Pill, Tone } from '../ui/kit'

/** Ce que l'on sait du boîtier en ce moment : localisé, position ancienne, hors ligne… */
export function TrackingPill({ live, className }: { live: TrackerLive; className?: string }) {
  const { tone, label, detail } = trackingSummary(live)
  return <Pill tone={tone} dot title={detail} className={className}>{label}</Pill>
}

const STATE_TONES: Record<TrackerState, Tone> = { ACTIVE: 'green', OUT_OF_SERVICE: 'amber', LOST: 'red' }

export function TrackerStatePill({ state }: { state: TrackerState }) {
  return <Pill tone={STATE_TONES[state]}>{TRACKER_STATE_LABELS[state]}</Pill>
}

/** Batterie : orange sous 40 %, rouge sous 20 %. */
export function Battery({ position, className }: { position: TraccarPosition | null; className?: string }) {
  const level = position?.batteryLevel
  if (level == null) return <span className={cn('text-[#98a2b3] text-[13px]', className)}>—</span>

  const tone = level <= 20 ? 'text-[#d92d20]' : level <= 40 ? 'text-[#dc6803]' : 'text-[#475467]'
  const icon = position?.charging
    ? 'battery_charging_full'
    : level <= 20 ? 'battery_1_bar' : level <= 40 ? 'battery_3_bar' : level <= 75 ? 'battery_5_bar' : 'battery_full'
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-[13px] font-bold whitespace-nowrap', tone, className)}
      title={position?.charging ? 'En charge' : undefined}
    >
      <span className="material-symbols-outlined text-[17px]">{icon}</span>
      {level} %
    </span>
  )
}
