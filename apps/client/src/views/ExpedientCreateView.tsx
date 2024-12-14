import { useMutation } from '@tanstack/react-query'
import { Button, Divider, Modal, theme } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { Expedient } from '@expedients/shared'
import NavigationBackBtn from '../components/NavigationBackBtn'
import useNotify from '../hooks/useNotification'
import ExpedientForm from '../modules/components/ExpedientForm'
import { createExpedient } from '../services/api.service'

const ExpedientsCreateView: React.FC = () => {
	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const sectionStyle = {
		backgroundColor: colorBgContainer,
		borderRadius: borderRadiusLG,
		padding: paddingMD,
		marginBottom: marginMD,
	}

	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [createdExpedient, setCreatedExpedient] = useState<Expedient>()
	const notify = useNotify()
	const [form] = useForm()
	const { mutate, isPending } = useMutation({
		mutationKey: ['expedient-create'],
		mutationFn: () => createExpedient(form.getFieldsValue()),
		onSuccess: (res) => {
			notify({ message: 'Expediente creado con éxito' })
			setCreatedExpedient((prev) => ({ ...prev, ...res }))
			setOpen(true)
		},
	})

	return (
		<div style={sectionStyle}>
			<NavigationBackBtn to="/expedients" />
			<Divider className="my-3" />

			<div className="d-flex justify-content-center">
				<ExpedientForm form={form} isPending={isPending} onFinish={mutate} />
			</div>

			<Modal
				open={open}
				title="Confirmar"
				footer={() => (
					<>
						<Button
							onClick={() => {
								form.resetFields()
								setOpen(false)
							}}
						>
							Quedarme aquí
						</Button>
						<Button onClick={() => navigate('/expedients')}>
							Ver todos los expedientes
						</Button>
						<Button
							type="primary"
							onClick={() => navigate(`/expedients/${createdExpedient?.id}`)}
						>
							Ver expediente
						</Button>
					</>
				)}
				onCancel={() => {
					form.resetFields()
					setOpen(false)
				}}
			>
				Elija una opción
			</Modal>
		</div>
	)
}

export default ExpedientsCreateView
