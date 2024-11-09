import React, { useEffect, useState } from 'react'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'
import { Avatar, Button, Flex, Layout, Menu, theme, MenuProps } from 'antd'
import { FolderOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import { Header } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import HeaderToolbar from '../components/header/HeaderToolbar'

const { Content, Sider } = Layout

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  transition: 'min-width .2s ease-in-out, width .2s ease-in-out, max-width .2s ease-in-out'
}

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const matches = useMatches()

  const { token: { borderRadiusLG, colorBgLayout } } = theme.useToken()

  const [collapsed, setCollapsed] = useState(false)
  const [viewTitle, setViewTitle] = useState('')

  useEffect(() => {
    const handle = matches[matches.length - 1]?.handle || ''
    setViewTitle(handle as string)
  }, [matches])

  const items: MenuProps['items'] = [
    FolderOutlined
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `Expedientes`,
    onClick: () => navigate('/expedients')
  }))

  return (
    <Layout style={ { minHeight: '100vh' } }>
      <Sider
        collapsible
        breakpoint="lg"
        collapsed={ collapsed }
        collapsedWidth="0"
        style={ siderStyle }
        trigger={ null }
      >
        <Flex
          vertical
          justify="space-between"
          style={ { height: '100%' } }
        >
          <div>
            <div className='d-flex flex-column align-items-center justify-content-center my-20'>
              <Avatar
                size={ 160 }
                src="/kallpa-logo.png"
                style={ { backgroundColor: 'whitesmoke' } }
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
      </Sider>
      <Layout style={ { marginLeft: collapsed ? 0 : 200, transition: 'all .2s ease-in-out, background-color 0s' } }>
        <Header
          style={ {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            background: colorBgLayout,
            padding: 0
          } }
        >
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
              <Title
                className='mb-0'
                level={ 3 }
              >
                {viewTitle}
              </Title>
            </Flex>
            <HeaderToolbar />
          </Flex>
        </Header>
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
  )
}

export default MainLayout
