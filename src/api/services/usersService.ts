import { apiClient } from '../client'
import { User, CreateUserDto, UpdateUserDto, PaginatedResponse } from '../types'

// Backend wraps every response as { success, statusCode, message, data: <payload> }.
// The axios interceptor already extracts response.data (the HTTP body), so each
// service method still needs to read `.data` once more to reach the payload.

export const usersService = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(`/users?${params.toString()}`)
    return (response as any).data as PaginatedResponse<User>
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`)
    return (response as any).data as User
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post('/users', data)
    return (response as any).data as User
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, data)
    return (response as any).data as User
  },

  toggleActive: async (id: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/toggle-active`, {})
    return (response as any).data as User
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },

  createOfficerProfile: async (
    userId: string,
    data: { badgeNumber: string; rank: string; policeUnit: string }
  ): Promise<any> => {
    const response = await apiClient.post(`/users/officers/${userId}`, data)
    return (response as any).data
  },
}
