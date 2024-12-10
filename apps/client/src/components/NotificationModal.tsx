import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { NotificationOutlined } from '@ant-design/icons'
import setupNotificationPermission from '../notifications'
import { useMutation } from '@tanstack/react-query'
import { subscribeNotifications } from '../services/api.service'
import useUserState from '../hooks/useUserState'
import persisterUtil from '../utils/persister.util'
import Title from 'antd/es/typography/Title'
import ButtonBase from './base/ButtonBase'

let sw: ServiceWorkerRegistration

export default function NotificationModal(): React.ReactNode {
  const [showModal, setShowModal] = useState(Notification.permission === 'default')
  const { user } = useUserState()

  const { mutate } = useMutation({
    mutationKey: ['subscribe-notification'],
    mutationFn: subscribeNotifications
  })

  useEffect(() => {
    const setupServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        sw = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        })
      }
      addEventListener('message', async (event: MessageEvent<NotificationPermission>) => {
        setShowModal(false)

        if (event.data === 'denied') {
          return
        }

        const subscription = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: persisterUtil.getVapidKey()
        })

        if (user) {
          mutate(subscription)
        }
      })
    }

    setupServiceWorker()
  }, [])

  return (
    <Modal
      closable={ false }
      open={ showModal }
      footer={ [
        <ButtonBase
          primary
          icon={ <NotificationOutlined /> }
          key="activate"
          onClick={ () => {
            setupNotificationPermission()
          } }
        >
          Activar
        </ButtonBase>
      ] }
    >
      <Title
        className='my-20'
        level={ 3 }
      >
        Se recomienda activar las notificaciones
      </Title>
    </Modal>
  )
}
