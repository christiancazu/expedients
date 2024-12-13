import { ConfigProvider, theme } from 'antd'
import esEs from 'antd/locale/es_ES'
import type { ReactNode } from 'react'
import ConfirmModal from './components/ConfirmModal'
import useToogleTheme from './hooks/useToogleTheme'

import variables from './assets/styles/_export.module.scss'

const {
	colorBgContainerDark,
	colorBgContainerLight,
	colorBgLayoutDark,
	colorBgLayoutLight,
} = variables
interface Props {
	children: ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
	const { isDarkTheme } = useToogleTheme()

	return (
		<ConfigProvider
			locale={esEs}
			theme={{
				cssVar: true,
				algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					fontFamily: 'Assistant',
					colorBgLayout: isDarkTheme ? colorBgLayoutDark : colorBgLayoutLight,
					colorBgContainer: isDarkTheme
						? colorBgContainerDark
						: colorBgContainerLight,
				},
			}}
		>
			{children}
			<ConfirmModal />
		</ConfigProvider>
	)
}

export default ThemeProvider
