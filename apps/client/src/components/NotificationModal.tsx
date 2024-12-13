import { NotificationOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'

import usePushNotifications from '../modules/shared/hooks/usePushNotifications'
import setupNotificationPermission from '../notifications'
import ButtonBase from './base/ButtonBase'

export default function NotificationModal(): React.ReactNode {
	const [showModal, setShowModal] = useState(
		Notification.permission === 'default',
	)

	usePushNotifications()

	useEffect(() => {
		addEventListener('message', () => {
			setShowModal(false)
		})
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
					onClick={() => {
						setupNotificationPermission()
					}}
				>
					Activar
				</ButtonBase>,
			]}
		>
			<Title className="my-20" level={3}>
				Se recomienda activar las notificaciones
			</Title>
		</Modal>
	)
}
