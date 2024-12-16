import {
	DownOutlined,
	LogoutOutlined,
	MoonOutlined,
	NotificationOutlined,
	ProfileOutlined,
	SettingOutlined,
	SunOutlined,
} from '@ant-design/icons'
import {
	Badge,
	Dropdown,
	Grid,
	type MenuProps,
	Space,
	Switch,
	Tooltip,
	theme,
} from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import useNotify from '../../hooks/useNotification'
import useToogleTheme from '../../hooks/useToogleTheme'
import useUserState from '../../hooks/useUserState'
import DrawerEvents from './DrawerEvents'

import './header-toolbar.scss'
import { UserAvatar } from '../../modules/shared/components/UserAvatarName'
import { StyledNotificationAvatar } from './styled'

const { useBreakpoint } = Grid

export default function HeaderToolbar(): React.ReactNode {
	const navigate = useNavigate()

	const { colorPrimary } = theme.useToken().token

	const { isUserNotificationEnabled } = useUserState()

	const [_, setParams] = useSearchParams()

	const notify = useNotify()

	const screens = useBreakpoint()
	const { isDarkTheme, toggleTheme } = useToogleTheme()

	const { user, purgeUserSession } = useUserState()
	const [drawer, setDrawer] = useState(false)

	const items: MenuProps['items'] = useMemo(
		() => [
			{
				label: 'Mi perfil',
				key: 'settings',
				icon: <ProfileOutlined style={{ fontSize: 16, color: colorPrimary }} />,
				onClick: () => navigate('/users/profile'),
			},
			...(!screens.md
				? [
						{
							label: 'Eventos',
							key: 'eventos',
							onClick: () => setDrawer(true),
							icon: (
								<Badge size="small">
									<NotificationOutlined
										style={{
											fontSize: 16,
											color: isUserNotificationEnabled
												? colorPrimary
												: undefined,
										}}
									/>
								</Badge>
							),
						},
						{
							label: isDarkTheme ? 'Tema claro' : 'Tema oscuro',
							key: 'darkTheme',
							icon: isDarkTheme ? (
								<SunOutlined style={{ fontSize: 16, color: colorPrimary }} />
							) : (
								<MoonOutlined style={{ fontSize: 16, color: colorPrimary }} />
							),
							onClick: toggleTheme,
						},
					]
				: []),
			{
				type: 'divider',
			},
			{
				label: 'Cerrar sesión',
				key: 'logout',
				icon: <LogoutOutlined style={{ fontSize: 16, color: colorPrimary }} />,
				onClick: () => {
					setParams({ logout: 'true' })
					purgeUserSession()
					notify({ message: 'La sesión ha sido finalizada', type: 'info' })
				},
			},
		],
		[isDarkTheme, screens],
	)

	return (
		<>
			<Space wrap className="pr-1 d-flex align-items-center" size={16}>
				{screens.md && (
					<>
						<Switch
							checked={isDarkTheme}
							checkedChildren={<MoonOutlined />}
							unCheckedChildren={<SunOutlined />}
							onChange={toggleTheme}
						/>

						<div style={{ transform: 'translateY(-2px)' }}>
							<Tooltip title="Eventos">
								<Badge
									className="cursor-pointer"
									onClick={() => setDrawer(true)}
								>
									<StyledNotificationAvatar
										$active={isUserNotificationEnabled}
										icon={<NotificationOutlined />}
									/>
								</Badge>
							</Tooltip>
						</div>
					</>
				)}

				<Dropdown
					className="header-user-info"
					menu={{ items }}
					trigger={['click']}
				>
					<div className="header-user-info__block">
						<div className="header-user-info__block__avatar">
							<UserAvatar user={user!} />
						</div>
						<div className="header-user-info__block__name">
							<span>
								{user?.firstName} {user?.surname}
							</span>
							<span>
								{screens.md ? (
									<DownOutlined style={{ fontSize: 12 }} />
								) : (
									<SettingOutlined style={{ fontSize: 12 }} />
								)}
							</span>
						</div>
					</div>
				</Dropdown>
			</Space>
			<DrawerEvents drawer={drawer} setDrawer={setDrawer} />
		</>
	)
}
