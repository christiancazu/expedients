import { useMutation, useQuery } from '@tanstack/react-query'
import { Divider, theme } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useForm } from 'antd/es/form/Form'
import NavigationBackBtn from '../../../components/NavigationBackBtn'
import useNotify from '../../../hooks/useNotification'
import { getExpedient, updateExpedient } from '../../../services/api.service'
import ExpedientForm from '../../components/ExpedientForm'

export default function ExpedientsIdEditView(): React.ReactNode {
	const { id } = useParams<{ id: string }>()

	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const sectionStyle = {
		backgroundColor: colorBgContainer,
		borderRadius: borderRadiusLG,
		padding: paddingMD,
		marginBottom: marginMD,
	}
	const notify = useNotify()
	const [form] = useForm()

	const { data, isSuccess } = useQuery({
		queryKey: ['expedient', id],
		queryFn: () => getExpedient(id!),
		refetchOnMount: true,
	})

	useEffect(() => {
		form.setFieldsValue({
			...data,
			assignedLawyerId: data?.assignedLawyer?.id,
			assignedAssistantId: data?.assignedAssistant?.id,
		})
	}, [data, isSuccess])

	const { mutate, isPending } = useMutation({
		mutationKey: ['expedient-update'],
		mutationFn: () =>
			updateExpedient({ id: id!, expedient: form.getFieldsValue() }),
		onSuccess: () => {
			notify({ message: 'Expediente actualizado con éxito' })
		},
	})

	return (
		<div style={sectionStyle}>
			<NavigationBackBtn to="/expedients" />
			<Divider className="my-12" />

			<div className="d-flex justify-content-center">
				<ExpedientForm
					form={form}
					isPending={isPending}
					mode="edit"
					onFinish={mutate}
				/>
			</div>
		</div>
	)
}
