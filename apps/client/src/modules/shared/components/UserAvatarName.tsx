import { UserOutlined } from '@ant-design/icons'
import { User } from '@expedients/shared'
import { Avatar, Flex, Typography } from 'antd'

const { Text } = Typography

interface Props {
	user: Partial<User>
	title?: string
}

let publicmediaPrefix = ''

if (process.env.NODE_ENV === 'development') {
	publicmediaPrefix = '/publicmedia'
}

export const UserAvatar = ({ user }: Props): React.ReactNode => {
	const prefix = `${publicmediaPrefix}/media/avatars/`

	return (
		<Avatar
			src={user.avatar ? `${prefix}${user.avatar}` : undefined}
			icon={<UserOutlined />}
			style={{ minWidth: 32 }}
			size={32}
		/>
	)
}

export default function UserAvatarName({
	user,
	title,
}: Props): React.ReactNode {
	return (
		<Flex align="center">
			<UserAvatar user={user} />
			<Flex vertical className="ml-2">
				{title && <Text className="font-bold text-xs">{title}</Text>}
				<Text className="text-wrap">{`${user.firstName} ${user.surname}`}</Text>
			</Flex>
		</Flex>
	)
}
