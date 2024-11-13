import { useMemo } from 'react'
import { Avatar, Badge, Dropdown, MenuProps, Space, Switch, Grid } from 'antd'
import { DownOutlined, LogoutOutlined, MoonOutlined, NotificationOutlined, ProfileOutlined, SettingOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'

import useUserState from '../../composables/useUserState'
import useToogleTheme from '../../composables/useToogleTheme'
import useNotify from '../../composables/useNotification'

import './header-toolbar.scss'

const { useBreakpoint } = Grid

export default function HeaderToolbar(): React.ReactNode {
  const notify = useNotify()

  const screens = useBreakpoint()

  const { isDarkTheme, toggleTheme } = useToogleTheme()

  const { user, purgeUserSession } = useUserState()

  const items: MenuProps['items'] = useMemo(() => ([
    {
      label: 'Mi perfil',
      key: 'settings',
      icon: <ProfileOutlined style={ { fontSize: 16 } } />
    },
    ...!screens.md ? [
      {
        label: 'Notificaciones',
        key: 'notifications',
        icon: <Badge
          count={ 5 }
          size='small'
        >
          <NotificationOutlined style={ { fontSize: 16 } } />
        </Badge>
      },
      {
        label: isDarkTheme ? 'Tema claro' : 'Tema oscuro',
        key: 'darkTheme',
        icon: isDarkTheme ? <SunOutlined style={ { fontSize: 16 } } /> : <MoonOutlined style={ { fontSize: 16 } } />,
        onClick: toggleTheme
      }
    ]: [],
    {
      type: 'divider'
    },
    {
      label: 'Cerrar sesión',
      key: 'logout',
      icon: <LogoutOutlined style={ { fontSize: 16 } } />,
      onClick: () => {
        purgeUserSession()
        notify({ message: 'La sesión ha sido finalizada', type: 'info' })
      }
    }
  ]), [isDarkTheme, screens])

  return (
    <Space
      wrap
      className='pr-16 d-flex align-items-center'
      size={ 16 }
    >
      {
        screens.md && <>
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
        </>
      }

      <Dropdown
        className='header-user-info'
        menu={ { items } }
        trigger={ ['click'] }
      >
        <div className='d-flex'>
          <Avatar icon={ <UserOutlined /> } />
          <div className='d-flex justify-content-between w-100'>
            <span className='header-user-info__name'>
              {user?.firstName}
              {' '}
              {user?.surname}
            </span>
            {
              screens.md
                ? <DownOutlined style={ { fontSize: 12 } } />
                : <SettingOutlined style={ { fontSize: 12 } } />
            }
          </div>
        </div>
      </Dropdown>
    </Space>
  )
}
