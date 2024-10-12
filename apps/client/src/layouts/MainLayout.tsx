import React from 'react'
import { AppstoreOutlined, } from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { Layout, Menu, theme } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content, Sider } = Layout

const items: MenuProps['items'] = [
  AppstoreOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}))

const MainLayout: React.FC = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()

  return (
    <Layout style={ { minHeight: '100vh' } }>
      <Sider collapsible>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={ ['1'] }
          items={ items }
        />
      </Sider>
      <Layout>
        <Content
          style={ {
            margin: '16px',
            padding: '16px',
            backgroundColor: colorBgContainer,
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
