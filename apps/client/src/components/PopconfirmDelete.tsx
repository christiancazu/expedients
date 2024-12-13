import { Popconfirm, type PopconfirmProps, Tooltip } from 'antd'
import type { PropsWithChildren } from 'react'

export default function PopconfirmDelete({
	children,
	...props
}: PropsWithChildren<Omit<PopconfirmProps, 'title'>>): React.ReactNode {
	return (
		<Popconfirm
			cancelText="No"
			description="¿Está seguro de eliminar?"
			okText="Si"
			title="Confirmación"
			{...props}
		>
			<Tooltip placement="bottom" title="Eliminar">
				{children}
			</Tooltip>
		</Popconfirm>
	)
}
