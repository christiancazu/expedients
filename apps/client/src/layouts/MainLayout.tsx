import React from 'react'
import { FolderOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { Layout, Menu, theme } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'

const { Content, Sider } = Layout

const MainLayout: React.FC = () => {
  const { token: { borderRadiusLG } } = theme.useToken()

  const navigate = useNavigate()

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
      <Sider collapsible>
        <Menu
          defaultSelectedKeys={ ['1'] }
          items={ items }
          mode="inline"
          theme="dark"
        />
      </Sider>
      <Layout>
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
