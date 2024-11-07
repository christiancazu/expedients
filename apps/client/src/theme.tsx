import { ReactNode } from 'react'
import { Button, ConfigProvider, Modal, theme } from 'antd'
import { useConfirmModal } from './composables/useConfirmModal'

interface Props {
  children: ReactNode;
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const { isConfirmModalOpen, isLoading, closeConfirmModal, execCbConfirmModal }
   = useConfirmModal()

  return <ConfigProvider
    theme={ {
      algorithm: theme.darkAlgorithm,
      token: {
        fontFamily: 'Assistant'
      }
    } }
  >
    {children}

    <Modal
      maskClosable={ !isLoading }
      open={ isConfirmModalOpen }
      title="Confirmación"
      footer={ [
        <Button
          disabled={ isLoading }
          key="back"
          onClick={ closeConfirmModal }
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          loading={ isLoading }
          type="primary"
          onClick={ execCbConfirmModal }
        >
          Confirmar
        </Button>
      ] }
    >
      <p>
        ¿Está seguro de realización esta acción?
      </p>
    </Modal>
  </ConfigProvider>
}

export default ThemeProvider
