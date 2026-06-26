import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { mySchoolService } from '../../api/services/mySchoolService'
import { useToast } from '../../hooks/useToast'

const EMPTY = { email: '', firstName: '', lastName: '', phoneNumber: '' }

export default function SchoolUsersPage() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const { data: users, isLoading } = useQuery({ queryKey: ['my-school', 'users'], queryFn: mySchoolService.getUsers })
  const [form, setForm] = useState(EMPTY)
  const [created, setCreated] = useState<{ email: string; tempPassword: string } | null>(null)

  const createUser = useMutation({
    mutationFn: () => mySchoolService.createUser(form),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['my-school', 'users'] })
      toast.success('Utilisateur créé — notez le mot de passe temporaire affiché')
      if (data?.tempPassword) setCreated({ email: data.email, tempPassword: data.tempPassword })
      setForm(EMPTY)
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur lors de la création'),
  })

  return (
    <AdminLayout title="Utilisateurs de mon école">
      <form onSubmit={(e) => { e.preventDefault(); createUser.mutate() }} className="bg-white border border-slate-100 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3">
        <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Prénom *" className="px-3 py-2 border border-slate-200 rounded-lg" />
        <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nom *" className="px-3 py-2 border border-slate-200 rounded-lg" />
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="px-3 py-2 border border-slate-200 rounded-lg" />
        <input required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Téléphone *" className="px-3 py-2 border border-slate-200 rounded-lg" />
        <button type="submit" disabled={createUser.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold col-span-2 disabled:opacity-50">Créer l'utilisateur</button>
      </form>

      {created && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">Utilisateur créé — notez ces identifiants</p>
          <p className="text-xs text-amber-700 mt-1">
            Ce mot de passe temporaire ne sera plus affiché. Communiquez-le à l'utilisateur ; il devra le changer à sa première connexion.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-1 text-sm">
            <div><span className="text-amber-700">Identifiant :</span> <code className="font-mono">{created.email}</code></div>
            <div><span className="text-amber-700">Mot de passe temporaire :</span> <code className="font-mono font-bold">{created.tempPassword}</code></div>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText(created.tempPassword)}
            className="mt-3 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
          >
            Copier le mot de passe
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl divide-y">
          {users?.length ? users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-bold text-slate-900">{u.firstName} {u.lastName}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                {u.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          )) : <p className="px-4 py-8 text-center text-slate-400">Aucun utilisateur</p>}
        </div>
      )}
    </AdminLayout>
  )
}
