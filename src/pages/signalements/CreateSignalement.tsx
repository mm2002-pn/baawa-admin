import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { apiClient } from '../../api/client'
import { useToast } from '../../hooks/useToast'
import LocationPicker from '../../components/signalements/LocationPicker'

const REGIONS = ['Dakar', 'Thiès', 'Kaolack', 'Tambacounda', 'Matam', 'Saint-Louis', 'Kolda', 'Ziguinchor', 'Diourbel', 'Louga', 'Fatick', 'Kaffrine']
const RELATIONSHIPS = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'FRERE_SOEUR', label: 'Frère/Sœur' },
  { value: 'AMI', label: 'Ami(e)' },
  { value: 'CONJOINT', label: 'Conjoint' },
  { value: 'TEMOIN', label: 'Témoin' },
  { value: 'AUTRE', label: 'Autre' },
]

export default function CreateSignalementPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'MASCULIN',
    images: [] as File[],
    disappearanceDate: '',
    disappearanceTime: '',
    lastLatitude: '',
    lastLongitude: '',
    lastAddress: '',
    region: '',
    clothingDescription: '',
    relationship: 'PARENT',
    phoneNumber: '',
    policeReportNumber: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: Array.from(e.target.files!) }))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!formData.fullName || !formData.age || !formData.gender || formData.images.length === 0) {
        setError('Veuillez remplir tous les champs obligatoires du profil et ajouter au moins une photo')
        setIsLoading(false)
        return
      }

      if (!formData.disappearanceDate || !formData.disappearanceTime || !formData.lastAddress || !formData.region) {
        setError('Veuillez remplir tous les champs obligatoires de localisation')
        setIsLoading(false)
        return
      }

      if (formData.clothingDescription.length < 10) {
        setError('La description des vêtements doit faire au moins 10 caractères')
        setIsLoading(false)
        return
      }

      if (!formData.relationship || !formData.phoneNumber) {
        setError('Veuillez remplir tous les champs obligatoires de contact')
        setIsLoading(false)
        return
      }

      const phoneRegex = /^\+221\s?[679]\d{8}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError('Format téléphone invalide. Format attendu: +221771234567 (9 chiffres après +221)')
        setIsLoading(false)
        return
      }

      const data = new FormData()
      
      // Ajouter tous les champs textuels
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'policeReportNumber') {
          data.append(key, value.toString())
        }
      })

      // Ajouter le numéro de PV s'il existe
      if (formData.policeReportNumber && formData.policeReportNumber.trim() !== '') {
        data.append('policeReportNumber', formData.policeReportNumber)
      }

      // Ajouter les images
      formData.images.forEach(file => {
        data.append('images', file)
      })

      await apiClient.post('/signalements', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Signalement créé avec succès')
      navigate('/signalements')
    } catch (err: any) {
      const errMsg = err.response?.data?.message?.[0] || 'Erreur lors de la création du signalement'
      setError(typeof errMsg === 'string' ? errMsg : 'Erreur lors de la création du signalement')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout title="Nouveau Signalement">
      <div className="space-y-6 max-w-4xl">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-8 space-y-8">
          {/* Section 1: Profil */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Étape 1: Profil de la Personne Disparue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom Complet *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Nom et Prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Âge *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  max="120"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Âge"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Genre *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="MASCULIN">Masculin</option>
                  <option value="FEMININ">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Photos (une ou plusieurs) *</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-slate-500 mt-2">Sélectionnez une ou plusieurs photos</p>
                
                {formData.images.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {formData.images.map((file, i) => (
                      <img 
                        key={i} 
                        src={URL.createObjectURL(file)} 
                        className="h-16 w-16 rounded-lg object-cover border border-slate-100 shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Localisation */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Étape 2: Localisation et Circonstances</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date de Disparition *</label>
                  <input
                    type="date"
                    name="disappearanceDate"
                    value={formData.disappearanceDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Heure de Disparition *</label>
                  <input
                    type="time"
                    name="disappearanceTime"
                    value={formData.disappearanceTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adresse du Dernier Lieu Connu *</label>
                <input
                  type="text"
                  name="lastAddress"
                  value={formData.lastAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Avenue/Rue, Quartier, Ville"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Région *</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une région</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div></div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sélectionner le lieu sur la carte *</label>
                  <LocationPicker 
                    onLocationSelect={(lat, lng) => {
                      setFormData(prev => ({
                        ...prev,
                        lastLatitude: lat.toString(),
                        lastLongitude: lng.toString()
                      }))
                    }}
                    initialLocation={
                      formData.lastLatitude && formData.lastLongitude 
                      ? { lat: parseFloat(formData.lastLatitude), lng: parseFloat(formData.lastLongitude) }
                      : undefined
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    name="lastLatitude"
                    value={formData.lastLatitude}
                    readOnly
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                    placeholder="Auto-rempli par la carte"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    name="lastLongitude"
                    value={formData.lastLongitude}
                    readOnly
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                    placeholder="Auto-rempli par la carte"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description des Vêtements et Signes Distinctifs * (min 10 caractères)</label>
                <textarea
                  name="clothingDescription"
                  value={formData.clothingDescription}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Boubou bleu, bonnet noir, cicatrices sur le front..."
                />
                <p className="text-xs text-slate-500 mt-2">{formData.clothingDescription.length}/10 caractères minimum</p>
              </div>
            </div>
          </div>

          {/* Section 3: Contact */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Étape 3: Informations de Contact</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lien avec la Personne *</label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel.value} value={rel.value}>
                        {rel.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Numéro de Téléphone (+221) *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+221771234567"
                  />
                  <p className="text-xs text-slate-500 mt-2">Format: +221771234567 (9 chiffres après +221, commence par 6, 7 ou 9)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Numéro de Plainte Police (optionnel)</label>
                <input
                  type="text"
                  name="policeReportNumber"
                  value={formData.policeReportNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="PV-YYYY-XXXX"
                />
                <p className="text-xs text-slate-500 mt-2">Format: PV-YYYY-XXXX (ex: PV-2024-1234)</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate('/signalements')}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Création en cours...' : 'Créer le Signalement'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
