import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { SchoolAccounts } from '../../components/schools/SchoolAccounts'
import { SchoolFormDialog } from '../../components/schools/SchoolFormDialog'
import { SchoolTrackersPanel } from '../../components/trackers/SchoolTrackersPanel'
import {
  Avatar, Btn, ConfirmDialog, EmptyState, Loading, PageContainer, Panel, PanelHeader, Pill,
} from '../../components/ui/kit'
import {
  useSchool, useCreateSchoolAdmin, useSchoolStudents, useSchoolUsers, useToggleSchoolUser,
  useToggleSchool, useDeleteSchool,
} from '../../hooks/useSchools'
import { initialsOf, longDate, trackerName } from '../../utils/tracking'

export default function SchoolDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: school, isLoading } = useSchool(id)
  const { data: students } = useSchoolStudents(id)
  const { data: users, isLoading: usersLoading } = useSchoolUsers(id)
  const createAdmin = useCreateSchoolAdmin(id)
  const toggleUser = useToggleSchoolUser(id)
  const toggleSchool = useToggleSchool(id)
  const deleteSchool = useDeleteSchool()
  const [editing, setEditing] = useState(false)
  const [confirm, setConfirm] = useState<'toggle' | 'delete' | null>(null)

  if (isLoading) return <AdminLayout title="École" backTo="/schools"><Loading /></AdminLayout>
  if (!school) {
    return (
      <AdminLayout title="École" backTo="/schools">
        <PageContainer><Panel><EmptyState icon="school" title="École introuvable" text="Elle a peut-être été supprimée." /></Panel></PageContainer>
      </AdminLayout>
    )
  }

  const chips = [
    { icon: 'location_on', value: school.region },
    { icon: 'phone', value: school.phoneNumber },
    { icon: 'mail', value: school.email },
    { icon: 'home', value: school.address },
    { icon: 'calendar_today', value: `Depuis le ${longDate(school.createdAt)}` },
  ].filter((c) => c.value)
  const trackerCount = school._count?.trackers ?? 0

  return (
    <AdminLayout title={school.name} backTo="/schools">
      <PageContainer>
        <Panel className="relative overflow-hidden p-7">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(37,99,235,.07), transparent 55%)' }}
          />
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center justify-center w-[66px] h-[66px] rounded-[18px] bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white font-extrabold text-[22px] shadow-[0_12px_24px_-10px_rgba(37,99,235,.6)]">
                {initialsOf(school.name)}
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn size="sm" variant="secondary" icon="edit" onClick={() => setEditing(true)}>Modifier</Btn>
                <Btn size="sm" variant="secondary" icon={school.isActive ? 'block' : 'check_circle'} onClick={() => setConfirm('toggle')}>
                  {school.isActive ? 'Désactiver' : 'Réactiver'}
                </Btn>
                <Btn size="sm" variant="secondary" icon="delete" className="hover:bg-[#fef3f2] hover:text-[#d92d20]" onClick={() => setConfirm('delete')}>
                  Supprimer
                </Btn>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#101828]">{school.name}</h2>
              <Pill tone={school.isActive ? 'green' : 'slate'} dot>{school.isActive ? 'Active' : 'Inactive'}</Pill>
            </div>
            <div className="flex flex-wrap gap-[10px] mt-4">
              {chips.map((chip) => (
                <span
                  key={chip.icon}
                  className="flex items-center gap-2 px-[14px] py-2 rounded-[11px] bg-[#f7f9fc] border border-[#eef1f5] text-[#475467] font-semibold text-[13.5px]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#2563eb]">{chip.icon}</span>
                  {chip.value}
                </span>
              ))}
            </div>
          </div>
        </Panel>

        <SchoolAccounts
          users={users}
          isLoading={usersLoading}
          onCreate={(data) => createAdmin.mutateAsync(data)}
          creating={createAdmin.isPending}
          onToggle={(userId) => toggleUser.mutateAsync(userId)}
          toggling={toggleUser.isPending}
        />

        <SchoolTrackersPanel schoolId={school.id} schoolName={school.name} />

        <Panel className="p-7">
          <PanelHeader
            icon="groups"
            title="Élèves"
            subtitle="Gérés par l'école — consultation seule"
            action={<span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#2563eb] font-extrabold text-sm">{students?.length ?? 0}</span>}
          />
          {students?.length ? (
            <div className="flex flex-col gap-2">
              {students.map((st) => (
                <div key={st.id} className="flex flex-wrap items-center gap-3 bg-[#f9fafc] border border-[#eef1f5] rounded-[13px] px-[14px] py-3">
                  <Avatar name={`${st.firstName} ${st.lastName}`} />
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-bold text-[14.5px] text-[#101828] truncate">{st.firstName} {st.lastName}</p>
                    <p className="text-[12.5px] text-[#98a2b3] truncate">
                      {[st.parentName, st.parentPhone].filter(Boolean).join(' · ') || 'Parent non renseigné'}
                    </p>
                  </div>
                  {st.tracker && (
                    <Pill tone="blue" icon="gps_fixed" title={`IMEI ${st.tracker.imei}`}>{trackerName(st.tracker)}</Pill>
                  )}
                  <Pill tone="slate">{st.className || 'Classe —'}</Pill>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="groups" title="Aucun élève inscrit pour le moment" />
          )}
        </Panel>
      </PageContainer>

      {editing && <SchoolFormDialog school={school} onClose={() => setEditing(false)} />}

      <ConfirmDialog
        open={confirm === 'toggle'}
        onClose={() => setConfirm(null)}
        onConfirm={() => toggleSchool.mutate(undefined, { onSuccess: () => setConfirm(null) })}
        loading={toggleSchool.isPending}
        danger={school.isActive}
        title={school.isActive ? 'Désactiver cette école ?' : 'Réactiver cette école ?'}
        confirmLabel={school.isActive ? 'Désactiver' : 'Réactiver'}
        message={
          school.isActive
            ? <>L'école <strong className="text-[#101828]">{school.name}</strong> sera marquée inactive. Ses données et ses boîtiers sont conservés.</>
            : <>L'école <strong className="text-[#101828]">{school.name}</strong> sera de nouveau active.</>
        }
      />

      <ConfirmDialog
        open={confirm === 'delete'}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteSchool.mutate(school.id, { onSuccess: () => navigate('/schools') })}
        loading={deleteSchool.isPending}
        danger
        title="Supprimer cette école ?"
        confirmLabel="Supprimer l'école"
        message={
          <>
            <strong className="text-[#101828]">{school.name}</strong> disparaîtra de la liste.
            {trackerCount > 0 && (
              <> Ses {trackerCount} boîtier{trackerCount > 1 ? 's' : ''} retourneront en stock et ses élèves ne seront plus suivis.</>
            )}
          </>
        }
      />
    </AdminLayout>
  )
}
