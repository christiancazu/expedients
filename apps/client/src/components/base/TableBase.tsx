import React from 'react'
import { ConfigProvider } from 'antd'

interface Props {
  children?: React.ReactNode;
}

export const TableBase: React.FC<Props> = ({ children }) =>
  <ConfigProvider theme={ { components: { Table: { cellPaddingInline: 16, cellPaddingBlock: 8 } } } }>
    {children}
  </ConfigProvider>
