import { Avatar, Badge, Dropdown, MenuProps, Space, Switch } from 'antd'
import { DownOutlined, LogoutOutlined, MoonOutlined, NotificationOutlined, ProfileOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'

import useUserState from '../../composables/useUserState'
import useToogleTheme from '../../composables/useToogleTheme'
import useNotify from '../../composables/useNotification'

import './header-toolbar.scss'

export default function HeaderToolbar(): React.ReactNode {
  const notify = useNotify()


  const { isDarkTheme, toggleTheme } = useToogleTheme()

  const { user, purgeUserSession } = useUserState()

  const items: MenuProps['items'] = [
    {
      label: 'Mi perfil',
      key: 'settings',
      icon: <ProfileOutlined />
    },
    {
      type: 'divider'
    },
    {
      label: 'Cerrar sesión',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        purgeUserSession()
        notify({ message: 'La sesión ha sido finalizada', type: 'info' })
      }
    }
  ]

  return (
    <Space
      className='pr-16 d-flex align-items-center'
      size={ 16 }
    >
      <Switch
        checked={ isDarkTheme }
        checkedChildren={ <MoonOutlined /> }
        unCheckedChildren={ <SunOutlined /> }
        onChange={ toggleTheme }
      />

      <div style={ { transform: 'translateY(-2px)' } }>
        <Badge count={ 5 }>
          <Avatar icon={ <NotificationOutlined /> } />
        </Badge>
      </div>

      <Dropdown
        className='header-user-info'
        menu={ { items } }
        trigger={ ['click'] }
      >
        <div className='d-flex'>
          <Avatar icon={ <UserOutlined /> } />
          <span className='header-user-info__name'>
            {user?.firstName}
            {' '}
            {user?.lastName}
          </span>
          <DownOutlined style={ { fontSize: 12 } } />
        </div>
      </Dropdown>
    </Space>
  )
}
