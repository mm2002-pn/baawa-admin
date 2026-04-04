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
    return response as unknown as User
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
}
