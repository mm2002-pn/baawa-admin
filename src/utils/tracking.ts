import { format, formatDistanceToNowStrict } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { TraccarPosition, TrackerLive, TrackerState } from '../api/types'

export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

/** « il y a 5 minutes » */
export function timeAgo(date: string | Date) {
  return formatDistanceToNowStrict(new Date(date), { locale: fr, addSuffix: true })
}

/** « 7 oct. à 14:32 » */
export function shortDateTime(date: string | Date) {
  return format(new Date(date), "d MMM 'à' HH:mm", { locale: fr })
}

export function longDate(date: string | Date) {
  return format(new Date(date), 'd MMMM yyyy', { locale: fr })
}

/** Nom d'usage d'un boîtier : son étiquette si elle existe, sinon la fin de son IMEI. */
export function trackerName(tracker: { imei: string; label?: string | null }) {
  return tracker.label || `Boîtier …${tracker.imei.slice(-6)}`
}

/**
 * Au-delà de ce délai, un point GPS ne dit plus où est l'élève : en intérieur,
 * le boîtier reste « en ligne » mais Traccar répète sa dernière position connue.
 */
const STALE_AFTER_MS = 10 * 60 * 1000

export function isStale(position: TraccarPosition | null) {
  if (!position) return false
  return Date.now() - new Date(position.fixTime).getTime() > STALE_AFTER_MS
}

export type TrackingTone = 'green' | 'amber' | 'red' | 'slate'

/** Résume en une phrase ce que l'on sait d'un boîtier, pour l'école. */
export function trackingSummary(live: TrackerLive): { tone: TrackingTone; label: string; detail: string } {
  const { position, deviceStatus, lastUpdate } = live
  if (deviceStatus === 'unknown') {
    return { tone: 'slate', label: 'Jamais connecté', detail: 'Aucun signal reçu' }
  }
  if (deviceStatus === 'offline') {
    return {
      tone: 'red',
      label: 'Hors ligne',
      detail: lastUpdate ? `Dernier signal ${timeAgo(lastUpdate)}` : 'Aucun signal reçu',
    }
  }
  if (!position) {
    return { tone: 'amber', label: 'En ligne, sans position', detail: 'En attente d’un signal GPS' }
  }
  if (isStale(position)) {
    return {
      tone: 'amber',
      label: 'Position ancienne',
      detail: `Dernier point GPS ${timeAgo(position.fixTime)} — sans doute en intérieur`,
    }
  }
  return { tone: 'green', label: 'Localisé', detail: `Point GPS ${timeAgo(position.fixTime)}` }
}

export const TRACKER_STATE_LABELS: Record<TrackerState, string> = {
  ACTIVE: 'En service',
  OUT_OF_SERVICE: 'Hors service',
  LOST: 'Perdu',
}

export const IMEI_REGEX = /^\d{15}$/
