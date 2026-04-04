import { useToastStore, ToastType } from '../store/toastStore'

export function useToast() {
  const store = useToastStore()

  return {
    toast: {
      success: (message: string, duration?: number) => store.addToast(message, 'success', duration),
      error: (message: string, duration?: number) => store.addToast(message, 'error', duration),
      info: (message: string, duration?: number) => store.addToast(message, 'info', duration),
      warning: (message: string, duration?: number) => store.addToast(message, 'warning', duration),
      custom: (message: string, type: ToastType, duration?: number) => store.addToast(message, type, duration),
    },
    removeToast: store.removeToast,
  }
}
