import { Button, Flex } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundView: React.FC = () => {
	const navigate = useNavigate()

	return (
		<Flex
			vertical
			align="center"
			justify="center"
			style={{ minHeight: '100vh' }}
		>
			<section style={{ width: '300px' }}>
				<h1 className="mb-20 text-center">Esta página no existe</h1>
				<Button block type="primary" onClick={() => navigate('/')}>
					Volver
				</Button>
			</section>
		</Flex>
	)
}

export default NotFoundView
