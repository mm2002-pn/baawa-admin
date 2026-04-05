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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const response = await authService.login(data)

      const authData = response.data
      setAuth(authData.user, authData.accessToken, authData.refreshToken)
      toast.success('Connexion réussie!')

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 100)
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Erreur lors de la connexion'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="BAAWA Background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0_JGuKWQVMJZMfr-s_edhj3XnBE1tC2npxgBSSTbr27Eg0R-ASWWN45PN5M89ScIK5-IfKqf3rdRDxzQ6kmed5XB2T0TakL5dRt5iOwmF0luoZJ_VKeFwbiwVFqRz5XC2PpXc8j47ZucjBmTUVUhvvZHai6HyqYDWjLtc4OyIle6zlgemVVZnIY6WGf7fjxiGYVUusVXFfAJ3ZvD8uueigziC249K8jAP1DPavXP7ZFpcy5WHRcZOmLOhepZfc3DTKTfeZ-pkVsRx"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/92 to-background/85 backdrop-blur-sm"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md">
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl p-8 md:p-12 rounded-lg shadow-2xl flex flex-col items-center">
          {/* Logo Section */}
          <div className="mb-10 text-center">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-white font-headline font-bold text-2xl mx-auto mb-6">
              BA
            </div>
            <h1 className="font-headline font-bold text-primary text-2xl tracking-tight">
              Content de vous revoir
            </h1>
            <p className="text-on-surface-variant text-sm mt-2">
              Accédez à votre tableau de bord BAAWA
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label ml-1">
                Email ou Identifiant
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-fixed-dim transition-all duration-200"
                  placeholder="nom@baawa.sn"
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
                  Mot de passe
                </label>
                <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-fixed-dim transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-sm text-on-surface-variant">
                Se souvenir de moi
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-headline font-bold py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Connexion en cours...' : 'Se connecter'}</span>
              {!isLoading && (
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-on-surface-variant">
              Nouveau sur la plateforme ?{' '}
              <a className="text-primary font-bold hover:underline decoration-2 underline-offset-4" href="#">
                Demander un accès
              </a>
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant font-label">
              Système Opérationnel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-tertiary">public</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant font-label">
              Impact Social Sénégal
            </span>
          </div>
        </div>
      </main>

      {/* Visual Accent */}
      <div className="absolute bottom-10 right-10 z-0 opacity-10 hidden lg:block">
        <span className="material-symbols-outlined text-[300px] text-primary select-none">
          nature_people
        </span>
      </div>
    </div>
  )
}
