import { apiClient } from '../client'

export interface Temoignage {
  id: string
  signalementId: string
  reporterId: string
  missingPersonId: string
  description: string
  latitude: number | null
  longitude: number | null
  address: string | null
  isVerified: boolean
  verifiedBy: string | null
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
  reporter?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  signalement?: {
    id: string
    missingPerson: {
      fullName: string
    }
  }
}

export interface CreateTemoignageDto {
  signalementId: string
  description: string
  latitude?: number
  longitude?: number
  address?: string
  isAnonymous?: boolean
}

export const temoignageService = {
  create: async (data: CreateTemoignageDto): Promise<Temoignage> => {
    const response = await apiClient.post('/temoignage', data)
    return (response as any).data as Temoignage
  },

  getBySignalement: async (signalementId: string): Promise<Temoignage[]> => {
    const response = await apiClient.get(`/temoignage/signalement/${signalementId}`)
    return (response as any).data as Temoignage[]
  },

  verify: async (id: string): Promise<Temoignage> => {
    const response = await apiClient.patch(`/temoignage/${id}/verify`, {})
    return (response as any).data as Temoignage
  },
}
