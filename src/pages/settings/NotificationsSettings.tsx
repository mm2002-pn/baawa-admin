import { AdminLayout } from '../../components/layout/AdminLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import { useToast } from '../../hooks/useToast'

export default function NotificationsSettingsPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await apiClient.get('/notifications/settings')
      return res.data
    }
  })

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const res = await apiClient.patch('/notifications/settings', newSettings)
      return res.data
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['system-settings'], updatedData)
      toast.success('Paramètres enregistrés avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde des paramètres')
    }
  })

  const handleToggle = (key: string, value: boolean) => {
    updateSettingsMutation.mutate({ [key]: value })
  }

  if (isLoading) {
    return (
      <AdminLayout title="Paramètres des Notifications">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Paramètres des Notifications">
      <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500 mt-1">Configurez les alertes et les préférences de notifications du système BAAWA.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Notifications Push</h3>
              <p className="text-sm text-slate-500">Envoyer des notifications push sur les appareils mobiles lors d'alertes.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={data?.pushEnabled ?? false} onChange={(e) => handleToggle('pushEnabled', e.target.checked)} disabled={updateSettingsMutation.isPending} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Notifications SMS</h3>
              <p className="text-sm text-slate-500">Envoyer des SMS d'urgence aux familles et officiers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={data?.smsEnabled ?? false} onChange={(e) => handleToggle('smsEnabled', e.target.checked)} disabled={updateSettingsMutation.isPending} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Alertes par email</h3>
              <p className="text-sm text-slate-500">Recevoir un récapitulatif quotidien des nouveaux signalements.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={data?.emailEnabled ?? false} onChange={(e) => handleToggle('emailEnabled', e.target.checked)} disabled={updateSettingsMutation.isPending} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
