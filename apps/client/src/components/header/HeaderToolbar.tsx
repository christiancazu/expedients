import { useMemo, useState } from 'react'
import { Avatar, Badge, Dropdown, MenuProps, Space, Switch, Grid, Tooltip } from 'antd'
import { DownOutlined, LogoutOutlined, MoonOutlined, NotificationOutlined, ProfileOutlined, SettingOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'

import useUserState from '../../hooks/useUserState'
import useToogleTheme from '../../hooks/useToogleTheme'
import useNotify from '../../hooks/useNotification'
import DrawerEvents from './DrawerEvents'

import './header-toolbar.scss'

const { useBreakpoint } = Grid

export default function HeaderToolbar(): React.ReactNode {
  const notify = useNotify()

  const screens = useBreakpoint()
  const { isDarkTheme, toggleTheme } = useToogleTheme()

  const { user, purgeUserSession } = useUserState()
  const [drawer, setDrawer] = useState(true)

  const items: MenuProps['items'] = useMemo(() => ([
    {
      label: 'Mi perfil',
      key: 'settings',
      icon: <ProfileOutlined style={ { fontSize: 16 } } />
    },
    ...!screens.md ? [
      {
        label: 'Eventos',
        key: 'eventos',
        onClick: () => setDrawer(true),
        icon: <Badge
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
    ] : [],
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
    <>
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
              <Tooltip title='Eventos'>
                <Badge
                  className='cursor-pointer'
                  onClick={ () => setDrawer(true) }
                >
                  <Avatar icon={ <NotificationOutlined /> } />
                </Badge>
              </Tooltip>
            </div>
          </>
        }

        <Dropdown
          className='header-user-info'
          menu={ { items } }
          trigger={ ['click'] }
        >
          <div className='header-user-info__block'>
            <div className='header-user-info__block__avatar'>
              <Avatar
                icon={ <UserOutlined /> }
                size={ 32 }
              />
            </div>
            <div className='header-user-info__block__name'>
              <span>
                {user?.firstName}
                {' '}
                {user?.surname}
              </span>
              <span>
                {
                  screens.md
                    ? <DownOutlined style={ { fontSize: 12 } } />
                    : <SettingOutlined style={ { fontSize: 12 } } />
                }
              </span>
            </div>
          </div>
        </Dropdown>
      </Space>
      <DrawerEvents
        drawer={ drawer }
        setDrawer={ setDrawer }
      />
    </>
  )
}
