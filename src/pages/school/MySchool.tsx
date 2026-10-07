import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { mySchoolService } from '../../api/services/mySchoolService'
import { Loading, PageContainer, Panel, Pill } from '../../components/ui/kit'
import { useStudentPositions } from '../../hooks/useStudentPositions'
import { useMySchoolTrackers, useOpenAlarmsCount } from '../../hooks/useTrackers'
import { cn } from '../../utils/cn'
import { initialsOf, longDate, trackingSummary } from '../../utils/tracking'

function Shortcut({ to, icon, value, label, hint, alert }: {
  to: string
  icon: string
  value: number | string
  label: string
  hint: string
  alert?: boolean
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex items-center gap-4 bg-white border rounded-2xl px-5 py-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(16,24,40,.35)]',
        alert ? 'border-[#fda29b]' : 'border-[#e8ecf2] hover:border-[#d3dbe6]',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-[48px] h-[48px] rounded-[14px] shrink-0',
          alert ? 'bg-[#fef3f2] text-[#d92d20]' : 'bg-[#eef4ff] text-[#2563eb]',
        )}
      >
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#667085]">{label}</p>
        <p className="text-[24px] leading-tight font-extrabold text-[#101828]">{value}</p>
        <p className="text-[12.5px] font-semibold text-[#98a2b3] truncate">{hint}</p>
      </div>
      <span className="material-symbols-outlined text-[20px] text-[#c4cdda] transition group-hover:text-[#2563eb]">chevron_right</span>
    </Link>
  )
}

export default function MySchoolPage() {
  const { data: school, isLoading } = useQuery({ queryKey: ['my-school'], queryFn: mySchoolService.get })
  const { data: trackers } = useMySchoolTrackers()
  const { data: positions } = useStudentPositions()
  const { data: alarms } = useOpenAlarmsCount()

  if (isLoading) return <AdminLayout title="Mon école"><Loading /></AdminLayout>

  const free = (trackers ?? []).filter((t) => !t.studentId && t.state === 'ACTIVE').length
  const equipped = positions?.length ?? 0
  const located = (positions ?? []).filter((p) => trackingSummary(p).tone === 'green').length
  const open = alarms?.open ?? 0

  const chips = [
    { icon: 'location_on', value: school?.region },
    { icon: 'phone', value: school?.phoneNumber },
    { icon: 'mail', value: school?.email },
    { icon: 'home', value: school?.address },
    { icon: 'calendar_today', value: school?.createdAt ? `Depuis le ${longDate(school.createdAt)}` : undefined },
  ].filter((c) => c.value)

  return (
    <AdminLayout title="Mon école">
      <PageContainer>
        <Panel className="relative overflow-hidden p-7">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(37,99,235,.07), transparent 55%)' }}
          />
          <div className="relative z-10 flex flex-wrap items-center gap-5">
            <div className="flex items-center justify-center w-[66px] h-[66px] rounded-[18px] bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white font-extrabold text-[22px] shadow-[0_12px_24px_-10px_rgba(37,99,235,.6)] shrink-0">
              {school?.name ? initialsOf(school.name) : '—'}
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#101828]">{school?.name}</h2>
                {school && (
                  <Pill tone={school.isActive ? 'green' : 'slate'} dot>{school.isActive ? 'Active' : 'Inactive'}</Pill>
                )}
              </div>
              <div className="flex flex-wrap gap-[10px] mt-3">
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
          </div>
        </Panel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Shortcut
            to="/alerts"
            icon={open ? 'notification_important' : 'verified_user'}
            value={open}
            label="Alertes à traiter"
            hint={open ? 'Des alarmes attendent une réponse' : 'Tout est calme'}
            alert={open > 0}
          />
          <Shortcut
            to="/map"
            icon="map"
            value={`${located} / ${equipped}`}
            label="Élèves localisés"
            hint="Position GPS récente, sur les élèves équipés"
          />
          <Shortcut
            to="/students"
            icon="groups"
            value={school?._count?.students ?? 0}
            label="Élèves"
            hint={`${equipped} équipé${equipped > 1 ? 's' : ''} d'un boîtier`}
          />
          <Shortcut
            to="/trackers"
            icon="gps_fixed"
            value={trackers?.length ?? school?._count?.trackers ?? 0}
            label="Boîtiers GPS"
            hint={free ? `${free} libre${free > 1 ? 's' : ''} à attribuer` : 'Aucun boîtier libre'}
          />
        </div>
      </PageContainer>
    </AdminLayout>
  )
}
