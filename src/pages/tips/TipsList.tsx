import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useSignalements } from '../../hooks/useSignalements'
import { useTipsBySignalement, useVerifyTip } from '../../hooks/useTips'
import { useToast } from '../../hooks/useToast'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

function TipsForSignalement({ signalementId }: { signalementId: string }) {
  const { data: tips, isLoading } = useTipsBySignalement(signalementId)
  const verifyTip = useVerifyTip()
  const { toast } = useToast()

  const handleVerify = async (tipId: string) => {
    try {
      await verifyTip.mutateAsync(tipId)
      toast.success('Témoignage vérifié')
    } catch {
      toast.error('Erreur lors de la vérification')
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-400">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  if (!tips || tips.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">
        Aucun témoignage pour ce signalement
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {tips.map((tip) => (
        <div key={tip.id} className="p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-start gap-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              tip.isVerified ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <span className={`material-symbols-outlined ${
                tip.isVerified ? 'text-green-600' : 'text-orange-600'
              }`}>
                {tip.isVerified ? 'verified' : 'pending'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  tip.isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {tip.isVerified ? 'Vérifié' : 'En attente'}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(tip.createdAt), { addSuffix: true, locale: fr })}
                </span>
              </div>
              <p className="text-sm text-slate-700 mb-2">{tip.description}</p>
              {tip.address && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {tip.address}
                </p>
              )}
              {tip.reporter && (
                <p className="text-xs text-slate-400 mt-1">
                  Par {tip.reporter.firstName} {tip.reporter.lastName}
                </p>
              )}
            </div>
            {!tip.isVerified && (
              <button
                onClick={() => handleVerify(tip.id)}
                disabled={verifyTip.isPending}
                className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Vérifier
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TipsListPage() {
  const [expandedSignalement, setExpandedSignalement] = useState<string | null>(null)
  const { data: signalementsData, isLoading } = useSignalements(1, 20)

  const signalements = signalementsData?.data ?? []

  return (
    <AdminLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Témoignages</h1>
            <p className="text-slate-500 mt-1">
              Indices et témoignages reçus pour les signalements
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600">info</span>
          <div>
            <p className="text-sm text-blue-800 font-semibold">Comment ça marche</p>
            <p className="text-sm text-blue-600 mt-1">
              Les témoignages sont organisés par signalement. Cliquez sur un signalement pour voir
              les témoignages reçus et les vérifier.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Chargement des signalements...</p>
            </div>
          ) : signalements.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
                record_voice_over
              </span>
              <p className="text-slate-700 font-semibold">Aucun signalement</p>
              <p className="text-slate-500 text-sm mt-1">
                Les témoignages apparaîtront ici une fois des signalements créés
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {signalements.map((signalement: any) => (
                <div key={signalement.id}>
                  {/* Signalement Header */}
                  <button
                    onClick={() => setExpandedSignalement(
                      expandedSignalement === signalement.id ? null : signalement.id
                    )}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      signalement.status === 'URGENT' ? 'bg-red-100' :
                      signalement.status === 'INFO_RECUE' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      <span className={`material-symbols-outlined ${
                        signalement.status === 'URGENT' ? 'text-red-600' :
                        signalement.status === 'INFO_RECUE' ? 'text-blue-600' : 'text-slate-600'
                      }`}>
                        person_search
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900">
                        {signalement.missingPerson?.fullName || 'Personne disparue'}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{signalement.missingPerson?.region || '-'}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(signalement.createdAt), { addSuffix: true, locale: fr })}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        signalement.status === 'URGENT' ? 'bg-red-100 text-red-700' :
                        signalement.status === 'INFO_RECUE' ? 'bg-blue-100 text-blue-700' :
                        signalement.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {signalement.status}
                      </span>
                      <Link
                        to={`/signalements/${signalement.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Voir
                      </Link>
                      <span className={`material-symbols-outlined text-slate-400 transition-transform ${
                        expandedSignalement === signalement.id ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </div>
                  </button>

                  {/* Tips Section (expandable) */}
                  {expandedSignalement === signalement.id && (
                    <div className="bg-slate-50 border-t border-slate-200">
                      <TipsForSignalement signalementId={signalement.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
