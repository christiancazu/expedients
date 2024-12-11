import { PropsWithChildren } from 'react'
import { Popconfirm, Tooltip, PopconfirmProps } from 'antd'


export default function PopconfirmDelete(
  { children, ...props }: PropsWithChildren<Omit<PopconfirmProps, 'title'>>
): React.ReactNode {
  return (
    <Popconfirm
      cancelText="No"
      description="¿Está seguro de eliminar?"
      okText="Si"
      title="Confirmación"
      { ...props }
    >
      <Tooltip
        placement="bottom"
        title="Eliminar"
      >
        {children}
      </Tooltip>
    </Popconfirm>
  )
}
