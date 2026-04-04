import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: () => boolean
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system' as Theme,

      setTheme: (theme: Theme) => {
        set({ theme })
        applyTheme(theme)
      },

      toggleTheme: () => {
        const current = get().theme
        const next: Theme = current === 'light' ? 'dark' : 'light'
        get().setTheme(next)
      },

      isDark: () => {
        const state = get()
        if (state.theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return state.theme === 'dark'
      },
    }),
    {
      name: 'theme-store',
    }
  )
)

function applyTheme(theme: Theme) {
  const html = document.documentElement

  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.toggle('dark', isDark)
  } else {
    html.classList.toggle('dark', theme === 'dark')
  }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const theme = useThemeStore.getState().theme
    if (theme === 'system') {
      applyTheme('system')
    }
  })
}
