import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSchools, useCreateSchool } from '../../hooks/useSchools'

const AVATAR_PALETTE = [
  { bg: '#eaf1ff', fg: '#1d4ed8' },
  { bg: '#e7f8f0', fg: '#087443' },
  { bg: '#f3edff', fg: '#6d28d9' },
  { bg: '#fff1e6', fg: '#c2410c' },
]

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const inputBase =
  'border border-[#e2e7ee] rounded-[11px] text-sm text-[#101828] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/[.12]'

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

  const schools = data?.data ?? []

  return (
    <AdminLayout title="Écoles">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-[420px]">
            <span className="material-symbols-outlined absolute left-[15px] top-1/2 -translate-y-1/2 text-[19px] text-[#98a2b3]">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une école..."
              className={`w-full pl-11 pr-4 py-[13px] bg-white text-[14.5px] shadow-[0_1px_2px_rgba(16,24,40,.03)] ${inputBase}`}
            />
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-[13px] rounded-[13px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-bold text-[14.5px] shadow-[0_10px_22px_-10px_rgba(37,99,235,.7)] shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nouvelle école
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={submit}
            className="bg-white border border-[#e8ecf2] rounded-[18px] p-[22px] mb-6 shadow-[0_6px_20px_-12px_rgba(16,24,40,.15)]"
          >
            <h3 className="text-[16px] font-extrabold text-[#101828] mb-4">Nouvelle école</h3>
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom *" className={`col-span-2 px-[14px] py-3 ${inputBase}`} />
              <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Région" className={`px-[14px] py-3 ${inputBase}`} />
              <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Téléphone" className={`px-[14px] py-3 ${inputBase}`} />
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse" className={`col-span-2 px-[14px] py-3 ${inputBase}`} />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={`col-span-2 px-[14px] py-3 ${inputBase}`} />
              <div className="col-span-2 flex gap-3 mt-1">
                <button type="submit" disabled={createSchool.isPending} className="px-5 py-3 rounded-[13px] bg-[#2563eb] text-white font-bold text-sm disabled:opacity-50">
                  Créer l'école
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-[13px] border border-[#e2e7ee] text-[#475467] font-bold text-sm">
                  Annuler
                </button>
              </div>
            </div>
          </form>
        )}

        {isLoading ? (
          <p className="text-[#98a2b3]">Chargement…</p>
        ) : (
          <>
            <p className="text-[13px] font-bold text-[#98a2b3] mb-3">{schools.length} écoles</p>
            {schools.length ? (
              <div className="flex flex-col gap-3">
                {schools.map((s, i) => {
                  const palette = AVATAR_PALETTE[i % AVATAR_PALETTE.length]
                  return (
                    <Link
                      key={s.id}
                      to={`/schools/${s.id}`}
                      className="flex items-center gap-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-3 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(16,24,40,.35)] hover:border-[#d3dbe6]"
                    >
                      <div
                        className="flex items-center justify-center w-[50px] h-[50px] rounded-[14px] font-extrabold text-base shrink-0"
                        style={{ background: palette.bg, color: palette.fg }}
                      >
                        {initialsOf(s.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-base text-[#101828] truncate">{s.name}</p>
                        <p className="flex items-center gap-1 text-[13px] font-semibold text-[#98a2b3] mt-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {s.region || '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 px-3 py-[7px] rounded-full bg-[#f2f6ff] text-[#2563eb] font-bold text-[12.5px]">
                          <span className="material-symbols-outlined text-[14px]">school</span>
                          {s._count?.students ?? 0} élèves
                        </span>
                        <span className="flex items-center gap-1 px-3 py-[7px] rounded-full bg-[#f5f6f8] text-[#667085] font-bold text-[12.5px]">
                          <span className="material-symbols-outlined text-[14px]">groups</span>
                          {s._count?.users ?? 0} comptes
                        </span>
                        <span className="material-symbols-outlined text-[20px] text-[#c4cdda]">chevron_right</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-[#98a2b3] font-semibold py-[60px] px-5">
                Aucune école ne correspond à votre recherche.
              </p>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
