import { Card, Drawer, Typography } from 'antd'
import styled from 'styled-components'

const { Text } = Typography

export const StyledDrawer = styled(Drawer)`
  & .ant-drawer-body {
    padding: var(--ant-padding-md);
  }
`

export const StyledCardNotification = styled(Card)`
  width: 100%;
  & .ant-card-body {
    padding: var(--ant-padding-sm);
  }
`

export const StyledCardNotificationText = styled(Text)<{ lineclamp?: string }>`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${({ lineclamp }) => lineclamp ?? '1'};
  -webkit-box-orient: vertical;
`
