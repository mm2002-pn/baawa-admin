import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { StudentFormDialog } from '../../components/students/StudentFormDialog'
import { TrackingPill } from '../../components/trackers/TrackerBits'
import {
  Avatar, Btn, ConfirmDialog, EmptyState, IconBtn, Loading, PageContainer, Panel, Pill, SearchInput, Segmented,
} from '../../components/ui/kit'
import { useStudents, useDeleteStudent } from '../../hooks/useStudents'
import { useStudentPositions } from '../../hooks/useStudentPositions'
import { useMySchoolTrackers } from '../../hooks/useTrackers'
import { Student } from '../../api/types'
import { trackerName } from '../../utils/tracking'

type EquipFilter = 'all' | 'equipped' | 'unequipped'

export default function StudentsListPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<EquipFilter>('all')
  const { data: students, isLoading } = useStudents(search.trim() || undefined)
  const { data: trackers } = useMySchoolTrackers()
  const { data: positions } = useStudentPositions()
  const deleteStudent = useDeleteStudent()

  // `undefined` : fermé ; `null` : création ; sinon l'élève en cours de modification
  const [editing, setEditing] = useState<Student | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<Student | null>(null)

  const liveByStudent = useMemo(() => new Map((positions ?? []).map((p) => [p.studentId, p])), [positions])
  const all = students ?? []
  const equipped = all.filter((s) => s.tracker).length
  const shown = all.filter((s) => filter === 'all' || (filter === 'equipped') === !!s.tracker)

  return (
    <AdminLayout title="Élèves">
      <PageContainer>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève, une classe, un parent…" />
          <Btn icon="person_add" onClick={() => setEditing(null)}>Ajouter un élève</Btn>
        </div>

        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tous', count: all.length },
            { value: 'equipped', label: 'Avec boîtier', count: equipped },
            { value: 'unequipped', label: 'Sans boîtier', count: all.length - equipped },
          ]}
        />

        {isLoading ? (
          <Loading />
        ) : shown.length === 0 ? (
          <Panel>
            {all.length === 0 && !search ? (
              <EmptyState
                icon="groups"
                title="Aucun élève pour le moment"
                text="Ajoutez vos élèves, puis attribuez-leur un boîtier GPS pour les suivre sur la carte."
                action={<Btn icon="person_add" onClick={() => setEditing(null)}>Ajouter un élève</Btn>}
              />
            ) : (
              <EmptyState icon="search_off" title="Aucun élève ne correspond" text="Modifiez votre recherche ou changez de filtre." />
            )}
          </Panel>
        ) : (
          <div className="flex flex-col gap-3">
            {shown.map((st) => {
              const live = liveByStudent.get(st.id)
              const parent = [st.parentName, st.parentPhone].filter(Boolean).join(' · ')
              return (
                <div
                  key={st.id}
                  className="flex flex-wrap items-center gap-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-3"
                >
                  <Avatar name={`${st.firstName} ${st.lastName}`} size={46} />
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-extrabold text-[15px] text-[#101828] truncate">
                      {st.firstName} {st.lastName}
                    </p>
                    <p className="text-[13px] font-semibold text-[#98a2b3] truncate">
                      {st.className || 'Classe non renseignée'}
                      {parent && ` · ${parent}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {st.tracker ? (
                      <>
                        <Pill tone="blue" icon="gps_fixed" title={`IMEI ${st.tracker.imei}`}>{trackerName(st.tracker)}</Pill>
                        {live && <TrackingPill live={live} />}
                      </>
                    ) : (
                      <Pill tone="slate" icon="gps_off">Sans boîtier</Pill>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {st.tracker && (
                      <Link
                        to={`/map?student=${st.id}`}
                        title="Voir sur la carte"
                        aria-label="Voir sur la carte"
                        className="flex items-center justify-center w-9 h-9 rounded-[10px] text-[#667085] transition hover:bg-[#eef4ff] hover:text-[#2563eb]"
                      >
                        <span className="material-symbols-outlined text-[19px]">map</span>
                      </Link>
                    )}
                    <IconBtn icon="edit" label="Modifier" tone="blue" onClick={() => setEditing(st)} />
                    <IconBtn icon="delete" label="Supprimer" tone="red" onClick={() => setDeleting(st)} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PageContainer>

      {editing !== undefined && (
        <StudentFormDialog student={editing} trackers={trackers ?? []} onClose={() => setEditing(undefined)} />
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteStudent.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        loading={deleteStudent.isPending}
        danger
        title="Supprimer cet élève ?"
        confirmLabel="Supprimer"
        message={
          <>
            <strong className="text-[#101828]">{deleting?.firstName} {deleting?.lastName}</strong> sera retiré de la liste.
            {deleting?.tracker && (
              <> Son boîtier ({trackerName(deleting.tracker)}) redeviendra libre et pourra être attribué à un autre élève.</>
            )}
          </>
        }
      />
    </AdminLayout>
  )
}
