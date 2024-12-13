import { ConfigProvider } from 'antd'
import type React from 'react'

interface Props {
	children?: React.ReactNode
}

export const TableBase: React.FC<Props> = ({ children }) => (
	<ConfigProvider
		theme={{
			components: { Table: { cellPaddingInline: 16, cellPaddingBlock: 8 } },
		}}
	>
		{children}
	</ConfigProvider>
)
