import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PlanFormDialog } from '../../components/billing/BillingDialogs'
import {
  Btn, ConfirmDialog, EmptyState, IconBtn, Loading, PageContainer, Panel, Pill, StatCard,
} from '../../components/ui/kit'
import { useDeletePlan, usePlans, useSubscriptionStats, useTogglePlan } from '../../hooks/useSubscriptions'
import { Plan } from '../../api/types'
import { fcfa, periodLabel, zonesLabel } from '../../utils/billing'
import { cn } from '../../utils/cn'

export default function PlansListPage() {
  const { data: plans, isLoading } = usePlans()
  const { data: stats } = useSubscriptionStats()
  const toggle = useTogglePlan()
  const remove = useDeletePlan()
  // `undefined` : fermé ; `null` : création ; sinon la formule en cours de modification
  const [editing, setEditing] = useState<Plan | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<Plan | null>(null)

  return (
    <AdminLayout title="Formules d'abonnement">
      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="verified" label="Boîtiers abonnés" value={stats?.covered ?? '—'} tone="green" />
          <StatCard icon="gps_off" label="Sans abonnement" value={stats?.uncovered ?? '—'} tone="slate" />
          <StatCard
            icon="event_upcoming"
            label="Échéance sous 14 jours"
            value={stats?.expiringSoon ?? '—'}
            tone={stats?.expiringSoon ? 'amber' : 'slate'}
            hint="Abonnements qui se terminent bientôt, sans renouvellement payé"
          />
          <StatCard icon="payments" label="Encaissé ce mois-ci" value={stats ? fcfa(stats.revenueThisMonth) : '—'} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13.5px] text-[#667085] max-w-[620px]">
            Chaque boîtier vendu à un parent est couvert par une formule. Elle fixe le tarif et le nombre de zones de sécurité que le parent peut tracer.
          </p>
          <Btn icon="add" onClick={() => setEditing(null)}>Nouvelle formule</Btn>
        </div>

        {isLoading ? (
          <Loading />
        ) : !plans?.length ? (
          <Panel>
            <EmptyState
              icon="sell"
              title="Aucune formule pour le moment"
              text="Créez vos paliers (par exemple Pro, Premium, Gold) avec leur tarif et leur nombre de zones de sécurité."
              action={<Btn icon="add" onClick={() => setEditing(null)}>Nouvelle formule</Btn>}
            />
          </Panel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Panel key={plan.id} className={cn('flex flex-col p-6', !plan.isActive && 'opacity-70')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[19px] font-extrabold text-[#101828] truncate">{plan.name}</h3>
                    {plan.description && <p className="text-[13px] text-[#667085] mt-1">{plan.description}</p>}
                  </div>
                  <Pill tone={plan.isActive ? 'green' : 'slate'} dot>{plan.isActive ? 'En vente' : 'Retirée'}</Pill>
                </div>

                <p className="mt-5">
                  <span className="text-[28px] leading-none font-extrabold tracking-[-0.02em] text-[#101828]">{fcfa(plan.price)}</span>
                  <span className="text-[13.5px] font-semibold text-[#98a2b3]"> {periodLabel(plan.periodMonths)}</span>
                </p>

                <ul className="flex flex-col gap-2 mt-5 flex-1">
                  <li className="flex items-center gap-2 text-[14px] font-bold text-[#101828]">
                    <span className="material-symbols-outlined text-[18px] text-[#2563eb]">share_location</span>
                    {zonesLabel(plan.maxZones)}
                  </li>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[13.5px] text-[#475467]">
                      <span className="material-symbols-outlined text-[18px] text-[#12b76a]">check</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-[#eef1f5]">
                  <span className="text-[12.5px] font-bold text-[#667085]">
                    {plan.activeSubscriptions ?? 0} abonnement{(plan.activeSubscriptions ?? 0) > 1 ? 's' : ''} en cours
                  </span>
                  <div className="flex items-center gap-1">
                    <IconBtn
                      icon={plan.isActive ? 'visibility_off' : 'visibility'}
                      label={plan.isActive ? 'Retirer de la vente' : 'Remettre en vente'}
                      tone="blue"
                      disabled={toggle.isPending}
                      onClick={() => toggle.mutate({ id: plan.id, isActive: !plan.isActive })}
                    />
                    <IconBtn icon="edit" label="Modifier" tone="blue" onClick={() => setEditing(plan)} />
                    <IconBtn icon="delete" label="Supprimer" tone="red" onClick={() => setDeleting(plan)} />
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </PageContainer>

      {editing !== undefined && <PlanFormDialog plan={editing} onClose={() => setEditing(undefined)} />}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSettled: () => setDeleting(null) })}
        loading={remove.isPending}
        danger
        title="Supprimer cette formule ?"
        confirmLabel="Supprimer"
        message={
          <>
            La formule <strong className="text-[#101828]">{deleting?.name}</strong> sera supprimée. Si elle a déjà été
            souscrite, la suppression sera refusée : retirez-la plutôt de la vente pour garder l'historique des paiements.
          </>
        }
      />
    </AdminLayout>
  )
}
