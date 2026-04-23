import { apiClient } from '../client'
import { User, CreateUserDto, UpdateUserDto, PaginatedResponse } from '../types'

export const usersService = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    })
    const response = await apiClient.get(`/users?${params.toString()}`)
    return response as unknown as PaginatedResponse<User>
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`)
    console.log('📊 getById response:', response)

    // Backend returns wrapped response: { success, statusCode, message, data: { user } }
    // response.data contains the user object
    const userData = response.data || response
    return userData as unknown as User
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post('/users', data)
    return response as unknown as User
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, data)
    return response as unknown as User
  },

  toggleActive: async (id: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/toggle-active`, {})
    return response as unknown as User
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },

  createOfficerProfile: async (
    userId: string,
    data: { badgeNumber: string; rank: string; policeUnit: string }
  ): Promise<any> => {
    const response = await apiClient.post(`/users/officers/${userId}`, data)
    return response
  },
}
