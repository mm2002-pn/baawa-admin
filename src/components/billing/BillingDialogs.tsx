import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PaymentMethod, Plan, Tracker } from '../../api/types'
import {
  useCancelSubscription, useCreateSubscription, useDirectSale, usePlans, useSavePlan, useTrackerSubscriptions,
} from '../../hooks/useSubscriptions'
import { PAYMENT_LABELS, coverageSummary, fcfa, planSummary, zonesLabel } from '../../utils/billing'
import { longDate, trackerName } from '../../utils/tracking'
import { cn } from '../../utils/cn'
import { Btn, ConfirmDialog, Dialog, EmptyState, Field, Loading, Pill } from '../ui/kit'
import { inputClass } from '../ui/styles'

/** Création ou modification d'une formule. Monté uniquement quand il est ouvert. */
export function PlanFormDialog({ plan, onClose }: { plan?: Plan | null; onClose: () => void }) {
  const save = useSavePlan()
  const [form, setForm] = useState({
    name: plan?.name ?? '',
    description: plan?.description ?? '',
    price: plan ? String(plan.price) : '',
    periodMonths: String(plan?.periodMonths ?? 1),
    maxZones: String(plan?.maxZones ?? 1),
    features: (plan?.features ?? []).join('\n'),
    sortOrder: String(plan?.sortOrder ?? 0),
  })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(
      {
        id: plan?.id,
        data: {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          periodMonths: Number(form.periodMonths),
          maxZones: Number(form.maxZones),
          features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
          sortOrder: Number(form.sortOrder) || 0,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon="sell"
      title={plan ? `Modifier la formule ${plan.name}` : 'Nouvelle formule'}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={save.isPending}>Annuler</Btn>
          <Btn type="submit" form="plan-form" loading={save.isPending}>{plan ? 'Enregistrer' : 'Créer la formule'}</Btn>
        </>
      }
    >
      <form id="plan-form" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nom *">
          <input required autoFocus value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={40} placeholder="Ex. Premium" className={inputClass} />
        </Field>
        <Field label="Zones de sécurité *" hint="Nombre de zones qu'un parent peut tracer par boîtier.">
          <input required type="number" min={0} max={50} value={form.maxZones} onChange={(e) => set({ maxZones: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Tarif (FCFA) *">
          <input required type="number" min={0} step={1} value={form.price} onChange={(e) => set({ price: e.target.value })} placeholder="5000" className={inputClass} />
        </Field>
        <Field label="Période *" hint="Durée couverte par un paiement.">
          <select value={form.periodMonths} onChange={(e) => set({ periodMonths: e.target.value })} className={inputClass}>
            <option value="1">1 mois</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
            {!['1', '3', '6', '12'].includes(form.periodMonths) && <option value={form.periodMonths}>{form.periodMonths} mois</option>}
          </select>
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <input value={form.description} onChange={(e) => set({ description: e.target.value })} maxLength={300} placeholder="Ex. L'essentiel pour suivre son enfant" className={inputClass} />
        </Field>
        <Field label="Arguments affichés au parent" className="sm:col-span-2" hint="Un argument par ligne, 10 au maximum.">
          <textarea rows={4} value={form.features} onChange={(e) => set({ features: e.target.value })} placeholder={'Position en direct\nAlerte SOS\n3 zones de sécurité'} className={cn(inputClass, 'resize-none')} />
        </Field>
        <Field label="Ordre d'affichage" hint="Les plus petits nombres apparaissent en premier.">
          <input type="number" value={form.sortOrder} onChange={(e) => set({ sortOrder: e.target.value })} className={inputClass} />
        </Field>
        {plan && plan.maxZones !== Number(form.maxZones) && !!plan.activeSubscriptions && (
          <p className="sm:col-span-2 rounded-xl border border-[#fedf89] bg-[#fffaeb] px-4 py-3 text-[13px] font-semibold text-[#b54708]">
            Les {plan.activeSubscriptions} abonnement{plan.activeSubscriptions > 1 ? 's' : ''} en cours gardent {zonesLabel(plan.maxZones).toLowerCase()} jusqu'à leur échéance : le nouveau nombre vaut pour les prochains paiements.
          </p>
        )}
      </form>
    </Dialog>
  )
}

/** Abonnement d'un boîtier : état, encaissement d'un paiement, historique. */
export function SubscriptionDialog({ tracker, onClose }: { tracker: Tracker; onClose: () => void }) {
  const { data: plans, isLoading: plansLoading } = usePlans()
  const { data: history } = useTrackerSubscriptions(tracker.id)
  const create = useCreateSubscription(tracker.id)
  const cancel = useCancelSubscription()
  const onSale = (plans ?? []).filter((p) => p.isActive)

  const [planId, setPlanId] = useState(tracker.subscription?.plan.id ?? '')
  const [periods, setPeriods] = useState('1')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('WAVE')
  const [reference, setReference] = useState('')
  const [startNow, setStartNow] = useState(false)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const plan = onSale.find((p) => p.id === planId)
  const due = plan ? plan.price * Number(periods || 1) : 0
  const coverage = coverageSummary(tracker)
  // Un changement de formule avant l'échéance peut s'appliquer tout de suite plutôt qu'à la suite
  const canStartNow = !!tracker.subscription && !!plan && plan.id !== tracker.subscription.plan.id

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    create.mutate(
      {
        planId,
        periods: Number(periods),
        amount: amount === '' ? undefined : Number(amount),
        paymentMethod: method,
        paymentReference: reference.trim() || undefined,
        startsAt: canStartNow && startNow ? new Date().toISOString() : undefined,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon="workspace_premium"
      title="Abonnement"
      subtitle={`${trackerName(tracker)} · IMEI ${tracker.imei}${tracker.student ? ` · ${tracker.student.firstName} ${tracker.student.lastName}` : ''}`}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={create.isPending}>Fermer</Btn>
          <Btn type="submit" form="subscription-form" icon="payments" loading={create.isPending} disabled={!plan}>
            Enregistrer le paiement
          </Btn>
        </>
      }
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#eef1f5] bg-[#f9fafc] px-4 py-3 mb-5">
        <div>
          <p className="text-[12.5px] font-bold text-[#667085]">État actuel</p>
          <p className="text-[13.5px] text-[#475467] mt-0.5">{coverage.detail}</p>
        </div>
        <Pill tone={coverage.tone} dot>{coverage.label}</Pill>
      </div>

      {plansLoading ? (
        <Loading />
      ) : onSale.length === 0 ? (
        <EmptyState
          icon="sell"
          title="Aucune formule en vente"
          text={<>Créez d'abord vos formules depuis l'écran <Link to="/plans" className="font-bold text-[#2563eb]">Formules</Link>.</>}
        />
      ) : (
        <form id="subscription-form" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Formule *" className="sm:col-span-2">
            <select required value={planId} onChange={(e) => setPlanId(e.target.value)} className={inputClass}>
              <option value="">Choisir une formule…</option>
              {onSale.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {planSummary(p)} — {zonesLabel(p.maxZones)}</option>
              ))}
            </select>
          </Field>
          <Field label="Nombre de périodes" hint={plan ? `${Number(periods || 1) * plan.periodMonths} mois couverts` : undefined}>
            <input type="number" min={1} max={36} value={periods} onChange={(e) => setPeriods(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Montant encaissé (FCFA)" hint={plan ? `Tarif attendu : ${fcfa(due)}` : undefined}>
            <input type="number" min={0} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={plan ? String(due) : ''} className={inputClass} />
          </Field>
          <Field label="Moyen de paiement *">
            <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} className={inputClass}>
              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => <option key={m} value={m}>{PAYMENT_LABELS[m]}</option>)}
            </select>
          </Field>
          <Field label="Référence du paiement" hint="Numéro de transaction ou de reçu.">
            <input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={80} className={inputClass} />
          </Field>
          {canStartNow ? (
            <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-[#eef1f5] bg-[#f9fafc] px-4 py-3 cursor-pointer">
              <input type="checkbox" checked={startNow} onChange={(e) => setStartNow(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#2563eb]" />
              <span className="text-[13px] text-[#475467]">
                <strong className="text-[#101828]">Appliquer la nouvelle formule tout de suite.</strong> Sinon elle démarre à la fin de l'abonnement en cours, le {longDate(tracker.paidUntil ?? tracker.subscription!.endsAt)}.
              </span>
            </label>
          ) : tracker.paidUntil ? (
            <p className="sm:col-span-2 text-[13px] text-[#667085]">
              Ce paiement prolonge l'abonnement à partir du {longDate(tracker.paidUntil)}.
            </p>
          ) : null}
        </form>
      )}

      {!!history?.length && (
        <div className="mt-6">
          <p className="text-[12.5px] font-bold text-[#475467] mb-2">Historique des paiements</p>
          <div className="flex flex-col gap-2">
            {history.map((s) => {
              const cancelled = s.status === 'CANCELLED'
              const ended = new Date(s.endsAt) < new Date()
              return (
                <div key={s.id} className={cn('flex flex-wrap items-center gap-3 rounded-[13px] border border-[#eef1f5] bg-[#f9fafc] px-[14px] py-3', cancelled && 'opacity-60')}>
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-[14px] text-[#101828]">{s.plan.name} · {fcfa(s.amount)}</p>
                    <p className="text-[12.5px] text-[#98a2b3]">
                      Du {longDate(s.startsAt)} au {longDate(s.endsAt)} · {PAYMENT_LABELS[s.paymentMethod]}
                      {s.paymentReference ? ` · ${s.paymentReference}` : ''}
                    </p>
                  </div>
                  {cancelled ? <Pill tone="red">Annulé</Pill> : ended ? <Pill tone="slate">Terminé</Pill> : (
                    <Btn size="sm" variant="secondary" onClick={() => setCancelling(s.id)}>Annuler</Btn>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={() => cancelling && cancel.mutate(cancelling, { onSuccess: () => { setCancelling(null); onClose() } })}
        loading={cancel.isPending}
        danger
        title="Annuler cet abonnement ?"
        confirmLabel="Annuler l'abonnement"
        message="À utiliser pour une erreur de saisie ou un remboursement. La ligne reste dans l'historique, mais ne couvre plus le boîtier."
      />
    </Dialog>
  )
}

/** Vente directe d'un boîtier en stock à un parent, sans passer par une école. */
export function DirectSaleDialog({ tracker, onClose }: { tracker: Tracker; onClose: () => void }) {
  const sell = useDirectSale()
  const [form, setForm] = useState({ childFirstName: '', childLastName: '', parentName: '', parentPhone: '' })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <Dialog
      open
      onClose={onClose}
      icon="storefront"
      title="Vente directe à un parent"
      subtitle={`${trackerName(tracker)} · IMEI ${tracker.imei}`}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={sell.isPending}>Annuler</Btn>
          <Btn type="submit" form="direct-sale-form" loading={sell.isPending}>Enregistrer la vente</Btn>
        </>
      }
    >
      <form
        id="direct-sale-form"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          sell.mutate(
            {
              id: tracker.id,
              data: {
                childFirstName: form.childFirstName.trim(),
                childLastName: form.childLastName.trim(),
                parentPhone: form.parentPhone.trim(),
                parentName: form.parentName.trim() || undefined,
              },
            },
            { onSuccess: onClose },
          )
        }}
      >
        <Field label="Prénom de l'enfant *">
          <input required autoFocus value={form.childFirstName} onChange={(e) => set({ childFirstName: e.target.value })} placeholder="Ex. Awa" className={inputClass} />
        </Field>
        <Field label="Nom de l'enfant *">
          <input required value={form.childLastName} onChange={(e) => set({ childLastName: e.target.value })} placeholder="Ex. DIOP" className={inputClass} />
        </Field>
        <Field label="Nom du parent">
          <input value={form.parentName} onChange={(e) => set({ parentName: e.target.value })} placeholder="Ex. Fatou Diop" className={inputClass} />
        </Field>
        <Field label="Téléphone du parent *" hint="Le numéro de son compte dans l'app BAAWA.">
          <input required type="tel" value={form.parentPhone} onChange={(e) => set({ parentPhone: e.target.value })} placeholder="77 123 45 67" className={inputClass} />
        </Field>
        <p className="sm:col-span-2 text-[13px] text-[#667085]">
          Le parent retrouvera le boîtier dans l'app dès que ce numéro sera vérifié par SMS. Pensez ensuite à enregistrer son abonnement.
        </p>
      </form>
    </Dialog>
  )
}
