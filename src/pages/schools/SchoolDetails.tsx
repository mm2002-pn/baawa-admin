import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSchool, useCreateSchoolAdmin, useSchoolStudents } from '../../hooks/useSchools'

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const inputBase =
  'border border-[#e2e7ee] rounded-xl px-[14px] py-[13px] text-sm text-[#101828] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/[.12]'

const cardBase = 'bg-white border border-[#e8ecf2] rounded-[20px]'

export default function SchoolDetailsPage() {
  const { id = '' } = useParams()
  const { data: school, isLoading } = useSchool(id)
  const { data: students } = useSchoolStudents(id)
  const createAdmin = useCreateSchoolAdmin(id)
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', phoneNumber: '' })
  const [created, setCreated] = useState<{ email: string; tempPassword: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createAdmin.mutate(form, {
      onSuccess: (data: any) => {
        setForm({ email: '', firstName: '', lastName: '', phoneNumber: '' })
        setCopied(false)
        if (data?.tempPassword) setCreated({ email: data.email, tempPassword: data.tempPassword })
      },
    })
  }

  const copyPassword = () => {
    if (!created) return
    navigator.clipboard?.writeText(created.tempPassword)
    setCopied(true)
  }

  if (isLoading) return <AdminLayout title="École" backTo="/schools"><p className="text-[#98a2b3]">Chargement…</p></AdminLayout>

  const chips = [
    { icon: 'location_on', value: school?.region },
    { icon: 'phone', value: school?.phoneNumber },
    { icon: 'mail', value: school?.email },
    { icon: 'home', value: school?.address },
  ]

  return (
    <AdminLayout title={school?.name || 'École'} backTo="/schools">
      <div className="mx-auto max-w-[1080px] flex flex-col gap-[22px]">
        <div className={`${cardBase} relative overflow-hidden p-7 shadow-[0_8px_26px_-18px_rgba(16,24,40,.28)]`}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(37,99,235,.07), transparent 55%)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center w-[66px] h-[66px] rounded-[18px] bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white font-extrabold text-[22px] shadow-[0_12px_24px_-10px_rgba(37,99,235,.6)]">
              {school?.name ? initialsOf(school.name) : '—'}
            </div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#101828] mt-4">{school?.name}</h2>
            <div className="flex flex-wrap gap-[10px] mt-4">
              {chips.map((chip) => (
                <span
                  key={chip.icon}
                  className="flex items-center gap-2 px-[14px] py-2 rounded-[11px] bg-[#f7f9fc] border border-[#eef1f5] text-[#475467] font-semibold text-[13.5px]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#2563eb]">{chip.icon}</span>
                  {chip.value || '—'}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`${cardBase} p-7 shadow-[0_8px_26px_-18px_rgba(16,24,40,.28)]`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[11px] bg-[#eef4ff] text-[#2563eb]">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-[#101828]">Créer le compte administrateur de l'école</h3>
              <p className="text-[13px] font-semibold text-[#98a2b3]">Un mot de passe temporaire sera généré automatiquement.</p>
            </div>
          </div>

          <form onSubmit={submit} className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-[7px]">
              <span className="text-[12.5px] font-bold text-[#475467]">Prénom *</span>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Ex. Fatou" className={inputBase} />
            </label>
            <label className="flex flex-col gap-[7px]">
              <span className="text-[12.5px] font-bold text-[#475467]">Nom *</span>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Ex. DIALLO" className={inputBase} />
            </label>
            <label className="flex flex-col gap-[7px]">
              <span className="text-[12.5px] font-bold text-[#475467]">Email *</span>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@ecole.sn" className={inputBase} />
            </label>
            <label className="flex flex-col gap-[7px]">
              <span className="text-[12.5px] font-bold text-[#475467]">Téléphone *</span>
              <input required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="77 000 00 00" className={inputBase} />
            </label>
            <button
              type="submit"
              disabled={createAdmin.isPending}
              className="col-span-2 py-[14px] rounded-[13px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-bold text-[15px] shadow-[0_10px_22px_-10px_rgba(37,99,235,.7)] disabled:opacity-50"
            >
              Créer le compte
            </button>
          </form>

          {created && (
            <div className="mt-5 rounded-2xl border border-[#fed7aa] bg-gradient-to-b from-[#fffbf5] to-[#fff7ed] p-5">
              <p className="flex items-center gap-2 font-extrabold text-[#9a3412]">
                <span className="material-symbols-outlined text-[#c2410c] text-[18px]">warning</span>
                Compte créé — notez ces identifiants
              </p>
              <p className="text-[12.5px] font-semibold text-[#b45309] mt-2">
                Ce mot de passe temporaire ne sera plus affiché. Communiquez-le à l'utilisateur ; il devra le changer à sa première connexion.
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center justify-between bg-white border border-[#fed7aa] rounded-[10px] px-3 py-2 text-sm">
                  <span className="text-[#b45309]">Identifiant</span>
                  <code className="font-mono text-[#101828]">{created.email}</code>
                </div>
                <div className="flex items-center justify-between bg-white border border-[#fed7aa] rounded-[10px] px-3 py-2 text-sm">
                  <span className="text-[#b45309]">Mot de passe temporaire</span>
                  <code className="font-mono font-bold text-[#101828]">{created.tempPassword}</code>
                </div>
              </div>
              <button
                onClick={copyPassword}
                className="mt-3 px-4 py-2 rounded-lg bg-[#ea580c] text-white text-xs font-bold"
              >
                {copied ? 'Copié ✓' : 'Copier le mot de passe'}
              </button>
            </div>
          )}
        </div>

        <div className={`${cardBase} p-7 shadow-[0_8px_26px_-18px_rgba(16,24,40,.28)]`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-extrabold text-[#101828]">Élèves</h3>
            <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#2563eb] font-extrabold text-sm">
              {students?.length ?? 0}
            </span>
          </div>
          {students?.length ? (
            <div className="flex flex-col gap-2">
              {students.map((st) => (
                <div key={st.id} className="flex items-center gap-3 bg-[#f9fafc] border border-[#eef1f5] rounded-[13px] px-[14px] py-3">
                  <div className="flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-[#e6edfb] text-[#1e40af] font-extrabold text-sm shrink-0">
                    {(st.firstName[0] ?? '') + (st.lastName[0] ?? '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14.5px] text-[#101828] truncate">{st.firstName} {st.lastName}</p>
                    <p className="text-[12.5px] text-[#98a2b3]">Élève</p>
                  </div>
                  <span className="px-[13px] py-[6px] rounded-full bg-[#f1f2f4] text-[#475467] font-bold text-sm shrink-0">
                    {st.className || '—'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#98a2b3] font-semibold py-8">Aucun élève inscrit pour le moment.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
