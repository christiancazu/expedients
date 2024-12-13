import { CloseOutlined } from '@ant-design/icons'
import { Button, type ButtonProps } from 'antd'

type Props = {
	primary?: boolean
	secondary?: boolean
	cancel?: boolean
} & ButtonProps

export default function ButtonBase({
	primary,
	secondary,
	cancel,
	...props
}: Props): React.ReactNode {
	return (
		<Button
			{...props}
			color={cancel ? 'default' : 'primary'}
			variant={primary ? 'solid' : secondary ? 'outlined' : 'text'}
			icon={
				props.icon ? <>{props.icon}</> : cancel ? <CloseOutlined /> : undefined
			}
		>
			{props.children ?? 'Cancelar'}
		</Button>
	)
}
