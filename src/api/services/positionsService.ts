import { apiClient } from '../client'
import { StudentPositionEntry, TraccarPosition } from '../types'

export const positionsService = {
  getPositions: async (): Promise<StudentPositionEntry[]> => {
    const res = await apiClient.get('/students/positions')
    return (res as any).data
  },
  getRoute: async (studentId: string, from?: string, to?: string): Promise<TraccarPosition[]> => {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    const qs = params.toString()
    const res = await apiClient.get(`/students/${studentId}/route${qs ? `?${qs}` : ''}`)
    return (res as any).data
  },
}
