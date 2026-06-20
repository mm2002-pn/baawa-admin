import { useState } from 'react'
import { apiClient } from '../../api/client'
import { useToast } from '../../hooks/useToast'
import LocationPicker from './LocationPicker'

const REGIONS = ['Dakar', 'Thiès', 'Kaolack', 'Tambacounda', 'Matam', 'Saint-Louis', 'Kolda', 'Ziguinchor', 'Diourbel', 'Louga', 'Fatick', 'Kaffrine']
const RELATIONSHIPS = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'FRERE_SOEUR', label: 'Frère/Sœur' },
  { value: 'AMI', label: 'Ami(e)' },
  { value: 'CONJOINT', label: 'Conjoint' },
  { value: 'TEMOIN', label: 'Témoin' },
  { value: 'AUTRE', label: 'Autre' },
]

interface CreateSignalementModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateSignalementModal({ isOpen, onClose, onSuccess }: CreateSignalementModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'MASCULIN',
    photoUrl: '',
    disappearanceDate: '',
    disappearanceTime: '',
    lastLatitude: '',
    lastLongitude: '',
    lastAddress: '',
    region: '',
    clothingDescription: '',
    relationship: 'PARENT',
    phoneNumber: '+221',
    policeReportNumber: '',
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Protection pour le numéro de téléphone +221
    if (name === 'phoneNumber') {
      if (!value.startsWith('+221')) {
        setFormData(prev => ({ ...prev, [name]: '+221' }))
        return
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.age || !formData.photoUrl) {
        setError('Veuillez remplir tous les champs obligatoires du profil')
        return
      }
    } else if (step === 2) {
      if (!formData.disappearanceDate || !formData.disappearanceTime || !formData.lastAddress || !formData.region || !formData.lastLatitude) {
        setError('Veuillez remplir la localisation et sélectionner un point sur la carte')
        return
      }
      if (formData.clothingDescription.length < 10) {
        setError('La description des vêtements doit faire au moins 10 caractères')
        return
      }
    }
    setError('')
    setStep(step + 1)
  }

  const prevStep = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!formData.relationship || !formData.phoneNumber) {
      setError('Veuillez remplir les informations de contact')
      return
    }

    const phoneRegex = /^\+221\s?[679]\d{8}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Format téléphone invalide (+221 suivi de 9 chiffres)')
      return
    }

    setIsLoading(true)
    try {
      const { photoUrl, ...rest } = formData
      const payload: any = {
        ...rest,
        photoUrls: photoUrl ? [photoUrl] : [],
        age: parseInt(formData.age),
        lastLatitude: parseFloat(formData.lastLatitude),
        lastLongitude: parseFloat(formData.lastLongitude),
      }

      // Ne pas envoyer le numéro de PV s'il est vide pour éviter l'erreur de format
      if (!payload.policeReportNumber || payload.policeReportNumber.trim() === '') {
        delete payload.policeReportNumber
      }

      await apiClient.post('/signalements', payload)
      toast.success('Signalement créé avec succès')
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message?.[0] || 'Erreur lors de la création')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Nouveau Signalement</h2>
            <p className="text-sm text-slate-500 font-medium">Étape {step} sur 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          <div 
            className="h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Étape 1 : Profil de la personne</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom Complet *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Nom et Prénom" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Âge *</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Âge" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Genre *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                    <option value="MASCULIN">Masculin</option>
                    <option value="FEMININ">Féminin</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">URL Photo *</label>
                  <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="https://example.com/photo.jpg" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Étape 2 : Localisation</h3>
              <div className="space-y-4">
                <LocationPicker 
                  onLocationSelect={(lat, lng, address) => {
                    setFormData(prev => {
                      const newData = { 
                        ...prev, 
                        lastLatitude: lat.toString(), 
                        lastLongitude: lng.toString() 
                      }
                      
                      if (address) {
                        newData.lastAddress = address
                        // Tentative de détection de la région dans l'adresse
                        const foundRegion = REGIONS.find(r => 
                          address.toLowerCase().includes(r.toLowerCase())
                        )
                        if (foundRegion) newData.region = foundRegion
                      }
                      
                      return newData
                    })
                  }}
                  initialLocation={formData.lastLatitude ? { lat: parseFloat(formData.lastLatitude), lng: parseFloat(formData.lastLongitude) } : undefined}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date *</label>
                    <input type="date" name="disappearanceDate" value={formData.disappearanceDate} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Heure *</label>
                    <input type="time" name="disappearanceTime" value={formData.disappearanceTime} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Région *</label>
                    <select name="region" value={formData.region} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm">
                      <option value="">Région</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <input type="text" name="lastAddress" value={formData.lastAddress} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Adresse précise" />
                <textarea name="clothingDescription" value={formData.clothingDescription} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Description des vêtements..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Étape 3 : Contact & Validation</h3>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <img src={formData.photoUrl} className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md" />
                    <div>
                      <p className="font-extrabold text-slate-900">{formData.fullName}</p>
                      <p className="text-sm text-slate-500 font-bold">{formData.age} ans • {formData.region}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lien avec la personne *</label>
                    <select name="relationship" value={formData.relationship} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                      {RELATIONSHIPS.map(rel => <option key={rel.value} value={rel.value}>{rel.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Téléphone (+221) *</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="+221770000000" />
                  </div>
                </div>
                <input type="text" name="policeReportNumber" value={formData.policeReportNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Numéro PV Police (optionnel)" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/50">
          {step > 1 && (
            <button onClick={prevStep} disabled={isLoading} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex-1">
              Précédent
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex-1">
              Suivant
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex-1">
              {isLoading ? 'Création...' : 'Confirmer & Créer'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
