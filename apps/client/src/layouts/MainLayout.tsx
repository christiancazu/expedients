import React from 'react'
import { FolderOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { Avatar, Button, Flex, Layout, Menu, theme } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import useUserState from '../composables/useUserState'
import useNotify from '../composables/useNotification'

const { Content, Sider } = Layout

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable'
}

const MainLayout: React.FC = () => {
  const { token: { borderRadiusLG } } = theme.useToken()
  const { user, purgeUserSession } = useUserState()

  const navigate = useNavigate()
  const notify = useNotify()

  const items: MenuProps['items'] = [
    FolderOutlined
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `Expedientes`,
    onClick: () => navigate('/expedients')
  }))

  return (
    <Layout
      hasSider
      style={ { minHeight: '100vh' } }
    >
      <Sider
        style={ siderStyle }
      >
        <Flex
          vertical
          justify="space-between"
          style={ { height: '100%' } }
        >
          <div>
            <div className='d-flex flex-column align-items-center justify-content-center my-20'>
              <Avatar
                icon={ <UserOutlined /> }
                size={ 64 }
                style={ { backgroundColor: 'whitesmoke' } }
              />

              <div
                className='my-20'
                style={ { color: 'white' } }
              >
                {user?.firstName} 
                {' '}
                {` ${user?.lastName}`}
              </div>
            </div>

            <Menu
              defaultSelectedKeys={ ['1'] }
              items={ items }
              mode="inline"
              theme="dark"
            />
          </div>
          <div className='mb-20 d-flex justify-content-center'>
            <Button
              color='default'
              icon={ <LogoutOutlined /> }
              style={ { color: '#f5f5f5' } }
              type='text'
              onClick={ ()=>(purgeUserSession(), notify({ message: 'La sesión ha sido finalizada', type: 'info' })) }
            >
              Cerrar sesión
            </Button>
          </div>
        </Flex>
      </Sider>
      <Layout style={ { marginInlineStart: 200 } }>
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
