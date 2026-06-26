import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSchools, useCreateSchool } from '../../hooks/useSchools'

export default function SchoolsListPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useSchools(1, 50, search || undefined)
  const createSchool = useCreateSchool()
  const [form, setForm] = useState({ name: '', region: '', address: '', phoneNumber: '', email: '' })
  const [showForm, setShowForm] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createSchool.mutate(
      { name: form.name, region: form.region || undefined, address: form.address || undefined,
        phoneNumber: form.phoneNumber || undefined, email: form.email || undefined },
      { onSuccess: () => { setShowForm(false); setForm({ name: '', region: '', address: '', phoneNumber: '', email: '' }) } },
    )
  }

  return (
    <AdminLayout title="Écoles">
      <div className="flex items-center justify-between mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une école..."
          className="px-4 py-2 border border-slate-200 rounded-lg w-72"
        />
        <button onClick={() => setShowForm((v) => !v)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
          + Nouvelle école
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-slate-100 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom *" className="px-3 py-2 border border-slate-200 rounded-lg col-span-2" />
          <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Région" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Téléphone" className="px-3 py-2 border border-slate-200 rounded-lg" />
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse" className="px-3 py-2 border border-slate-200 rounded-lg col-span-2" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 border border-slate-200 rounded-lg col-span-2" />
          <button type="submit" disabled={createSchool.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold col-span-2 disabled:opacity-50">
            Créer
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl divide-y">
          {data?.data?.length ? data.data.map((s) => (
            <Link key={s.id} to={`/schools/${s.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
              <div>
                <p className="font-bold text-slate-900">{s.name}</p>
                <p className="text-sm text-slate-500">{s.region || '—'}</p>
              </div>
              <div className="text-sm text-slate-500">
                {s._count?.students ?? 0} élèves · {s._count?.users ?? 0} comptes
              </div>
            </Link>
          )) : <p className="px-4 py-8 text-center text-slate-400">Aucune école</p>}
        </div>
      )}
    </AdminLayout>
  )
}
