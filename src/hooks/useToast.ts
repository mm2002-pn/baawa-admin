import { useCallback } from 'react'
import { useToastStore, ToastType } from '../store/toastStore'

export function useToast() {
  // Sélectionner UNIQUEMENT les fonctions (pas tout le store)
  const addToast = useToastStore((state) => state.addToast)
  const removeToast = useToastStore((state) => state.removeToast)

  // Mémoriser les fonctions pour qu'elles ne changent pas
  const success = useCallback(
    (message: string, duration?: number) => addToast(message, 'success', duration),
    [addToast]
  )
  const error = useCallback(
    (message: string, duration?: number) => addToast(message, 'error', duration),
    [addToast]
  )
  const info = useCallback(
    (message: string, duration?: number) => addToast(message, 'info', duration),
    [addToast]
  )
  const warning = useCallback(
    (message: string, duration?: number) => addToast(message, 'warning', duration),
    [addToast]
  )
  const custom = useCallback(
    (message: string, type: ToastType, duration?: number) => addToast(message, type, duration),
    [addToast]
  )

  return {
    toast: {
      success,
      error,
      info,
      warning,
      custom,
    },
    removeToast,
  }
}
