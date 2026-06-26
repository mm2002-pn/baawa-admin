import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../api/services/authService'
import { useAuthStore } from '../../store/authStore'
import { Role } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, setUser } = useAuthStore()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Le mot de passe doit faire au moins 8 caractères')
      return
    }
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setSubmitting(true)
    try {
      await authService.changePassword(password)
      if (user) setUser({ ...user, mustChangePassword: false })
      toast.success('Mot de passe mis à jour')
      const landing = user?.role === Role.ADMIN_SCHOOL ? '/students' : '/'
      navigate(landing, { replace: true })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-lg p-8">
        <h1 className="text-xl font-extrabold text-slate-900">Définir un nouveau mot de passe</h1>
        <p className="text-sm text-slate-500 mt-2">
          Pour votre sécurité, vous devez remplacer le mot de passe temporaire avant de continuer.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Retapez le mot de passe"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {submitting ? 'Enregistrement…' : 'Enregistrer et continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}
