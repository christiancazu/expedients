import { useMutation, useQuery } from '@tanstack/react-query'
import { Modal, Typography } from 'antd'
import React, { SetStateAction, useEffect, useState } from 'react'
import { Document } from '@expedients/shared'
import { dateUtil, getSpritePositionX } from '../../utils'
import { downloadDocument, getDocument } from '../../services/api.service'
import { DownloadOutlined } from '@ant-design/icons'
import { DocumentFile } from '../../views/ExpedientView'
import { Grid } from 'antd'

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import useNotify from '../../hooks/useNotification'
import '@cyntler/react-doc-viewer/dist/index.css'
import ButtonBase from '../base/ButtonBase'

import './document-detail.scss'

interface Props {
  documentFile: DocumentFile;
  setDocumentFile: React.Dispatch<SetStateAction<DocumentFile>>;
}

const { Title } = Typography
const { useBreakpoint } = Grid

export default function DocumentDetail({ documentFile, setDocumentFile }:Props): React.ReactNode {
  const { mutate: handleDownload, isPending } = useMutation({
    mutationKey: ['download-document'],
    mutationFn: () => downloadDocument(data?.url as string),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data?.name as string
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    onError: () => {
      notify({ type: 'error', message: 'Error al descargar el documento' })
    }
  })

  const notify = useNotify()
  const screens = useBreakpoint()

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const { data, isSuccess } = useQuery<Document & { link: string }>({
    queryKey: ['document', documentFile.id],
    queryFn: () => getDocument(documentFile.id)
  })

  useEffect(() => {
    if (isSuccess) {
      setShowDetailModal(true)
    }
  }, [isSuccess])

  const handleClose = () => {
    setShowDetailModal(false)
    setTimeout(() => {
      setDocumentFile((prev) => ({ ...prev, showDetail: false }))
    }, 500)
  }

  return (
    <Modal
      maskClosable={ !isPending }
      open={ showDetailModal }
      footer={ [
        <ButtonBase
          cancel
          disabled={ isPending }
          key="cancel"
          onClick={ handleClose }
        >
          Cancelar
        </ButtonBase>,
        <ButtonBase
          secondary
          key="preview"
          onClick={ () => setShowPreviewModal(true) }
        >
          Vista previa
        </ButtonBase>,
        <ButtonBase
          primary
          icon={ <DownloadOutlined /> }
          key="download"
          loading={ isPending }
          onClick={ () => handleDownload() }
        >
          Descargar
        </ButtonBase>
      ] }
      title={ data &&
        <div className='d-flex'>
          <div
            style={ {
              background: 'url(/docs.png) no-repeat',
              height: 32,
              width: 32,
              backgroundPositionX: getSpritePositionX(data!.extension),
              display: 'inline-block'
            } }
          />
          <Title
            className='text-primary ml-8'
            level={ 3 }
          >
            {data?.name}
          </Title>
        </div> }
      onCancel={ handleClose }
    >
      <div className='mb-20'>
        <p className='mb-12'>
          <strong>Creado por: </strong>
          {data?.createdByUser?.firstName}
          {' '}
          {data?.createdByUser?.surname}
          <em>
            {' el: '}
            {dateUtil.formatDate(data?.createdAt as string)}
          </em>
        </p>

        <p className='mb-12'>
          <strong>Actualizado por: </strong>
          {data?.createdByUser?.firstName}
          {' '}
          {data?.createdByUser?.surname}
          <em>
            {' el: '}
            {dateUtil.formatDate(data?.updatedAt as string)}
          </em>
        </p>
      </div>
      {
        <Modal
          className='document-detail'
          height={ '90vh' }
          maskClosable={ !isPending }
          open={ showPreviewModal }
          style={ { top: 10 } }
          title={ `${data?.name}.${data?.extension}` }
          width={ screens.md ? '80%' : '100%' }
          footer={ [
            <ButtonBase
              cancel
              disabled={ isPending }
              key="back"
              onClick={ () => setShowPreviewModal(false) }
            >
              Cancelar
            </ButtonBase>,
            <ButtonBase
              primary
              icon={ <DownloadOutlined /> }
              key="download"
              loading={ isPending }
              onClick={ () => handleDownload() }
            >
              Descargar
            </ButtonBase>
          ] }
          onCancel={ () => setShowPreviewModal(false) }
        >
          <div style={ { height: '80vh' } }>
            <DocViewer
              documents={ [{ uri: data?.url as string }] }
              language='es'
              pluginRenderers={ DocViewerRenderers }
              prefetchMethod='GET'
            />
          </div>
        </Modal>
      }
    </Modal>
  )
}
