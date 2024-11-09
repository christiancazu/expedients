import { ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import useToogleTheme from './composables/useToogleTheme'
import ConfirmModal from './components/ConfirmModal'

interface Props {
  children: ReactNode;
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const { currentTheme } = useToogleTheme()

  return <ConfigProvider
    theme={ {
      algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        fontFamily: 'Assistant'
      }
    } }
  >
    {children}

    <ConfirmModal />
  </ConfigProvider>
}

export default ThemeProvider
