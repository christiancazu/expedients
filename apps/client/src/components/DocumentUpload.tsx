import React, { SetStateAction, useState } from 'react'

import { Button, Modal, Progress, Tooltip, UploadFile, UploadProps } from 'antd'
import { DeleteOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { DocumentFile } from '../views/ExpedientView'
import Dragger from 'antd/es/upload/Dragger'
import { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { UploadChangeParam } from 'antd/es/upload'
import { createDocument, updateDocument } from '../services/api.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../config/queryClient'
import { Document, Expedient } from '@expedients/shared'
import useNotify from '../composables/useNotification'
import { useParams } from 'react-router-dom'

interface Props {
  documentFile: DocumentFile;
  setDocumentFile: React.Dispatch<SetStateAction<DocumentFile>>;
}

export type RcCustomRequestOptions<T = any> = Parameters<
  Exclude<UploadProps<T>['customRequest'], undefined>
>[0]

export type UploadRequestFile<T = any> = Exclude<UploadProps<T>['fileList'], undefined>[0]
export type BeforeUploadValueType<T = any> = UploadChangeParam<UploadFile<T>>

const props: UploadProps = {
  name: 'file',
  multiple: false
}

const DocumentUpload: React.FC<Props> = ({ documentFile, setDocumentFile }) => {
  const { id } = useParams()
  const [open, setOpen] = useState(true)
  const notify = useNotify()

  const [defaultFileList, setDefaultFileList] = useState<UploadRequestFile[]>([])
  const [progress, setProgress] = useState(0)
  const [requestSetup, setRequestSetup] = useState<{ formData: FormData; config: AxiosRequestConfig }>()

  const { mutate, isPending } = useMutation({
    mutationKey: ['expedient', documentFile.id],
    mutationFn: () => documentFile.action === 'create'
      ? createDocument(requestSetup!.formData, requestSetup!.config)
      : updateDocument(requestSetup!.formData, requestSetup!.config),

    onSuccess: (newDocument: Document) => {
      let updatedDocuments = queryClient.getQueryData<Expedient>(['expedient', id])?.documents || []

      if (documentFile.action === 'create') {
        updatedDocuments = [{ ...newDocument }, ...updatedDocuments]
      } else {
        updatedDocuments = updatedDocuments.map(doc => doc.id === newDocument.id ? newDocument : doc)
      }

      queryClient.setQueryData(
        ['expedient', id],
        (old: Expedient) => {
          return {
            ...old,
            documents: updatedDocuments
          }
        })

      notify({ message: 'Documento adjuntado con éxito' })
      handleClose()

    },
    onError: (err) => {
      notify({ message: JSON.stringify(err), type: 'error' })
    }
  })

  const onChange = (info: BeforeUploadValueType) => {
    if (!info.fileList.length) {
      setDefaultFileList([])
    } else {
      setDefaultFileList(prev => [...prev, info.file])
    }
  }

  const customRequest = (options: RcCustomRequestOptions) => {
    const { file, onProgress } = options

    defaultFileList.push(file as UploadRequestFile)

    const fmData = new FormData()
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: AxiosProgressEvent) => {
        const percent = Math.floor((event.loaded / (event.total || 1)) * 100)
        setProgress(percent)
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000)
        }
        onProgress!({ percent: (event.loaded / (event.total || 1)) * 100 })
      }
    }

    fmData.append('file', file)
    fmData.append('expedientId', documentFile.id)

    setRequestSetup((prev) => ({ ...prev, formData: fmData, config }))
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setDocumentFile((prev) => ({ ...prev, showUpload: false }))
    }, 500)
  }

  return (
    <Modal
      maskClosable={ false }
      open={ open }
      title={ documentFile.action === 'create' ? 'Adjuntar documento' : 'Reemplazar documento' }
      footer={ [
        <Button
          key="back"
          onClick={ handleClose }
        >
          Cancelar
        </Button>,
        <Button
          disabled={ !defaultFileList.length }
          icon={ <UploadOutlined /> }
          key="download"
          loading={ isPending }
          type="primary"
          onClick={ () => mutate() }
        >
          {documentFile.action === 'create' ? 'Adjuntar' : 'Reemplazar'}
        </Button>
      ] }
      onCancel={ handleClose }
    >
      <div className='my-20'>
        {
          documentFile.action === 'edit' &&
            <>
              <p>Documento actual:</p>
              <div className='text-link'>
                <p>
                  {documentFile.name}
                </p>
              </div>
            </>
        }

        <Dragger
          { ...props }
          customRequest={ customRequest }
          defaultFileList={ defaultFileList }
          maxCount={ 1 }
          itemRender={ (_, file, fileList, actions) => fileList.length ? <div className='mt-20'>
            <p>Nuevo documento:</p>
            <div className='text-link d-flex justify-content-between align-items-center'>
              <p>
                {file.name}
              </p>
              <Tooltip title="Eliminar archivo">
                <Button
                  color='danger'
                  icon={ <DeleteOutlined /> }
                  shape="circle"
                  variant="outlined"
                  onClick={ () => actions.remove() }
                />
              </Tooltip>
            </div>
          </div> : null }
          onChange={ onChange }
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Haga click o arrastre el archivo a esta área para cargarlo.</p>
        </Dragger>

        <div
          className='pb-12'
          style={ { position: 'relative' } }
        >
          <div style={ { position: 'absolute', width: '100%' } }>
            {progress > 0 ? <Progress percent={ progress } /> : null}
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default DocumentUpload
