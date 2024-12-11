import { SetStateAction, useState } from 'react'
import { Avatar, Button, Flex, Modal, Typography } from 'antd'
import { useEvents } from '../../hooks/useEvents'
import { StyledCardNotification, StyledCardNotificationText, StyledDrawer } from './styled'
import { NotificationOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useUserState from '../../hooks/useUserState'
import ButtonBase from '../base/ButtonBase'
import Title from 'antd/es/typography/Title'

interface Props {
  drawer: boolean
  setDrawer: React.Dispatch<SetStateAction<boolean>>
}

const { Text } = Typography

export default function DrawerEvents({ drawer, setDrawer }: Props): React.ReactNode {
  const { isUserNotificationEnabled } = useUserState()
  const { data } = useEvents()

  const navigate = useNavigate()

  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <>
      <StyledDrawer
        open={ drawer }
        title={ <Flex justify='end'>
          <Button
            icon={ <NotificationOutlined /> }
            type={ isUserNotificationEnabled ? 'default' : 'primary' }
            onClick={ () => setIsModalVisible(true) }
          >
            {isUserNotificationEnabled ? `Desactivar Notificaciones` : 'Activar Notificaciones'}
          </Button>
        </Flex> }
        onClose={ () => setDrawer(false) }
      >
        <Title level={ 3 }>Eventos</Title>
        {
          data?.map((event) =>
            <StyledCardNotification
              hoverable
              className='mb-12'
              key={ event.id }
            >
              <Flex
                onClick={ () => {
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

      <Modal
        closable={ false }
        open={ isModalVisible }
        title="Notificaciones"
        footer={ [
          <ButtonBase
            primary
            icon={ <NotificationOutlined /> }
            key="activate"
            onClick={ () => setIsModalVisible(false) }
          >
            Entendido
          </ButtonBase>
        ] }
      >
        <Title
          className='my-20'
          level={ 3 }
        >
          Es necesario
          {' '}
          {isUserNotificationEnabled ? 'desactivar' : 'activar'}
          {' '}
          las notificaciones de forma manual en el navegador
        </Title>
      </Modal>
    </>
  )
}
