import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { SchoolFormDialog } from '../../components/schools/SchoolFormDialog'
import { Avatar, Btn, EmptyState, Loading, PageContainer, Panel, Pill, SearchInput } from '../../components/ui/kit'
import { useSchools } from '../../hooks/useSchools'

const PAGE_SIZE = 20

export default function SchoolsListPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSchools(page, PAGE_SIZE, search.trim() || undefined)
  const [showForm, setShowForm] = useState(false)

  const schools = data?.data ?? []
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <AdminLayout title="Écoles">
      <PageContainer>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Rechercher une école, une région…"
          />
          <Btn icon="add" onClick={() => setShowForm(true)}>Nouvelle école</Btn>
        </div>

        {isLoading ? (
          <Loading />
        ) : schools.length === 0 ? (
          <Panel>
            {search ? (
              <EmptyState icon="search_off" title="Aucune école ne correspond à votre recherche" />
            ) : (
              <EmptyState
                icon="school"
                title="Aucune école pour le moment"
                text="Créez une école, puis son compte d'accès et affectez-lui des boîtiers GPS."
                action={<Btn icon="add" onClick={() => setShowForm(true)}>Nouvelle école</Btn>}
              />
            )}
          </Panel>
        ) : (
          <>
            <p className="text-[13px] font-bold text-[#98a2b3] -mb-2">{total} école{total > 1 ? 's' : ''}</p>
            <div className="flex flex-col gap-3">
              {schools.map((s) => (
                <Link
                  key={s.id}
                  to={`/schools/${s.id}`}
                  className="flex flex-wrap items-center gap-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(16,24,40,.35)] hover:border-[#d3dbe6]"
                >
                  <Avatar name={s.name} size={50} />
                  <div className="flex-1 min-w-[180px]">
                    <p className="flex items-center gap-2 font-extrabold text-base text-[#101828]">
                      <span className="truncate">{s.name}</span>
                      {!s.isActive && <Pill tone="slate">Inactive</Pill>}
                    </p>
                    <p className="flex items-center gap-1 text-[13px] font-semibold text-[#98a2b3] mt-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {s.region || 'Région non précisée'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="blue" icon="school" className="px-3 py-[7px] text-[12.5px]">{s._count?.students ?? 0} élèves</Pill>
                    <Pill tone="blue" icon="gps_fixed" className="px-3 py-[7px] text-[12.5px]">{s._count?.trackers ?? 0} boîtiers</Pill>
                    <Pill tone={s._count?.users ? 'slate' : 'amber'} icon="groups" className="px-3 py-[7px] text-[12.5px]" title={s._count?.users ? undefined : 'Aucun compte : personne ne peut gérer cette école'}>
                      {s._count?.users ?? 0} comptes
                    </Pill>
                    <span className="material-symbols-outlined text-[20px] text-[#c4cdda]">chevron_right</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Btn size="sm" variant="secondary" icon="chevron_left" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</Btn>
            <span className="text-[13px] font-bold text-[#667085]">Page {page} sur {pages}</span>
            <Btn size="sm" variant="secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Suivant</Btn>
          </div>
        )}
      </PageContainer>

      {showForm && <SchoolFormDialog onClose={() => setShowForm(false)} />}
    </AdminLayout>
  )
}
