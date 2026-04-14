import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '../api/types'
import { CreateUserFormData, createUserSchema } from '../schemas/userSchema'
import { Button } from './common/Button/Button'

interface UserFormProps {
  initialData?: any
  onSubmit: (data: CreateUserFormData) => void
  isLoading?: boolean
  isEditing?: boolean
}

export function UserForm({ initialData, onSubmit, isLoading = false, isEditing = false }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      ...initialData,
      // Set default phone prefix for new users
      phoneNumber: initialData?.phoneNumber || '+221 ',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const selectedRole = watch('role')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          placeholder="utilisateur@example.com"
          disabled={isEditing}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Password (only for creation) */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="Minimum 8 caractères"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimum 8 caractères</p>
        </div>
      )}

      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('firstName')}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="Jean"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="Diallo"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          {...register('phoneNumber')}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          placeholder="+221 77 123 4567"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format: +221 [679]XXXXXXXX (9 chiffres après l'indicatif)</p>
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Rôle <span className="text-red-500">*</span>
        </label>
        <select
          {...register('role')}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        >
          <option value="">Sélectionner un rôle</option>
          <option value={Role.CITOYEN}>Citoyen</option>
          <option value={Role.POLICIER}>Policier</option>
          <option value={Role.ADMIN_BAAWA}>Admin BAAWA</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
      </div>

      {/* Officer Fields (shown if role is POLICIER) */}
      {selectedRole === Role.POLICIER && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Informations du Policier</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Numéro de Badge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('badgeNumber')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="BP-2024-001"
              />
              {errors.badgeNumber && <p className="text-red-500 text-sm mt-1">{errors.badgeNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('rank')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="Commandant"
              />
              {errors.rank && <p className="text-red-500 text-sm mt-1">{errors.rank.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Unité de Police <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('policeUnit')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="Commissariat Central de Dakar"
              />
              {errors.policeUnit && <p className="text-red-500 text-sm mt-1">{errors.policeUnit.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#0066FF',
            color: 'white',
            fontWeight: '500',
            borderRadius: '8px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            fontSize: '16px',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = '#0052CC'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0066FF'
          }}
        >
          {isLoading ? 'Sauvegarde...' : isEditing ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
