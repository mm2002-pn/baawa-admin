import { apiClient } from '../client'
import { LoginCredentials, AuthResponse, BackendAuthResponse, User } from '../types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<BackendAuthResponse> => {
    try {
      const response = await apiClient.post('/auth/classic-login', credentials)

      // Backend returns: { success: true, statusCode: 200, message: '...', data: {...} }
      // The response interceptor already extracts response.data
      // So response here is: { success: true, statusCode: 200, message: '...', data: {...} }
      return response as unknown as BackendAuthResponse
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
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
