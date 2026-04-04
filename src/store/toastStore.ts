import { create } from 'zustand'

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (message: string, type: ToastType, duration = 4000) => {
    const id = generateId()
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }))

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  success: (message: string, duration?: number) => {
    set((state) => {
      const useToastStore = state
      ;(useToastStore as any).addToast(message, 'success', duration)
      return state
    })
  },

  error: (message: string, duration?: number) => {
    set((state) => {
      const useToastStore = state
      ;(useToastStore as any).addToast(message, 'error', duration)
      return state
    })
  },

  info: (message: string, duration?: number) => {
    set((state) => {
      const useToastStore = state
      ;(useToastStore as any).addToast(message, 'info', duration)
      return state
    })
  },

  warning: (message: string, duration?: number) => {
    set((state) => {
      const useToastStore = state
      ;(useToastStore as any).addToast(message, 'warning', duration)
      return state
    })
  },
}))
