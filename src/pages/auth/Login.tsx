import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../../hooks/useToast'
import { authService } from '../../api/services/authService'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const response = await authService.login(data)
      const authData = response.data
      setAuth(authData.user, authData.accessToken, authData.refreshToken)
      toast.success('Connexion réussie')
      setTimeout(() => navigate('/', { replace: true }), 100)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email ou mot de passe incorrect'
      toast.error(typeof message === 'string' ? message : 'Erreur lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel — Brand & Mission (hidden on mobile) */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Blurred orbs */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[28px]">shield</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">BAAWA</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100">
                Centre de Commandement
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="space-y-8 max-w-lg">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">
                Plateforme nationale
              </p>
              <h1 className="font-extrabold text-4xl xl:text-5xl leading-tight tracking-tight">
                Retrouver chaque<br />
                personne disparue<br />
                au Sénégal.
              </h1>
              <p className="text-blue-100 text-base mt-6 leading-relaxed">
                Coordination en temps réel entre citoyens, forces de l'ordre et
                administration pour accélérer chaque signalement.
              </p>
            </div>

            {/* Stats / Trust signals */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-200 text-lg">map</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">14 Régions</span>
                </div>
                <p className="text-xs text-blue-100/80">Couverture nationale</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-200 text-lg">bolt</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Temps réel</span>
                </div>
                <p className="text-xs text-blue-100/80">Alertes instantanées</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-200 text-lg">verified_user</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Sécurisé</span>
                </div>
                <p className="text-xs text-blue-100/80">Données chiffrées</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
            Système opérationnel
          </div>
        </div>
      </aside>

      {/* Right Panel — Form */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo (visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="material-symbols-outlined text-white text-[28px]">shield</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">BAAWA</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Centre de Commandement
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
              Espace personnel
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Connectez-vous à votre tableau de bord pour gérer les signalements
              et coordonner les opérations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`block w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                  placeholder="admin@baawa.sn"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-2 ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline decoration-2 underline-offset-2 transition-colors"
                  onClick={() => toast.info('Contactez votre administrateur')}
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={`block w-full pl-12 pr-12 py-3.5 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-2 ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none mt-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              Accès réservé aux administrateurs et forces de l'ordre.
              <br />
              Pour toute demande,{' '}
              <a
                href="mailto:contact@baawa.sn"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline decoration-2 underline-offset-2"
              >
                contactez-nous
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
