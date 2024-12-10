import { SetStateAction } from 'react'
import { Avatar, Flex, Typography } from 'antd'
import { useEvents } from '../../hooks/useEvents'
import { StyledCardNotification, StyledCardNotificationText, StyledDrawer } from './styled'
import { NotificationOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface Props {
  drawer: boolean
  setDrawer: React.Dispatch<SetStateAction<boolean>>
}

const { Text } = Typography

export default function DrawerEvents({ drawer, setDrawer }: Props): React.ReactNode {
  const { data } = useEvents()
  const navigate =useNavigate()

  return (
    <StyledDrawer
      open={ drawer }
      title="Eventos"
      onClose={ () => setDrawer(false) }
    >
      {
        data?.map((event) =>
          <StyledCardNotification
            hoverable
            className='mb-12'
            key={ event.id }
          >
            <Flex
              onClick={ () =>{
                navigate(`/expedients/${event.expedient.id}`)
                setDrawer(false)
              } }
            >
              <Flex>
                <Avatar
                  icon={ <NotificationOutlined /> }
                  size={ 32 }
                  style={ { width: 32, backgroundColor: 'var(--ant-color-warning)' } }
                />
              </Flex>
              <Flex
                vertical
                className='ml-12 w-100'
                justify='space-between'
              >
                <StyledCardNotificationText>
                  {event.message}
                </StyledCardNotificationText>
                <StyledCardNotificationText
                  code
                  lineclamp='2'
                >
                  exp:
                  {' '}
                  {event.expedient.code}
                </StyledCardNotificationText>
                <Text
                  className='d-flex justify-content-end'
                  type='secondary'
                >
                  {event.scheduledAt as string}
                </Text>
              </Flex>
            </Flex>

          </StyledCardNotification>
        )
      }
    </StyledDrawer>
  )
}
