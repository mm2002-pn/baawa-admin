import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { plansService, trackersService } from '../api/services/trackersService'
import { CreateSubscriptionDto, DirectSaleDto, PlanInput } from '../api/types'
import { useToast } from './useToast'

const errorMessage = (e: any, fallback: string) => {
  const message = e.response?.data?.message
  return (Array.isArray(message) ? message[0] : message) || fallback
}

/** Un paiement change la couverture des boîtiers, les compteurs des formules et les statistiques. */
function invalidateBilling(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['trackers'] })
  qc.invalidateQueries({ queryKey: ['plans'] })
  qc.invalidateQueries({ queryKey: ['subscriptions'] })
}

// ========== Formules ==========

export function usePlans() {
  return useQuery({ queryKey: ['plans'], queryFn: plansService.getAll })
}

export function useSavePlan() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: PlanInput }) =>
      id ? plansService.update(id, data) : plansService.create(data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['plans'] })
      toast.success(id ? 'Formule mise à jour' : 'Formule créée')
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'enregistrement")),
  })
}

export function useTogglePlan() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => plansService.update(id, { isActive }),
    onSuccess: (plan) => {
      qc.invalidateQueries({ queryKey: ['plans'] })
      toast.success(plan.isActive ? 'Formule remise en vente' : 'Formule retirée de la vente')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors du changement')),
  })
}

export function useDeletePlan() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => plansService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plans'] })
      toast.success('Formule supprimée')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la suppression')),
  })
}

// ========== Abonnements ==========

export function useSubscriptionStats() {
  return useQuery({ queryKey: ['subscriptions', 'stats'], queryFn: trackersService.getSubscriptionStats })
}

export function useTrackerSubscriptions(trackerId: string) {
  return useQuery({
    queryKey: ['subscriptions', 'tracker', trackerId],
    queryFn: () => trackersService.getSubscriptions(trackerId),
  })
}

export function useCreateSubscription(trackerId: string) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateSubscriptionDto) => trackersService.createSubscription(trackerId, data),
    onSuccess: () => {
      invalidateBilling(qc)
      toast.success('Paiement enregistré, abonnement actif')
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'enregistrement du paiement")),
  })
}

export function useCancelSubscription() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => trackersService.cancelSubscription(id),
    onSuccess: () => {
      invalidateBilling(qc)
      toast.success('Abonnement annulé')
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'annulation")),
  })
}

// ========== Vente directe ==========

export function useDirectSale() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DirectSaleDto }) => trackersService.sellDirect(id, data),
    onSuccess: (tracker) => {
      invalidateBilling(qc)
      toast.success(
        tracker.owner
          ? 'Vente enregistrée, boîtier rattaché au compte du parent'
          : "Vente enregistrée. Le boîtier se rattachera au parent dès qu'il aura un compte vérifié.",
      )
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'enregistrement de la vente")),
  })
}

export function useDirectReturn() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => trackersService.returnDirect(id),
    onSuccess: () => {
      invalidateBilling(qc)
      toast.success('Boîtier repris, de retour en stock')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la reprise')),
  })
}
