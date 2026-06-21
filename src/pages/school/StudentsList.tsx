import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useStudents, useCreateStudent, useDeleteStudent } from '../../hooks/useStudents'

const EMPTY = { firstName: '', lastName: '', className: '', parentName: '', parentPhone: '', imei: '' }

export default function StudentsListPage() {
  const [search, setSearch] = useState('')
  const { data: students, isLoading } = useStudents(search || undefined)
  const createStudent = useCreateStudent()
  const deleteStudent = useDeleteStudent()
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createStudent.mutate(
      { firstName: form.firstName, lastName: form.lastName, className: form.className || undefined,
        parentName: form.parentName || undefined, parentPhone: form.parentPhone || undefined, imei: form.imei || undefined },
      { onSuccess: () => { setShowForm(false); setForm(EMPTY) } },
    )
  }

  return (
    <AdminLayout title="Élèves">
      <div className="flex items-center justify-between mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève..." className="px-4 py-2 border border-slate-200 rounded-lg w-72" />
        <button onClick={() => setShowForm((v) => !v)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">+ Ajouter un élève</button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-slate-100 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3">
          <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Prénom *" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nom *" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="Classe" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Nom du parent" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} placeholder="Téléphone parent" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input value={form.imei} onChange={(e) => setForm({ ...form, imei: e.target.value })} placeholder="IMEI traceur (tracking phase 2)" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <button type="submit" disabled={createStudent.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold col-span-2 disabled:opacity-50">Ajouter</button>
        </form>
      )}

      {isLoading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl divide-y">
          {students?.length ? students.map((st) => (
            <div key={st.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-bold text-slate-900">{st.firstName} {st.lastName}</p>
                <p className="text-sm text-slate-500">{st.className || '—'} · {st.parentName || 'parent —'}</p>
              </div>
              <button onClick={() => deleteStudent.mutate(st.id)} className="text-red-600 text-sm font-semibold hover:underline">Supprimer</button>
            </div>
          )) : <p className="px-4 py-8 text-center text-slate-400">Aucun élève</p>}
        </div>
      )}
    </AdminLayout>
  )
}
