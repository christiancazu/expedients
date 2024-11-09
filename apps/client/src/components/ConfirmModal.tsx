import { useId } from 'react'
import { Modal } from 'antd'
import { useConfirmModal } from '../composables/useConfirmModal'
import ButtonBase from './base/ButtonBase'

export default function ConfirmModal(): React.ReactNode {
  const { isConfirmModalOpen, isLoading, closeConfirmModal, execCbConfirmModal }
  = useConfirmModal()

  return (
    <Modal
      maskClosable={ !isLoading }
      open={ isConfirmModalOpen }
      title="Confirmación"
      footer={ [
        <ButtonBase
          cancel
          disabled={ isLoading }
          key={ useId() }
          onClick={ closeConfirmModal }
        />,
        <ButtonBase
          primary
          key={ useId() }
          loading={ isLoading }
          onClick={ execCbConfirmModal }
        >
          Confirmar
        </ButtonBase>
      ] }
      onCancel={ closeConfirmModal }
    >
      <p>
        ¿Está seguro de realización esta acción?
      </p>
    </Modal>
  )
}
