import {
	FolderOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Button, Flex, Grid, Layout, Menu, type MenuProps, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useMatches, useNavigate } from 'react-router'

import Text from 'antd/es/typography/Text'
import NotificationModal from '../components/NotificationModal'
import HeaderToolbar from '../components/header/HeaderToolbar'
import { StyledAvatar } from '../components/styled/avatar.styled'
import { StyledHeader, StyledSider, StyledSiderDrawer } from './styled'

const { Content } = Layout
const { useBreakpoint } = Grid

const MainLayout: React.FC = () => {
	const navigate = useNavigate()
	const matches = useMatches()
	const screens = useBreakpoint()

	const { colorBgLayout } = theme.useToken().token

	const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
	const [sidebarDrawerAvailabled, setSidebarDrawerAvailabled] = useState(false)
	const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false)

	const [viewTitle, setViewTitle] = useState('')

	useEffect(() => {
		const handle = matches[matches.length - 1]?.handle || ''
		setViewTitle(handle as string)
	}, [matches])

	useEffect(() => {
		if (screens.md === false) {
			setSidebarCollapsed(true)
			setSidebarDrawerAvailabled(true)
		} else {
			setSidebarDrawerAvailabled(false)
		}
	}, [screens.md])

	useEffect(() => {
		if (!screens.md) {
			setSidebarCollapsed(false)
		}
	}, [])

	const items: MenuProps['items'] = [FolderOutlined].map((icon, index) => ({
		key: String(index + 1),
		icon: React.createElement(icon),
		label: 'Expedientes',
		onClick: () => navigate('/expedients'),
	}))

	return (
		<>
			<Layout className="min-h-screen">
				{!sidebarDrawerAvailabled ? (
					<StyledSider
						collapsible
						collapsed={sidebarCollapsed}
						collapsedWidth="0"
						trigger={null}
					>
						<Flex vertical justify="space-between" className="mt-16 px-4">
							<div className="d-flex flex-column align-items-center justify-content-center my-5">
								<StyledAvatar
									size={160}
									src="https://corporativokallpa.com/images/logo.png"
								/>
							</div>

							<Menu
								defaultSelectedKeys={['1']}
								items={items}
								mode="inline"
								style={{ backgroundColor: 'transparent' }}
								theme="dark"
							/>
						</Flex>
					</StyledSider>
				) : (
					<StyledSiderDrawer
						closeIcon={<MenuFoldOutlined />}
						open={sidebarDrawerOpen}
						placement="left"
						width={288}
						onClose={() => setSidebarDrawerOpen(false)}
					>
						<Flex vertical justify="space-between">
							<div>
								<div className="d-flex flex-column align-items-center justify-content-center my-5">
									<StyledAvatar
										size={160}
										src="https://corporativokallpa.com/images/logo.png"
									/>
								</div>

								<Menu
									defaultSelectedKeys={['1']}
									items={items}
									mode="inline"
									style={{ backgroundColor: 'transparent' }}
									theme="dark"
									onClick={() => setSidebarDrawerOpen(false)}
								/>
							</div>
						</Flex>
					</StyledSiderDrawer>
				)}
				<Layout
					style={{
						marginLeft:
							sidebarCollapsed || !screens.md || sidebarDrawerAvailabled
								? 0
								: 200,
						transition: 'all .2s ease-in-out, background-color 0s',
					}}
				>
					<StyledHeader $colorBgLayout={colorBgLayout}>
						<Flex align="center" className="w-full" justify="space-between">
							<Flex align="center">
								<Button
									size="large"
									icon={
										sidebarCollapsed ? (
											<MenuUnfoldOutlined />
										) : (
											<MenuFoldOutlined />
										)
									}
									type="text"
									className="mx-1"
									onClick={() => {
										if (sidebarDrawerAvailabled) {
											setSidebarCollapsed(false)
											setSidebarDrawerOpen(true)
										} else {
											setSidebarCollapsed(!sidebarCollapsed)
										}
									}}
								/>
								<Text className={screens.md ? 'text-2xl' : 'text-base'}>
									{viewTitle}
								</Text>
							</Flex>
							<HeaderToolbar />
						</Flex>
					</StyledHeader>
					<Content className="m-4">
						<Outlet />
					</Content>
				</Layout>
			</Layout>

			<NotificationModal />
		</>
	)
}

export default MainLayout
