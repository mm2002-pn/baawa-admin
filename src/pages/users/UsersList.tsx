import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card/Card'
import { Button } from '../../components/common/Button/Button'
import { Link } from 'react-router-dom'

export default function UsersListPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Utilisateurs</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Gestion des utilisateurs de la plateforme</p>
          </div>
          <Link to="/users/create">
            <Button>Créer un utilisateur</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 text-sm">À venir...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
