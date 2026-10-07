import type { PaymentMethod, Plan, Tracker } from '../api/types'
import type { Tone } from '../components/ui/kit'
import { longDate } from './tracking'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  WAVE: 'Wave',
  ORANGE_MONEY: 'Orange Money',
  CASH: 'Espèces',
  OTHER: 'Autre',
}

/** « 5 000 FCFA » */
export function fcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

/** « par mois », « par trimestre », « pour 6 mois », « par an » */
export function periodLabel(months: number) {
  if (months === 1) return 'par mois'
  if (months === 3) return 'par trimestre'
  if (months === 12) return 'par an'
  return `pour ${months} mois`
}

export function zonesLabel(count: number) {
  if (count === 0) return 'Aucune zone de sécurité'
  return `${count} zone${count > 1 ? 's' : ''} de sécurité`
}

export function planSummary(plan: Pick<Plan, 'price' | 'periodMonths'>) {
  return `${fcfa(plan.price)} ${periodLabel(plan.periodMonths)}`
}

const SOON_MS = 14 * 24 * 60 * 60 * 1000

/** État de l'abonnement d'un boîtier, tel qu'on l'affiche dans les listes. */
export function coverageSummary(tracker: Pick<Tracker, 'subscription' | 'paidUntil'>): {
  tone: Tone
  label: string
  detail: string
} {
  const { subscription, paidUntil } = tracker
  if (!subscription) {
    return paidUntil
      ? { tone: 'amber', label: 'Abonnement à venir', detail: `Payé, démarre bientôt (jusqu'au ${longDate(paidUntil)})` }
      : { tone: 'slate', label: 'Sans abonnement', detail: 'Les zones de sécurité ne sont pas disponibles' }
  }
  const end = paidUntil ?? subscription.endsAt
  const soon = new Date(end).getTime() - Date.now() < SOON_MS
  return {
    tone: soon ? 'amber' : 'green',
    label: subscription.plan.name,
    detail: `${soon ? 'Se termine' : 'Payé'} le ${longDate(end)} · ${zonesLabel(subscription.maxZones)}`,
  }
}
