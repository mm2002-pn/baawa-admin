import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { trackersService, mySchoolTrackersService } from '../api/services/trackersService'
import { AlarmStatusFilter, CreateTrackerDto, TrackerFilters, UpdateTrackerDto } from '../api/types'
import { useToast } from './useToast'

const errorMessage = (e: any, fallback: string) => {
  const message = e.response?.data?.message
  return (Array.isArray(message) ? message[0] : message) || fallback
}

// ========== Parc (admin BAAWA) ==========

/** Tout changement du parc touche aussi les compteurs des écoles. */
function invalidateFleet(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['trackers'] })
  qc.invalidateQueries({ queryKey: ['schools'] })
}

export function useTrackers(filters: TrackerFilters) {
  return useQuery({
    queryKey: ['trackers', 'list', filters],
    queryFn: () => trackersService.getAll(filters),
    placeholderData: (previous) => previous,
  })
}

export function useTrackerStats() {
  return useQuery({ queryKey: ['trackers', 'stats'], queryFn: trackersService.getStats })
}

export function useFleetPositions(schoolId?: string) {
  return useQuery({
    queryKey: ['trackers', 'positions', schoolId],
    queryFn: () => trackersService.getPositions(schoolId),
    refetchInterval: 30_000,
  })
}

export function useCreateTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data: CreateTrackerDto) => trackersService.create(data),
    onSuccess: (tracker) => {
      invalidateFleet(qc)
      if (tracker.traccarDeviceId === null) {
        toast.warning('Boîtier enregistré, mais pas encore relié au serveur de géolocalisation')
      } else {
        toast.success('Boîtier enregistré')
      }
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'enregistrement")),
  })
}

export function useBulkCreateTrackers() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: trackersService.bulkCreate,
    onSuccess: () => invalidateFleet(qc),
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'import")),
  })
}

export function useUpdateTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrackerDto }) => trackersService.update(id, data),
    onSuccess: () => {
      invalidateFleet(qc)
      toast.success('Boîtier mis à jour')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la mise à jour')),
  })
}

export function useSetTrackerSchool() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, schoolId }: { id: string; schoolId: string | null }) =>
      trackersService.setSchool(id, schoolId),
    onSuccess: (_, { schoolId }) => {
      invalidateFleet(qc)
      toast.success(schoolId ? "Boîtier affecté à l'école" : 'Boîtier remis en stock')
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'affectation")),
  })
}

export function useSyncTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => trackersService.sync(id),
    onSuccess: () => {
      invalidateFleet(qc)
      toast.success('Boîtier relié au serveur de géolocalisation')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Synchronisation impossible')),
  })
}

export function useDeleteTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => trackersService.remove(id),
    onSuccess: () => {
      invalidateFleet(qc)
      toast.success('Boîtier supprimé')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la suppression')),
  })
}

// ========== École ==========

/** Une attribution change à la fois les boîtiers, les élèves et la carte. */
function invalidateSchoolTracking(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['my-school'] })
  qc.invalidateQueries({ queryKey: ['students'] })
  qc.invalidateQueries({ queryKey: ['student-positions'] })
}

export function useMySchoolTrackers() {
  return useQuery({
    queryKey: ['my-school', 'trackers'],
    queryFn: mySchoolTrackersService.getAll,
    refetchInterval: 60_000,
  })
}

export function useUpdateMySchoolTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Pick<UpdateTrackerDto, 'label' | 'state'> }) =>
      mySchoolTrackersService.update(id, data),
    onSuccess: () => {
      invalidateSchoolTracking(qc)
      toast.success('Boîtier mis à jour')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors de la mise à jour')),
  })
}

export function useAssignTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, studentId }: { id: string; studentId: string }) =>
      mySchoolTrackersService.assign(id, studentId),
    onSuccess: () => {
      invalidateSchoolTracking(qc)
      toast.success('Boîtier attribué')
    },
    onError: (e: any) => toast.error(errorMessage(e, "Erreur lors de l'attribution")),
  })
}

export function useUnassignTracker() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => mySchoolTrackersService.unassign(id),
    onSuccess: () => {
      invalidateSchoolTracking(qc)
      toast.success('Boîtier retiré')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors du retrait')),
  })
}

// ========== Alarmes ==========

export function useAlarms(status: AlarmStatusFilter, page = 1) {
  return useQuery({
    queryKey: ['alarms', 'list', status, page],
    queryFn: () => mySchoolTrackersService.getAlarms(status, page),
    placeholderData: (previous) => previous,
    refetchInterval: 60_000,
  })
}

export function useOpenAlarmsCount(enabled = true) {
  return useQuery({
    queryKey: ['alarms', 'count'],
    queryFn: mySchoolTrackersService.getOpenAlarmsCount,
    enabled,
    refetchInterval: 60_000,
  })
}

export function useAcknowledgeAlarm() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      mySchoolTrackersService.acknowledgeAlarm(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alarms'] })
      toast.success('Alarme marquée comme traitée')
    },
    onError: (e: any) => toast.error(errorMessage(e, 'Erreur lors du traitement')),
  })
}
