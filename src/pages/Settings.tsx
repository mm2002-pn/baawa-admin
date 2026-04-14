import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../components/layout/AdminLayout'
import { useUsers } from '../hooks/useUsers'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [page] = useState(1)
  const [limit] = useState(10)
  const { data: usersData } = useUsers(page, limit)

  const handleSettingAction = (settingId: number) => {
    switch (settingId) {
      case 1:
        navigate('/users')
        break
      case 2:
        alert('Notifications - Fonctionnalité en cours de développement')
        break
      case 3:
        alert('Sécurité - Fonctionnalité en cours de développement')
        break
      case 4:
        alert('Rapports - Fonctionnalité en cours de développement')
        break
      case 5:
        alert('Zones Géographiques - Fonctionnalité en cours de développement')
        break
      case 6:
        alert('Équipes - Fonctionnalité en cours de développement')
        break
      default:
        break
    }
  }

  const settings = [
    {
      id: 1,
      title: 'Gestion des Utilisateurs',
      description: 'Ajouter, modifier ou supprimer des utilisateurs du système',
      icon: 'people',
      count: usersData?.total || 0,
      action: 'Gérer',
    },
    {
      id: 2,
      title: 'Notifications',
      description: 'Configurer les alertes et notifications du système',
      icon: 'notifications_active',
      action: 'Configurer',
    },
    {
      id: 3,
      title: 'Sécurité',
      description: 'Paramètres de sécurité, mots de passe et authentification',
      icon: 'security',
      action: 'Configurer',
    },
    {
      id: 4,
      title: 'Rapports',
      description: 'Configurer et générer des rapports du système',
      icon: 'description',
      action: 'Configurer',
    },
    {
      id: 5,
      title: 'Zones Géographiques',
      description: 'Gérer les zones géographiques et régions du système',
      icon: 'map',
      action: 'Gérer',
    },
    {
      id: 6,
      title: 'Équipes',
      description: 'Créer et gérer les équipes de recherche',
      icon: 'group',
      action: 'Gérer',
    },
  ]

  return (
    <AdminLayout title="Paramètres">
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <p className="text-slate-500 text-sm">Gérez les paramètres et configurations du système BAAWA</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all group cursor-pointer border border-slate-100"
            >
              {/* Icon */}
              <div className="h-14 w-14 rounded-lg bg-blue-600/10 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                <span className="material-symbols-outlined text-2xl text-blue-600">
                  {setting.icon}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {setting.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {setting.description}
              </p>

              {/* Count Badge */}
              {setting.count !== undefined && setting.count > 0 && (
                <div className="mb-4">
                  <span className="inline-block bg-blue-600/10 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    {setting.count} éléments
                  </span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleSettingAction(setting.id)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors active:scale-95"
              >
                {setting.action}
              </button>
            </div>
          ))}
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Informations Système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Version', value: 'v1.0.0' },
              { label: 'Utilisateurs Actifs', value: usersData?.total || '0' },
              { label: 'Dernière Mise à Jour', value: 'Il y a 2h' },
              { label: 'Statut Système', value: 'Opérationnel' },
            ].map((info, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {info.label}
                </p>
                <p className="text-lg font-bold text-slate-900 mt-2">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
