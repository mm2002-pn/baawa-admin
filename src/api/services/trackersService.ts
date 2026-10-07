import { apiClient } from '../client'
import {
  AlarmStatusFilter, BulkCreateTrackersResult, CreateSubscriptionDto, CreateTrackerDto, DirectSaleDto,
  FleetPositionEntry, Paged, Plan, PlanInput, SchoolTracker, Subscription, SubscriptionStats, Tracker,
  TrackerAlarm, TrackerFilters, TrackerStats, UpdateTrackerDto,
} from '../types'

function toQuery(params: object): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') qs.append(key, String(value))
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

/** Parc de boîtiers — réservé à l'admin BAAWA. */
export const trackersService = {
  getAll: async (filters: TrackerFilters = {}): Promise<Paged<Tracker>> => {
    const res = await apiClient.get(`/trackers${toQuery(filters)}`)
    return (res as any).data
  },
  getStats: async (): Promise<TrackerStats> => {
    const res = await apiClient.get('/trackers/stats')
    return (res as any).data
  },
  getPositions: async (schoolId?: string): Promise<FleetPositionEntry[]> => {
    const res = await apiClient.get(`/trackers/positions${toQuery({ schoolId })}`)
    return (res as any).data
  },
  create: async (data: CreateTrackerDto): Promise<Tracker> => {
    const res = await apiClient.post('/trackers', data)
    return (res as any).data
  },
  bulkCreate: async (data: { imeis: string[]; model?: string; schoolId?: string }): Promise<BulkCreateTrackersResult> => {
    const res = await apiClient.post('/trackers/bulk', data)
    return (res as any).data
  },
  update: async (id: string, data: UpdateTrackerDto): Promise<Tracker> => {
    const res = await apiClient.patch(`/trackers/${id}`, data)
    return (res as any).data
  },
  setSchool: async (id: string, schoolId: string | null): Promise<Tracker> => {
    const res = await apiClient.patch(`/trackers/${id}/school`, { schoolId })
    return (res as any).data
  },
  sync: async (id: string): Promise<Tracker> => {
    const res = await apiClient.post(`/trackers/${id}/sync`, {})
    return (res as any).data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/trackers/${id}`)
  },
  sellDirect: async (id: string, data: DirectSaleDto): Promise<Tracker> => {
    const res = await apiClient.post(`/trackers/${id}/direct-sale`, data)
    return (res as any).data
  },
  returnDirect: async (id: string): Promise<Tracker> => {
    const res = await apiClient.post(`/trackers/${id}/direct-return`, {})
    return (res as any).data
  },
  getSubscriptions: async (id: string): Promise<Subscription[]> => {
    const res = await apiClient.get(`/trackers/${id}/subscriptions`)
    return (res as any).data
  },
  createSubscription: async (id: string, data: CreateSubscriptionDto): Promise<Subscription> => {
    const res = await apiClient.post(`/trackers/${id}/subscriptions`, data)
    return (res as any).data
  },
  cancelSubscription: async (subscriptionId: string): Promise<Subscription> => {
    const res = await apiClient.post(`/subscriptions/${subscriptionId}/cancel`, {})
    return (res as any).data
  },
  getSubscriptionStats: async (): Promise<SubscriptionStats> => {
    const res = await apiClient.get('/subscriptions/stats')
    return (res as any).data
  },
}

/** Formules d'abonnement — réservé à l'admin BAAWA. */
export const plansService = {
  getAll: async (): Promise<Plan[]> => {
    const res = await apiClient.get('/plans')
    return (res as any).data
  },
  create: async (data: PlanInput): Promise<Plan> => {
    const res = await apiClient.post('/plans', data)
    return (res as any).data
  },
  update: async (id: string, data: Partial<PlanInput>): Promise<Plan> => {
    const res = await apiClient.patch(`/plans/${id}`, data)
    return (res as any).data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`)
  },
}

/** Boîtiers et alarmes de l'école du compte connecté. */
export const mySchoolTrackersService = {
  getAll: async (): Promise<SchoolTracker[]> => {
    const res = await apiClient.get('/my-school/trackers')
    return (res as any).data
  },
  update: async (id: string, data: Pick<UpdateTrackerDto, 'label' | 'state'>): Promise<Tracker> => {
    const res = await apiClient.patch(`/my-school/trackers/${id}`, data)
    return (res as any).data
  },
  assign: async (id: string, studentId: string): Promise<Tracker> => {
    const res = await apiClient.post(`/my-school/trackers/${id}/assign`, { studentId })
    return (res as any).data
  },
  unassign: async (id: string): Promise<Tracker> => {
    const res = await apiClient.post(`/my-school/trackers/${id}/unassign`, {})
    return (res as any).data
  },
  getAlarms: async (status: AlarmStatusFilter = 'open', page = 1, limit = 20): Promise<Paged<TrackerAlarm>> => {
    const res = await apiClient.get(`/my-school/alarms${toQuery({ status, page, limit })}`)
    return (res as any).data
  },
  getOpenAlarmsCount: async (): Promise<{ open: number }> => {
    const res = await apiClient.get('/my-school/alarms/count')
    return (res as any).data
  },
  acknowledgeAlarm: async (id: string, note?: string): Promise<TrackerAlarm> => {
    const res = await apiClient.patch(`/my-school/alarms/${id}/acknowledge`, note ? { note } : {})
    return (res as any).data
  },
}
