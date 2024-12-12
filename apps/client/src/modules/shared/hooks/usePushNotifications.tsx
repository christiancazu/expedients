import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'

import { subscribeNotifications, unsubscribeNotifications } from '../../../services/api.service'
import useUserState from '../../../hooks/useUserState'
import useNotify from '../../../hooks/useNotification'
import persisterUtil from '../../../utils/persister.util'

let sw: ServiceWorkerRegistration

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    sw = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    })
  }
}

navigator.permissions.query({ name: 'notifications' }).then(function (status) {
  status.onchange = function (e) {
    const eventName = (e.currentTarget as PermissionStatus).state
    postMessage(eventName)
  }
})

let isFirstTime = false

export default function usePushNotifications() {
  const { setUserNotificationEnabled } = useUserState()
  const notify = useNotify()
  const { user } = useUserState()

  const mutationUnsubscribe = useMutation({
    mutationKey: ['unsubscribe-notification'],
    mutationFn: unsubscribeNotifications,
    onSuccess: () => {
      notify({ message: 'las Notificaciones han sido desactivadas' })
      setUserNotificationEnabled(false)

      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(subscription => {
          subscription?.unsubscribe()
        })
      })
    }
  })

  const mutationSubscribe = useMutation({
    mutationKey: ['subscribe-notification'],
    mutationFn: async () => {
      try {
        const subscription = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: persisterUtil.getVapidKey()
        })
        return subscribeNotifications(subscription)
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      notify({ message: 'las Notificaciones han sido activadas' })
      setUserNotificationEnabled(true)
    }
  })

  useEffect(() => {
    if (user && !isFirstTime) {
      registerServiceWorker()

      isFirstTime = true

      addEventListener('message', (event: MessageEvent<NotificationPermission>) => {
        if (event.data === 'granted') {
          mutationSubscribe.mutate()
        }
        if (event.data === 'denied') {
          mutationUnsubscribe.mutate()
        }
      })
    }
  }, [user])

  return {
    mutationSubscribe,
    mutationUnsubscribe
  }
}
