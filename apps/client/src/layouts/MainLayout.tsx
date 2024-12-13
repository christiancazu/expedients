import {
	FolderOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Button, Flex, Grid, Layout, Menu, type MenuProps, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'

import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
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

	const {
		token: { borderRadiusLG, colorBgLayout },
	} = theme.useToken()

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
			<Layout style={{ minHeight: '100vh' }}>
				{!sidebarDrawerAvailabled ? (
					<StyledSider
						collapsible
						collapsed={sidebarCollapsed}
						collapsedWidth="0"
						trigger={null}
					>
						<Flex vertical justify="space-between" style={{ marginTop: 64 }}>
							<div>
								<div className="d-flex flex-column align-items-center justify-content-center my-20">
									<StyledAvatar
										size={160}
										src="https://corporativokallpa.com/images/logo.png"
									/>
								</div>

								<Menu
									className="px-8"
									defaultSelectedKeys={['1']}
									items={items}
									mode="inline"
									style={{ backgroundColor: 'transparent' }}
									theme="dark"
								/>
							</div>
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
								<div className="d-flex flex-column align-items-center justify-content-center my-20">
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
						<Flex align="center" className="w-100" justify="space-between">
							<Flex align="center">
								<Button
									icon={
										sidebarCollapsed ? (
											<MenuUnfoldOutlined />
										) : (
											<MenuFoldOutlined />
										)
									}
									type="text"
									style={{
										fontSize: '16px',
										width: 64,
										height: 64,
									}}
									onClick={() => {
										if (sidebarDrawerAvailabled) {
											setSidebarCollapsed(false)
											setSidebarDrawerOpen(true)
										} else {
											setSidebarCollapsed(!sidebarCollapsed)
										}
									}}
								/>
								{screens.md ? (
									<Title className="mb-0" level={3}>
										{viewTitle}
									</Title>
								) : (
									<Text className="mb-0">{viewTitle}</Text>
								)}
							</Flex>
							<HeaderToolbar />
						</Flex>
					</StyledHeader>
					<Content
						style={{
							margin: '16px',
							borderRadius: borderRadiusLG,
						}}
					>
						<Outlet />
					</Content>
				</Layout>
			</Layout>

			<NotificationModal />
		</>
	)
}

export default MainLayout
