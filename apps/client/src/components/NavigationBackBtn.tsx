import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router'

interface Props {
	to: string
}

export default function NavigationBackBtn({ to }: Props): React.ReactNode {
	const navigate = useNavigate()

	return (
		<Button
			icon={<ArrowLeftOutlined />}
			shape="circle"
			style={{ transform: 'translateY(.1rem)' }}
			type="text"
			onClick={() => navigate(to)}
		/>
	)
}
