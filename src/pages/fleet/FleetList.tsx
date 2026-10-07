import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { AddTrackersDialog, EditTrackerDialog, TrackerSchoolDialog } from '../../components/trackers/FleetDialogs'
import { DirectSaleDialog, SubscriptionDialog } from '../../components/billing/BillingDialogs'
import { TrackerStatePill } from '../../components/trackers/TrackerBits'
import {
  Btn, ConfirmDialog, EmptyState, IconBtn, Loading, PageContainer, Panel, Pill, SearchInput, Segmented, StatCard,
} from '../../components/ui/kit'
import { useDeleteTracker, useSyncTracker, useTrackers, useTrackerStats } from '../../hooks/useTrackers'
import { Tracker, TrackerAssignment } from '../../api/types'
import { useDirectReturn } from '../../hooks/useSubscriptions'
import { inputClass } from '../../components/ui/styles'
import { coverageSummary } from '../../utils/billing'
import { cn } from '../../utils/cn'
import { trackerName } from '../../utils/tracking'

const PAGE_SIZE = 20
type Filter = 'all' | TrackerAssignment

export default function FleetListPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [coverage, setCoverage] = useState<'' | 'covered' | 'uncovered'>('')
  const [page, setPage] = useState(1)
  const { data: stats } = useTrackerStats()
  const { data, isLoading } = useTrackers({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
    assignment: filter === 'all' ? undefined : filter,
    coverage: coverage || undefined,
  })
  const directReturn = useDirectReturn()
  const [subscribing, setSubscribing] = useState<Tracker | null>(null)
  const [selling, setSelling] = useState<Tracker | null>(null)
  const [returning, setReturning] = useState<Tracker | null>(null)
  const sync = useSyncTracker()
  const remove = useDeleteTracker()

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Tracker | null>(null)
  const [moving, setMoving] = useState<Tracker | null>(null)
  const [deleting, setDeleting] = useState<Tracker | null>(null)

  const trackers = data?.data ?? []
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
  const changeFilter = (f: Filter) => { setFilter(f); setPage(1) }

  return (
    <AdminLayout title="Boîtiers GPS">
      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="gps_fixed" label="Boîtiers au total" value={stats?.total ?? '—'} />
          <StatCard icon="inventory_2" label="En stock" value={stats?.inStock ?? '—'} tone="slate" hint="Pas encore affectés à une école" />
          <StatCard icon="person_pin_circle" label="Portés par un enfant" value={stats?.assigned ?? '—'} tone="green" />
          <StatCard
            icon="build"
            label="Hors service ou perdus"
            value={stats?.outOfService ?? '—'}
            tone={stats?.outOfService ? 'amber' : 'slate'}
          />
        </div>

        {!!stats?.unsynced && (
          <div className="flex items-center gap-3 rounded-xl border border-[#fedf89] bg-[#fffaeb] px-4 py-3 text-[13.5px] font-semibold text-[#b54708]">
            <span className="material-symbols-outlined text-[19px]">sync_problem</span>
            {stats.unsynced} boîtier{stats.unsynced > 1 ? 's ne sont pas reliés' : " n'est pas relié"} au serveur de
            géolocalisation : ils ne remonteront aucune position. Utilisez le bouton de synchronisation sur leur ligne.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Rechercher par IMEI, étiquette ou numéro de SIM…"
          />
          <div className="flex gap-2">
            <Link to="/plans"><Btn variant="secondary" icon="sell">Formules</Btn></Link>
            <Link to="/fleet/map"><Btn variant="secondary" icon="map">Carte</Btn></Link>
            <Btn icon="add" onClick={() => setAdding(true)}>Enregistrer des boîtiers</Btn>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            value={filter}
            onChange={changeFilter}
            options={[
              { value: 'all', label: 'Tous', count: stats?.total },
              { value: 'stock', label: 'En stock', count: stats?.inStock },
              { value: 'available', label: 'En école, libres', count: stats?.available },
              { value: 'assigned', label: 'Portés', count: stats?.assigned },
              { value: 'direct', label: 'Vente directe' },
            ]}
          />
          <select
            value={coverage}
            onChange={(e) => { setCoverage(e.target.value as typeof coverage); setPage(1) }}
            className={cn(inputClass, 'w-auto py-[9px] text-[13px] font-bold')}
            aria-label="Filtrer par abonnement"
          >
            <option value="">Tous les abonnements</option>
            <option value="covered">Abonnés</option>
            <option value="uncovered">Sans abonnement</option>
          </select>
        </div>

        {isLoading ? (
          <Loading />
        ) : trackers.length === 0 ? (
          <Panel>
            {stats?.total === 0 ? (
              <EmptyState
                icon="gps_off"
                title="Aucun boîtier enregistré"
                text="Enregistrez vos boîtiers par leur IMEI, puis affectez-les aux écoles."
                action={<Btn icon="add" onClick={() => setAdding(true)}>Enregistrer des boîtiers</Btn>}
              />
            ) : (
              <EmptyState icon="search_off" title="Aucun boîtier ne correspond" text="Modifiez votre recherche ou changez de filtre." />
            )}
          </Panel>
        ) : (
          <div className="flex flex-col gap-3">
            {trackers.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-3">
                <div className="flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-[#eef4ff] text-[#2563eb] shrink-0">
                  <span className="material-symbols-outlined text-[23px]">gps_fixed</span>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <p className="font-extrabold text-[15px] text-[#101828] truncate">{trackerName(t)}</p>
                  <p className="text-[12.5px] font-semibold text-[#98a2b3]">
                    <span className="font-mono">IMEI {t.imei}</span> · {t.model}
                    {t.simNumber && ` · SIM ${t.simNumber}`}
                  </p>
                </div>

                <div className="w-[230px] shrink-0">
                  {t.school ? (
                    <>
                      <Link to={`/schools/${t.school.id}`} className="font-bold text-[14px] text-[#101828] hover:text-[#2563eb] truncate block">
                        {t.school.name}
                      </Link>
                      <p className="text-[12.5px] text-[#98a2b3] truncate">
                        {t.student ? `Porté par ${t.student.firstName} ${t.student.lastName}` : "Libre dans l'école"}
                      </p>
                    </>
                  ) : t.student ? (
                    <>
                      <p className="font-bold text-[14px] text-[#101828] truncate">{t.student.firstName} {t.student.lastName}</p>
                      <p className="text-[12.5px] text-[#98a2b3] truncate">Vente directe, sans école</p>
                    </>
                  ) : (
                    <Pill tone="slate" icon="inventory_2">En stock</Pill>
                  )}
                  {t.ownerPhone && (
                    <p
                      className="flex items-center gap-1 text-[12.5px] text-[#667085] truncate mt-0.5"
                      title={t.owner ? 'Parent rattaché à son compte BAAWA' : "Le parent n'a pas encore de compte vérifié avec ce numéro"}
                    >
                      <span className={cn('material-symbols-outlined text-[14px]', t.owner ? 'text-[#12b76a]' : 'text-[#f79009]')}>
                        {t.owner ? 'how_to_reg' : 'hourglass_top'}
                      </span>
                      {t.owner ? `${t.owner.firstName} ${t.owner.lastName}` : t.ownerPhone}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 w-[260px] shrink-0">
                  {(() => {
                    const c = coverageSummary(t)
                    return (
                      <button type="button" onClick={() => setSubscribing(t)} title={c.detail} className="rounded-full transition hover:brightness-95">
                        <Pill tone={c.tone} icon="workspace_premium">{c.label}</Pill>
                      </button>
                    )
                  })()}
                  {t.state !== 'ACTIVE' && <TrackerStatePill state={t.state} />}
                  {t.traccarDeviceId === null && (
                    <Pill tone="amber" icon="sync_problem" title="Pas encore relié au serveur de géolocalisation">Non relié</Pill>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  {t.traccarDeviceId === null && (
                    <IconBtn
                      icon="sync"
                      label="Relier au serveur de géolocalisation"
                      tone="blue"
                      disabled={sync.isPending}
                      onClick={() => sync.mutate(t.id)}
                    />
                  )}
                  <IconBtn icon="payments" label="Abonnement et paiements" tone="blue" onClick={() => setSubscribing(t)} />
                  {!t.schoolId && !t.studentId && (
                    <IconBtn
                      icon="storefront"
                      label={t.state === 'ACTIVE' ? 'Vente directe à un parent' : "Hors service : ne peut pas être vendu"}
                      tone="blue"
                      disabled={t.state !== 'ACTIVE'}
                      onClick={() => setSelling(t)}
                    />
                  )}
                  {!t.schoolId && t.studentId && (
                    <IconBtn icon="assignment_return" label="Reprendre le boîtier (retour en stock)" tone="blue" onClick={() => setReturning(t)} />
                  )}
                  <IconBtn
                    icon="move_down"
                    label={t.studentId ? "Porté par un enfant : il doit d'abord être retiré ou repris" : 'Affecter à une école'}
                    tone="blue"
                    disabled={!!t.studentId}
                    onClick={() => setMoving(t)}
                  />
                  <IconBtn icon="edit" label="Modifier" tone="blue" onClick={() => setEditing(t)} />
                  <IconBtn
                    icon="delete"
                    label={t.studentId ? "Porté par un enfant : il doit d'abord être retiré ou repris" : 'Supprimer'}
                    tone="red"
                    disabled={!!t.studentId}
                    onClick={() => setDeleting(t)}
                  />
                </div>
              </div>
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

      {adding && <AddTrackersDialog onClose={() => setAdding(false)} />}
      {editing && <EditTrackerDialog tracker={editing} onClose={() => setEditing(null)} />}
      {moving && <TrackerSchoolDialog tracker={moving} onClose={() => setMoving(null)} />}
      {subscribing && <SubscriptionDialog tracker={subscribing} onClose={() => setSubscribing(null)} />}
      {selling && <DirectSaleDialog tracker={selling} onClose={() => setSelling(null)} />}

      <ConfirmDialog
        open={!!returning}
        onClose={() => setReturning(null)}
        onConfirm={() => returning && directReturn.mutate(returning.id, { onSuccess: () => setReturning(null) })}
        loading={directReturn.isPending}
        danger
        title="Reprendre ce boîtier ?"
        confirmLabel="Reprendre"
        message={
          <>
            <strong className="text-[#101828]">{returning?.student?.firstName} {returning?.student?.lastName}</strong> ne
            sera plus suivi. Le parent perd l'accès au boîtier et ses zones de sécurité sont supprimées. L'abonnement
            reste attaché au boîtier, qui retourne en stock.
          </>
        }
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        loading={remove.isPending}
        danger
        title="Supprimer ce boîtier ?"
        confirmLabel="Supprimer"
        message={
          <>
            Le boîtier <strong className="text-[#101828]">{deleting && trackerName(deleting)}</strong> (IMEI {deleting?.imei})
            sera retiré du parc, avec l'historique de ses alarmes. Vous pourrez le réenregistrer plus tard avec le même IMEI.
          </>
        }
      />
    </AdminLayout>
  )
}
