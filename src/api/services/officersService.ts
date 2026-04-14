import { apiClient } from '../client'

export interface Officer {
  id: string
  badgeNumber: string
  rank: string
  policeUnit: string
  zoneGeo: string | null
  joinedAt: string | null
  userId: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    isActive: boolean
    createdAt: string
  }
}

export interface CreateOfficerDto {
  badgeNumber: string
  rank: string
  policeUnit: string
  zoneGeo?: string
}

export interface UpdateOfficerDto {
  badgeNumber?: string
  rank?: string
  policeUnit?: string
  zoneGeo?: string
}

export const officersService = {
  getAll: async (): Promise<Officer[]> => {
    const response = await apiClient.get('/users/officers')
    return (response as any).data as Officer[]
  },

  getByUserId: async (userId: string): Promise<Officer> => {
    const response = await apiClient.get(`/users/officers/${userId}`)
    return (response as any).data as Officer
  },

  create: async (userId: string, data: CreateOfficerDto): Promise<Officer> => {
    const response = await apiClient.post(`/users/officers/${userId}`, data)
    return (response as any).data as Officer
  },

  update: async (userId: string, data: UpdateOfficerDto): Promise<Officer> => {
    const response = await apiClient.patch(`/users/officers/${userId}`, data)
    return (response as any).data as Officer
  },

  delete: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/officers/${userId}`)
  },
}
