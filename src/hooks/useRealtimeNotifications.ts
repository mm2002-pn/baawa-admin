import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useToast } from './useToast'
import baawaIcon from '../assets/baawa.jpg'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

let socket: Socket | null = null

/** Affiche une notification native du bureau si l'utilisateur a donné la permission. */
function showDesktopNotification(title: string, body: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    const notif = new Notification(title, {
      body,
      icon: baawaIcon,
      tag: 'baawa', // évite l'empilement de doublons
    })
    notif.onclick = () => {
      window.focus()
      notif.close()
    }
  } catch {
    // certains navigateurs lèvent si appelé hors contexte sécurisé — on ignore
  }
}

/**
 * Connecte le panneau admin au WebSocket du backend (Command Center) :
 *  - rafraîchit les données en temps réel,
 *  - affiche un toast in-app,
 *  - et une notification native du bureau (même onglet en arrière-plan).
 * À monter une seule fois (dans AdminLayout).
 */
export function useRealtimeNotifications() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return

    // Demander la permission des notifications bureau (une seule fois)
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission()
    }

    socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    // Canal canonique : une notification ciblée (room privée). Sert de source
    // unique pour le toast, le badge et le popup bureau.
    socket.on('notification', (notif: { title?: string; message?: string }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      const title = notif?.title ?? 'BAAWA'
      const message = notif?.message ?? ''
      toast.info(message || title)
      showDesktopNotification(title, message)
    })

    // Diffusions Command Center : on se contente de rafraîchir les données
    // (le toast/popup est déjà géré par l'évènement `notification` ci-dessus).
    socket.on('new_alert', () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    })

    socket.on('new_hit', () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] })
    })

    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [accessToken, queryClient, toast])
}
