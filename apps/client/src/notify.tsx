import React, { PropsWithChildren, useMemo } from 'react'

import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'

type NotificationPlacement = NotificationArgsProps['placement']
type NotificationType = 'success' | 'info' | 'warning' | 'error'
interface Notify {
  message: string;
  type?: NotificationType;
  description?: string;
  placement?: NotificationPlacement;
}
type NotifyFnType = (data: Notify) => void

export const ContextNotify = React.createContext<NotifyFnType>(() => ({}))

const NotifyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()

  const openNotification = ({
    message, placement = 'bottomRight', type = 'success', description
  }: Notify) => {
    api[type]({
      message,
      description,
      placement
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contextValue = useMemo(() => openNotification, [])

  return (
    <ContextNotify.Provider value={ contextValue }>
      {contextHolder}
      {children}
    </ContextNotify.Provider>
  )
}

export default NotifyProvider
