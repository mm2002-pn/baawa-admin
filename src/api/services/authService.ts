import { apiClient } from '../client'
import { LoginCredentials, AuthResponse, User } from '../types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/classic-login', credentials)
    return response as unknown as AuthResponse
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response as unknown as { accessToken: string }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me')
    return response as unknown as User
  },
}
