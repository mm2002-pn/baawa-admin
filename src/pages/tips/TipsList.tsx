import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'

export default function TipsListPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pistes & Tips</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Gestion et validation des pistes signalées</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des pistes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 text-sm">À venir...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
