import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSchool, useCreateSchoolAdmin, useSchoolStudents } from '../../hooks/useSchools'

export default function SchoolDetailsPage() {
  const { id = '' } = useParams()
  const { data: school, isLoading } = useSchool(id)
  const { data: students } = useSchoolStudents(id)
  const createAdmin = useCreateSchoolAdmin(id)
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', phoneNumber: '' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createAdmin.mutate(form, { onSuccess: () => setForm({ email: '', firstName: '', lastName: '', phoneNumber: '' }) })
  }

  if (isLoading) return <AdminLayout title="École"><p className="text-slate-400">Chargement…</p></AdminLayout>

  return (
    <AdminLayout title={school?.name || 'École'}>
      <div className="bg-white border border-slate-100 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">{school?.name}</h2>
        <p className="text-sm text-slate-500">{school?.region || '—'} · {school?.phoneNumber || '—'} · {school?.email || '—'}</p>
        <p className="text-sm text-slate-500 mt-1">{school?.address}</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-3">Créer le compte administrateur de l'école</h3>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Prénom *" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nom *" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Téléphone *" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <button type="submit" disabled={createAdmin.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold col-span-2 disabled:opacity-50">
            Créer le compte (mot de passe envoyé par email)
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6">
        <h3 className="font-bold text-slate-900 mb-3">Élèves ({students?.length ?? 0})</h3>
        <div className="divide-y">
          {students?.length ? students.map((st) => (
            <div key={st.id} className="py-2 flex justify-between text-sm">
              <span className="font-semibold text-slate-800">{st.firstName} {st.lastName}</span>
              <span className="text-slate-500">{st.className || '—'}</span>
            </div>
          )) : <p className="text-slate-400 text-sm">Aucun élève</p>}
        </div>
      </div>
    </AdminLayout>
  )
}
