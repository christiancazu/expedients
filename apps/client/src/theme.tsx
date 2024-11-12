import { ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import useToogleTheme from './composables/useToogleTheme'
import ConfirmModal from './components/ConfirmModal'
import esEs from 'antd/locale/es_ES'

import variables from './assets/styles/_variables.module.scss'

const { colorBgContainerDark, colorBgContainerLight, colorBgLayoutDark, colorBgLayoutLight } = variables
interface Props {
  children: ReactNode;
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const { isDarkTheme } = useToogleTheme()

  return <ConfigProvider
    locale={ esEs }
    theme={ {
      cssVar: true,
      algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        fontFamily: 'Assistant',
        colorBgLayout: isDarkTheme ? colorBgLayoutDark : colorBgLayoutLight,
        colorBgContainer: isDarkTheme ? colorBgContainerDark : colorBgContainerLight
      }
    } }
  >
    {children}
    <ConfirmModal />
  </ConfigProvider>
}

export default ThemeProvider
