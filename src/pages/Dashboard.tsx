import { AdminLayout } from '../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card/Card'

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Bienvenue sur le backoffice BAAWA Admin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Utilisateurs', value: '1,234' },
            { label: 'Signalements Actifs', value: '56' },
            { label: 'Retrouvés (30j)', value: '12' },
            { label: 'Nouveaux (aujourd\'hui)', value: '3' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Derniers Signalements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-sm">À venir...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Derniers Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-sm">À venir...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
