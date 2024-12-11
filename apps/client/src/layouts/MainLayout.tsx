import React, { useEffect, useState } from 'react'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'
import { Button, Flex, Layout, Menu, theme, MenuProps, Grid } from 'antd'
import { FolderOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import Title from 'antd/es/typography/Title'
import Text from 'antd/es/typography/Text'
import HeaderToolbar from '../components/header/HeaderToolbar'
import { StyledAvatar } from '../components/styled/avatar.styled'
import { StyledHeader, StyledSider } from './styled'
import NotificationModal from '../components/NotificationModal'

const { Content } = Layout
const { useBreakpoint } = Grid

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const matches = useMatches()
  const screens = useBreakpoint()

  const { token: { borderRadiusLG, colorBgLayout } } = theme.useToken()

  const [collapsed, setCollapsed] = useState(false)
  const [viewTitle, setViewTitle] = useState('')

  useEffect(() => {
    const handle = matches[matches.length - 1]?.handle || ''
    setViewTitle(handle as string)
  }, [matches])

  useEffect(() => {
    if (screens.md === false) {
      setCollapsed(true)
    }
  }, [screens.md])

  const items: MenuProps['items'] = [
    FolderOutlined
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `Expedientes`,
    onClick: () => navigate('/expedients')
  }))

  return (
    <>
      <Layout style={ { minHeight: '100vh' } }>
        <StyledSider
          collapsible
          collapsed={ collapsed }
          collapsedWidth="0"
          trigger={ null }
        >
          <Flex
            vertical
            justify="space-between"
            style={ { marginTop: 64 } }
          >
            <div>
              <div className='d-flex flex-column align-items-center justify-content-center my-20'>
                <StyledAvatar
                  size={ 160 }
                  src="https://corporativokallpa.com/images/logo.png"
                />
              </div>

              <Menu
                defaultSelectedKeys={ ['1'] }
                items={ items }
                mode="inline"
                theme="dark"
              />
            </div>
          </Flex>
        </StyledSider>
        <Layout style={ { marginLeft: collapsed || !screens.md ? 0 : 200, transition: 'all .2s ease-in-out, background-color 0s' } }>
          <StyledHeader $colorBgLayout={ colorBgLayout }>
            <Flex
              align='center'
              className='w-100'
              justify="space-between"
            >
              <Flex align='center'>
                <Button
                  icon={ collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
                  type="text"
                  style={ {
                    fontSize: '16px',
                    width: 64,
                    height: 64
                  } }
                  onClick={ () => setCollapsed(!collapsed) }
                />
                {
                  screens.md
                    ? <Title
                      className='mb-0'
                      level={ 3 }
                    >
                      {viewTitle}
                    </Title>
                    : <Text className='mb-0'>
                      {viewTitle}
                    </Text>
                }
              </Flex>
              <HeaderToolbar />
            </Flex>
          </StyledHeader>
          <Content
            style={ {
              margin: '16px',
              borderRadius: borderRadiusLG
            } }
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
