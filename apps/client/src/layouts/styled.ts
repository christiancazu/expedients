import { Drawer } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import styled from 'styled-components'

export const StyledSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  inset-inline-start: 0;
  top: 0;
  z-index: 1;
  bottom: 0;
  background-color: #112545;
  scrollbar-width: 'thin';
  scrollbar-gutter: 'stable';
  transition: min-width .2s ease-in-out, width .2s ease-in-out, max-width .2s ease-in-out;
`

export const StyledHeader = styled(Header)<{$colorBgLayout: string}>`
  position: sticky;
  top: 0;
  z-index: 3;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${$props => $props.$colorBgLayout};
  padding: 0;
`
export const StyledSiderDrawer = styled(Drawer)`
  background: #112545 !important;
  
  & .ant-drawer-header-title {
    justify-content: end;
  }
`
