import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryClient } from '../config/queryClient'

interface ConfirmModal {
  isOpen: boolean;
  isLoading: boolean;
  cb: (...args: any[]) => void;
  args: any;
}

export function useConfirmModal(isProcessing = false) {
  const modal = useQuery<ConfirmModal>({
    queryKey: ['confirm-modal'],
    enabled: false,
    initialData: {
      isOpen: false,
      isLoading: false,
      cb: () => ({}),
      args: null
    }
  }).data

  useEffect(() => {
    if (!isProcessing) {
      closeConfirmModal()
    }

    return () => {
      queryClient.resetQueries({ queryKey: ['confirm-modal'], exact: true })
    }
  }, [isProcessing])

  const setDataConfirmModal = (data: any) => {
    queryClient.setQueryData<ConfirmModal>(['confirm-modal'], (prev) => ({ ...prev, ...data }))
  }

  const closeConfirmModal = () => {
    setDataConfirmModal({ isOpen: false, isLoading: false })
  }

  return {
    isLoading: modal?.isLoading,
    isConfirmModalOpen: modal?.isOpen,
    closeConfirmModal,
    openConfirmModal(cb: any, args: any) {
      setDataConfirmModal({ cb, args, isOpen: true  })
    },
    execCbConfirmModal() {
      modal.cb?.(...[modal.args])
    }
  }
}
