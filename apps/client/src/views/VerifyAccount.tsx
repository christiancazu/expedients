import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Alert, Card, Flex, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { AxiosError } from 'axios'
import { useNavigate, useSearchParams } from 'react-router'
import ButtonBase from '../components/base/ButtonBase'
import useNotify from '../hooks/useNotification'
import useUserState from '../hooks/useUserState'
import { verifyAccount } from '../services/api.service'

interface FieldType {
	confirmPassword?: string
	password?: string
}
export default function VerifyAccount(): React.ReactNode {
	const [form] = useForm()
	const { setUserSession } = useUserState()
	const navigate = useNavigate()
	const notify = useNotify()
	const [searchParams] = useSearchParams()

	const { mutate, isPending, isSuccess, data } = useMutation({
		mutationKey: ['verify-account'],
		mutationFn: () =>
			verifyAccount({
				password: form.getFieldValue('password'),
				token: searchParams.get('token') || '',
			}),
		onError: (response: AxiosError<{ message: string }>) => {
			if (response.status === 422) {
				notify({ message: response.response!.data.message, type: 'error' })
			} else {
				notify({
					message: 'El usuario o la contraseña son incorrectos',
					type: 'error',
				})
			}
		},
	})

	const handleJoin = () => {
		setUserSession(data!)
		navigate('/')
		notify({ message: 'La sessión ha sido iniciada con éxito' })
	}

	return (
		<Flex
			vertical
			align="center"
			justify="center"
			style={{ minHeight: '100vh' }}
		>
			<section style={{ maxWidth: '300px', width: '100%' }}>
				<Card
					bordered={true}
					className="mb-0"
					title={
						<p style={{ textAlign: 'center' }}>Establezca su contraseña</p>
					}
				>
					{isSuccess ? (
						<>
							<Alert
								showIcon
								description="La contraseña ha sido establecida con éxito"
								message="Correcto"
								type="success"
							/>
							<ButtonBase
								block
								primary
								className="mt-1"
								icon={<SendOutlined />}
								onClick={() => handleJoin()}
							>
								Ingresar
							</ButtonBase>
						</>
					) : (
						<Form
							autoComplete="off"
							disabled={isPending}
							form={form}
							layout="vertical"
							name="login"
							onFinish={mutate}
						>
							<Form.Item<FieldType>
								label="Contraseña"
								name="password"
								rules={[{ required: true }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item<FieldType>
								label="Confirmar contraseña"
								name="confirmPassword"
								rules={[
									{ required: true },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve()
											}
											return Promise.reject(
												new Error('La contraseña debe ser la misma'),
											)
										},
									}),
								]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item className="mb-0">
								<ButtonBase
									block
									primary
									className="mt-1"
									htmlType="submit"
									loading={isPending}
								>
									Establecer
								</ButtonBase>
								<ButtonBase
									block
									secondary
									className="mt-5"
									icon={<ArrowLeftOutlined />}
									onClick={() => navigate('/')}
								>
									Volver
								</ButtonBase>
							</Form.Item>
						</Form>
					)}
				</Card>
			</section>
		</Flex>
	)
}
