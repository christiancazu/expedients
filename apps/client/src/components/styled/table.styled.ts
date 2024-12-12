import { Table } from 'antd'
import styled, { WebTarget } from 'styled-components'
import { Styled } from 'styled-components/dist/constructors/constructWithOptions'

type StyledComponent = Styled<
  'web',
  WebTarget,
  Record<never, never>,
  Record<never, never>
>

export const StyledTable = styled(Table)`
  border-top-right-radius: var(--ant-table-header-border-radius);
  overflow: hidden !important;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    border: 1px solid var(--ant-table-border-color);
  }
` satisfies StyledComponent & typeof Table
