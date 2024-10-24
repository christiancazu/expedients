import { useQuery } from '@tanstack/react-query'
import { Button, Modal, Typography } from 'antd'
import React, { SetStateAction, useEffect, useState } from 'react'
import { Document } from '@expedients/types'
import { dateUtil } from '../utils'
import { getDocument } from '../services/api.service'
import { DownloadOutlined } from '@ant-design/icons'
import { DocumentFile } from '../views/ExpedientView'

const { Title } = Typography

interface Props {
  documentFile: DocumentFile;
  setDocumentFile: React.Dispatch<SetStateAction<DocumentFile>>;
}

const DocumentDetail: React.FC<Props> = ({ documentFile, setDocumentFile }) => {
  const [open, setOpen] = useState(false)

  const { data, isSuccess } = useQuery<Document & { link?: string }>({
    queryKey: ['document', documentFile.id],
    queryFn: () => getDocument(documentFile.id)
  })

  useEffect(() => {
    if (isSuccess) {
      setOpen(true)
    }
  }, [isSuccess])


  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setDocumentFile((prev) => ({ ...prev, showDetail: false }))
    }, 500)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = data?.link as string
    link.download = data?.name as string
    link.click()
  }

  return (
    <Modal
      open={ open }
      footer={ [
        <Button
          key="back"
          onClick={ handleClose }
        >
          Cancelar
        </Button>,
        <Button
          icon={ <DownloadOutlined /> }
          key="download"
          type="primary"
          onClick={ handleDownload }
        >
          Descargar
        </Button>
      ] }
      title={ <Title
        className='text-primary'
        level={ 3 }
      >
        {data?.name}
      </Title> }
      onCancel={ handleClose }
    >
      <div>
        <p className='mb-12'>
          <strong>Creado por: </strong>
          {data?.createdByUser?.firstName}
          {' '}
          {data?.createdByUser?.lastName}
          <em>
            {' el: '}
            {dateUtil.formatDate(data?.createdAt as Date)}
          </em>
        </p>

        <p className='mb-12'>
          <strong>Actualizado por: </strong>
          {data?.createdByUser?.firstName}
          {' '}
          {data?.createdByUser?.lastName}
          <em>
            {' el: '}
            {dateUtil.formatDate(data?.updatedAt as Date)}
          </em>
        </p>
      </div>
    </Modal>
  )
}

export default DocumentDetail
