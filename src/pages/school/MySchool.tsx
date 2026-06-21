import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { mySchoolService } from '../../api/services/mySchoolService'

export default function MySchoolPage() {
  const { data: school, isLoading } = useQuery({ queryKey: ['my-school'], queryFn: mySchoolService.get })

  return (
    <AdminLayout title="Mon école">
      {isLoading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-900">{school?.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{school?.region || '—'}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-400">Téléphone</span><br />{school?.phoneNumber || '—'}</div>
            <div><span className="text-slate-400">Email</span><br />{school?.email || '—'}</div>
            <div className="col-span-2"><span className="text-slate-400">Adresse</span><br />{school?.address || '—'}</div>
            <div><span className="text-slate-400">Élèves</span><br />{school?._count?.students ?? 0}</div>
            <div><span className="text-slate-400">Comptes</span><br />{school?._count?.users ?? 0}</div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
