import { NotificationOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'

import usePushNotifications from '../modules/shared/hooks/usePushNotifications'
import setupNotificationPermission from '../notifications'
import ButtonBase from './base/ButtonBase'

export default function NotificationModal(): React.ReactNode {
	const [showModal, setShowModal] = useState(false)

	usePushNotifications()

	useEffect(() => {
		addEventListener('message', (e) => {
			if (['granted', 'denied'].some((d) => d === e.data)) {
				setShowModal(false)
			}
		})

		setTimeout(() => {
			setShowModal(Notification.permission === 'default')
		}, 2000)
	}, [])

	return (
		<Modal
			closable={false}
			open={showModal}
			footer={[
				<ButtonBase
					primary
					icon={<NotificationOutlined />}
					key="activate"
					className="mt-5"
					onClick={setupNotificationPermission}
				>
					Activar
				</ButtonBase>,
			]}
		>
			<Title className="mt-5" level={3}>
				Se recomienda activar las notificaciones
			</Title>
		</Modal>
	)
}
