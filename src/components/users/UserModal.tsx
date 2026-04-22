import { useState, useEffect } from 'react'
import { Role, User, CreateUserDto, UpdateUserDto } from '../../api/types'
import { useCreateUser, useUpdateUser, useCreateOfficerProfile } from '../../hooks/useUsers'
import { useToast } from '../../hooks/useToast'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null // Si présent, on est en mode édition
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { toast } = useToast()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser(user?.id || '')
  const createOfficer = useCreateOfficerProfile()
  
  const isEdit = !!user
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '+221',
    password: '',
    role: Role.CITOYEN,
    isActive: true,
    // Champs Policier
    badgeNumber: '',
    rank: '',
    policeUnit: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '+221',
        password: '', // On ne pré-remplit pas le mot de passe
        role: user.role,
        isActive: user.isActive,
        badgeNumber: user.officer?.badgeNumber || '',
        rank: user.officer?.rank || '',
        policeUnit: user.officer?.policeUnit || '',
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: Role.CITOYEN,
        isActive: true,
        badgeNumber: '',
        rank: '',
        policeUnit: '',
      })
    }
  }, [user, isOpen])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    // Protection pour le numéro de téléphone +221
    if (name === 'phoneNumber') {
      if (!value.startsWith('+221')) {
        setFormData(prev => ({ ...prev, [name]: '+221' }))
        return
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEdit) {
        const updateData: UpdateUserDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          isActive: formData.isActive,
        }
        await updateUser.mutateAsync(updateData)
        // Note: Si le rôle passe à POLICIER mais qu'il n'avait pas de profil, 
        // on pourrait gérer la création ici aussi, mais restons simple.
      } else {
        const createData: CreateUserDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.role,
        }
        
        const newUser = await createUser.mutateAsync(createData)
        
        // Si c'est un policier, on crée son profil dans la foulée
        if (formData.role === Role.POLICIER && newUser) {
          await createOfficer.mutateAsync({
            userId: newUser.id,
            badgeNumber: formData.badgeNumber,
            rank: formData.rank,
            policeUnit: formData.policeUnit,
          })
        }
        toast.success('Utilisateur créé avec succès')
      }
      onClose()
    } catch (error) {
      // Les erreurs sont gérées par les hooks (toasts)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEdit ? 'Modifier l\'utilisateur' : 'Nouvel Utilisateur'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isEdit ? 'Mettez à jour les informations du compte' : 'Créez un nouveau compte sur la plateforme'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prénom *</label>
              <input 
                type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom *</label>
              <input 
                type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={isEdit ? 'opacity-60 cursor-not-allowed' : ''}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email *</label>
              <input 
                type="email" name="email" required disabled={isEdit} value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Téléphone *</label>
              <input 
                type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="+221..."
              />
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mot de passe *</label>
              <input 
                type="password" name="password" required={!isEdit} value={formData.password} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Minimum 6 caractères"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rôle *</label>
              <select 
                name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value={Role.CITOYEN}>Citoyen</option>
                <option value={Role.POLICIER}>Policier</option>
                <option value={Role.ADMIN_BAAWA}>Administrateur</option>
              </select>
            </div>
            {isEdit && (
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    Compte Actif
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Section Policier conditionnelle */}
          {formData.role === Role.POLICIER && (
            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">policy</span>
                Profil Policier
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Numéro de Matricule *</label>
                  <input 
                    type="text" name="badgeNumber" required value={formData.badgeNumber} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none" placeholder="Ex: POL-12345"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grade *</label>
                  <input 
                    type="text" name="rank" required value={formData.rank} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none" placeholder="Ex: Sergent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unité *</label>
                  <input 
                    type="text" name="policeUnit" required value={formData.policeUnit} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none" placeholder="Ex: Gendarmerie Dakar"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/50">
          <button 
            type="button" onClick={onClose}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex-1"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            disabled={createUser.isPending || updateUser.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex-1 disabled:opacity-50"
          >
            {createUser.isPending || updateUser.isPending ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
          </button>
        </div>
      </div>
    </div>
  )
}
