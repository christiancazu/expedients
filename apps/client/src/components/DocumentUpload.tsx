import React, { SetStateAction, useState } from 'react'

import { Button, Checkbox, Form, Modal, Progress, Tooltip, UploadFile, UploadProps } from 'antd'
import { DeleteOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { DocumentFile } from '../views/ExpedientView'
import Dragger from 'antd/es/upload/Dragger'
import { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { UploadChangeParam } from 'antd/es/upload'
import { createDocument, updateDocument } from '../services/api.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../config/queryClient'
import { Document, Expedient, FIELD } from '@expedients/shared'
import useNotify from '../hooks/useNotification'
import { useParams } from 'react-router-dom'
import TextArea from 'antd/es/input/TextArea'
import { useForm } from 'antd/es/form/Form'
import Title from 'antd/es/typography/Title'
import { getSpritePositionX } from '../utils'

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
  const notify = useNotify()
  const [form] = useForm()

  const [open, setOpen] = useState(true)
  const [name, setName] = useState(documentFile.name || '')
  const [checkChangeName, setCheckChangeName] = useState<boolean>(documentFile.action !== 'edit')
  const [defaultFileList, setDefaultFileList] = useState<UploadRequestFile[]>([])
  const [requestSetup, setRequestSetup] = useState<{ formData: FormData; config: AxiosRequestConfig }>()
  const [progress, setProgress] = useState(0)

  const { mutate, isPending } = useMutation({
    mutationKey: ['expedient', documentFile.id],
    mutationFn: () => {
      requestSetup?.formData.set('name', name)

      return documentFile.action === 'create'
        ? createDocument(requestSetup!.formData, requestSetup!.config)
        : updateDocument(requestSetup!.formData, requestSetup!.config)
    },

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

    const formData = new FormData()
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

    formData.append('file', file)
    formData.append('expedientId', documentFile.id)

    setRequestSetup((prev) => ({ ...prev, formData, config }))
  }

  const handleClose = () => {
    setName('')
    setOpen(false)
    setTimeout(() => {
      setDocumentFile((prev) => ({ ...prev, name: '', showUpload: false }))
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
          disabled={ !defaultFileList.length || !name }
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
            <div className='d-flex'>
              <div
                style={ {
                  background: 'url(/docs.png) no-repeat',
                  height: 32,
                  width: 32,
                  backgroundPositionX: getSpritePositionX(documentFile?.extension as string),
                  display: 'inline-block'
                } }
              />
              <Title
                className='text-primary ml-8'
                level={ 3 }
              >
                {documentFile?.name}
              </Title>
            </div>
        }

        <Dragger
          { ...props }
          className='my-12'
          customRequest={ customRequest }
          defaultFileList={ defaultFileList }
          maxCount={ 1 }
          itemRender={ (_, file, fileList, actions) => fileList.length ? <div className='mt-12'>
            <p>Nuevo documento:</p>
            <div className='text-link d-flex justify-content-between align-items-center'>
              <p>
                {file.name}
              </p>
              <Tooltip title="Eliminar documento">
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
          <p className="ant-upload-text">Haga click o arrastre el documento a esta área para cargarlo.</p>
        </Dragger>

        <div
          className='my-12'
          style={ { position: 'relative' } }
        >
          <Form
            autoComplete='off'
            disabled={ !checkChangeName }
            form={ form }
            initialValues={ { name: documentFile.name } }
            layout='vertical'
            onChange={ () => setName(form.getFieldValue('name')) }
          >
            <Form.Item
              label="Nombre de documento"
              name="name"
              rules={ [{ required: true, message: 'El campo es requerido' }] }
            >
              <TextArea
                allowClear
                showCount
                maxLength={ FIELD.DOCUMENT_NAME_MAX_LENGTH }
                placeholder="Ingrese el nombre del documento"
              />
            </Form.Item>
          </Form>

          {
            documentFile.action === 'edit' &&
              <Checkbox
                checked={ checkChangeName }
                style={ { position: 'absolute', top: 0, right: '-8px' } }
                onChange={ (e) => setCheckChangeName(e.target.checked) }
              >
                Cambiar nombre
              </Checkbox>
          }
        </div>

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
