import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Role } from '../api/types'

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAdmin: () => boolean
  isSchoolAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user: User, accessToken: string, refreshToken: string) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken })
      },

      setUser: (user: User) => {
        set({ user })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      isAdmin: () => {
        const state = get()
        return state.user?.role === Role.ADMIN_BAAWA
      },

      isSchoolAdmin: () => {
        const state = get()
        return state.user?.role === Role.ADMIN_SCHOOL
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
