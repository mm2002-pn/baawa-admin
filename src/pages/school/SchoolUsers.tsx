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

  const createUser = useMutation({
    mutationFn: () => mySchoolService.createUser(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-school', 'users'] })
      toast.success('Utilisateur créé — mot de passe envoyé par email')
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
