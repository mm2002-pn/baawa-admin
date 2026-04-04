import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'

export default function OfficersListPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Policiers</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Gestion des officiers et leur validation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des policiers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 text-sm">À venir...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
