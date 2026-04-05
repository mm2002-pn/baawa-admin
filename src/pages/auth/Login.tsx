import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/common/Button/Button'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../../hooks/useToast'
import { authService } from '../../api/services/authService'
import type { BackendAuthResponse } from '../../api/types'

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
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: false,
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const response = await authService.login(data)

      console.log('✅ Login response:', response)

      // Backend returns: { success: true, statusCode: 200, message: '...', data: {...} }
      const authData = response.data
      console.log('📊 Auth data:', authData)

      // Set auth in store
      setAuth(authData.user, authData.accessToken, authData.refreshToken)

      // Check store immediately after setAuth
      const state = useAuthStore.getState()
      console.log('📦 Store after setAuth:', {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        hasTokens: !!state.accessToken && !!state.refreshToken,
      })

      toast.success('Connexion réussie!')

      // Navigate to dashboard - use setTimeout to ensure store is updated
      setTimeout(() => {
        const currentState = useAuthStore.getState()
        console.log('🔍 Store before navigate:', currentState.isAuthenticated)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
            BA
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            BAAWA Admin
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
            Connectez-vous à votre compte administrateur
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="admin@baawa.sn"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '8px 16px',
                backgroundColor: '#1E69FF',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#0052CC'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E69FF'
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-8">
            Seuls les administrateurs BAAWA peuvent accéder à cette plateforme
          </p>
        </div>
      </div>
    </div>
  )
}
