import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import htmlReactParser from 'html-react-parser'

import { Avatar, Button, Card, Col, Divider, Flex, Row, Spin, theme, Tooltip, Typography } from 'antd'
import { CloseOutlined, DeleteOutlined, EditOutlined, NotificationOutlined, PlusOutlined } from '@ant-design/icons'

import Title from 'antd/es/typography/Title'
import TextEditor from '../components/text-editor/TextEditor'
import DocumentDetail from '../components/document/DocumentDetail'
import DocumentUpload from '../components/DocumentUpload'
import { useConfirmModal } from '../hooks/useConfirmModal'
import NavigationBackBtn from '../components/NavigationBackBtn'

import useUserState from '../hooks/useUserState'
import useNotify from '../hooks/useNotification'
import { deleteEvent, deleteExpedientReview, getExpedient, getExpedientEvents } from '../services/api.service'
import { Expedient as ExpedientType, Document as DocumentType, IEvent } from '@expedients/shared'
import { dateUtil, getSpritePositionX } from '../utils'
import { queryClient } from '../config/queryClient'
import ScheduleEvent, { ScheduleEventProps } from '../components/ScheduleEvent'
import { StyledCardNotification, StyledCardNotificationText } from '../components/header/styled'
import { StyledScrollbar } from '../components/StyledScrollbar'
import PopconfirmDelete from '../components/PopconfirmDelete'

const { Text } = Typography

const dom = document
let mentions: HTMLElement[] | Element[] = []

export interface DocumentFile extends Partial<Document> {
  showDetail: boolean
  showUpload: boolean
  isLoading: boolean
  action: 'create' | 'edit'
  id: string
}

interface Document extends DocumentType {
  spritePositionX: number
}

interface Expedient extends ExpedientType {
  documents: Document[]
}

const ExpedientView: React.FC = () => {
  const { id } = useParams()
  const notify = useNotify()
  const { user } = useUserState()
  const [documentFile, setDocumentFile] = useState<DocumentFile>({
    id: '',
    showDetail: false,
    showUpload: false,
    isLoading: false,
    action: 'create'
  })
  const [scheduledEvent, setScheduledEvent] = useState<ScheduleEventProps>({
    expedientId: '',
    code: '',
    show: false
  })

  const { token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD, colorTextSecondary } } = theme.useToken()
  const sectionStyle = {
    backgroundColor: colorBgContainer, borderRadius: borderRadiusLG, padding: paddingMD, marginBottom: marginMD
  }

  const { data, error } = useQuery({
    queryKey: ['expedient', id],
    queryFn: () => getExpedient(id!) as any,
    refetchOnMount: true,
    select: (expedient: Expedient) => {
      expedient.updatedAt = dateUtil.formatDate(expedient.updatedAt)
      expedient.documents = expedient.documents.map(document => ({
        ...document,
        spritePositionX: getSpritePositionX(document.extension),
        updatedAt: dateUtil.formatDate(document.updatedAt)
      }))
      expedient.reviews = expedient.reviews.map(review => ({
        ...review,
        createdAt: dateUtil.formatDate(review.createdAt)
      }))
      return expedient
    }
  })

  const { data: expedientEvents } = useQuery({
    queryKey: ['expedients-events' + id],
    queryFn: () => getExpedientEvents(id!),
    refetchOnMount: true,
    select: (expedient) => {
      expedient.events = expedient.events.map(event => ({
        ...event,
        scheduledAt: dateUtil.formatDate(event.scheduledAt)
      }))
      return expedient
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: deleteExpedientReview,
    onSuccess: (_, reviewId) => {
      notify({ message: 'La revisión ha sido eliminada con éxito' })

      queryClient.setQueryData(
        ['expedient', id],
        (old: Expedient) => {
          return {
            ...old,
            reviews: data?.reviews.filter(review => review.id !== reviewId)
          }
        })
    }
  })

  const { openConfirmModal } = useConfirmModal(isPending)

  const isWritableByUser = user?.id === data?.assignedLawyer?.id || user?.id === data?.assignedAssistant?.id

  useEffect(() => {
    mentions = Array.from(dom.getElementsByClassName('mention'))
    mentions.forEach((element) => {
      element.addEventListener('click', docEventListeners)

      return () => {
        mentions.forEach((element) => {
          element.removeEventListener('click', docEventListeners)
        })
      }
    })
  }, [data])

  const docEventListeners = (event: any) => {
    if (!(event.target instanceof HTMLSpanElement)) return

    setDocumentFile(prev => ({ ...prev, showDetail: true, action: 'create', id: event.target.dataset['id'] }))
  }

  const { mutate: mutateDeleteEvent } = useMutation({
    mutationKey: ['expedient-review-delete'],
    mutationFn: deleteEvent,
    onSuccess: (_, eventId) => {
      notify({ message: 'Evento eliminado con éxito' })

      queryClient.setQueryData(['expedients-events' + id], (expedient: any) => ({
        ...expedient,
        events: expedient.events.filter((event: IEvent) => event.id !== eventId)
      }))
    }
  })

  if (!data) {
    return <div>
      {JSON.stringify(error?.message)}
    </div>
  }

  return (
    <Row gutter={ 16 }>
      <Col
        md={ { span: 16, order: 1 } }
        xs={ { span: 24, order: 2 } }
      >
        <Spin
          spinning={ documentFile.isLoading }
          tip="Consultando..."
        >
          <div style={ sectionStyle }>
            <div className='d-flex justify-content-between flex-wrap'>
              <div className='d-flex align-items-center'>
                <NavigationBackBtn to='/expedients' />
                <Title
                  className='ml-12 mb-0'
                  level={ 5 }
                >
                  {data.code}
                </Title>

              </div>
              {
                isWritableByUser &&
                  <div>
                    <TextEditor expedientId={ data.id } />
                  </div>
              }
            </div>

            <Divider className='my-12' />

            <Row className='mt-20'>
              <Col
                md={ 16 }
                xs={ 24 }
              >
                <p className='mb-12'>
                  <strong>Materia:</strong>
                  {' '}
                  {data.subject}
                </p>

                <p className='mb-12'>
                  <strong>Proceso:</strong>
                  {' '}
                  {data.process}
                </p>


                <p className='mb-12'>
                  <strong>Juzgado:</strong>
                  {' '}
                  {data.court}
                </p>

                <p className='mb-12'>
                  <strong>
                    Última actualización:
                  </strong>
                  {' ' + data.updatedAt}
                </p>

                <p className='mb-12'>
                  <strong className='mb-12'>Partes:</strong>
                </p>
                <div className='mb-12'>
                  {
                    data.parts.map(part =>
                      <p
                        className='mb-8'
                        key={ part.id }
                      >
                        {part.type}
                        {': '}
                        {part.name}
                      </p>
                    )
                  }
                </div>

                <p className='mb-12'>
                  <strong>Creado por:</strong>
                  {' ' + data.createdByUser?.firstName + ' ' + data.createdByUser?.surname}
                </p>

                <p className='mb-12'>
                  <strong className='mb-12'>Asignados:</strong>
                </p>
                <div className='mb-12'>
                  <p className='mb-8'>
                    {'ABOGADO: '}
                    {data.assignedLawyer?.firstName}
                    {' '}
                    {data.assignedLawyer?.surname}
                  </p>
                  <p className='mb-8'>
                    {'ASISTENTE: '}
                    {data.assignedAssistant?.firstName}
                    {' '}
                    {data.assignedAssistant?.surname}
                  </p>
                </div>
              </Col>

              <Col
                className='d-flex align-items-end flex-column'
                md={ 8 }
                xs={ 24 }
              >
                <span className='mb-8'>
                  {data.status.replace('_', ' ')}
                </span>
                <em style={ { color: colorTextSecondary } }>
                  {data.statusDescription}
                </em>
              </Col>
            </Row>

            <Row
              align={ 'middle' }
              className='mb-12'
            >
              <Col
                md={ 12 }
                xs={ 24 }
              >
                <strong>Informes:</strong>
              </Col>
            </Row>

            {
              data.reviews.map(review =>
                <Card
                  className='mb-20'
                  key={ review.id }
                  title={ data.createdByUser?.firstName + ' ' + data.createdByUser?.surname }
                  extra={ <div
                    className='d-flex align-items-end flex-column'
                    style={ { color: colorTextSecondary } }
                  >
                    <div>
                      <em>
                        {' ' + review.createdAt}
                      </em>
                      {
                        review.createdByUser?.id === user?.id &&
                          <Tooltip title="Eliminar">
                            <Button
                              danger
                              className='ml-8'
                              icon={ <DeleteOutlined /> }
                              shape="circle"
                              onClick={ () => openConfirmModal(mutate, review.id) }
                            >
                            </Button>
                          </Tooltip>
                      }
                    </div>
                  </div> }
                >
                  {htmlReactParser(review.description)}
                </Card>
              )
            }
          </div>
        </Spin>
      </Col>
      <Col
        md={ { span: 8, order: 2 } }
        xs={ { span: 24, order: 1 } }
      >
        <div style={ sectionStyle } >
          <div className='d-flex justify-content-between flex-wrap'>
            <Title
              className='mb-0'
              level={ 5 }
            >
              Documentos
            </Title>
            {
              isWritableByUser &&
                <Button
                  icon={ <PlusOutlined /> }
                  type='primary'
                  onClick={ () => setDocumentFile((prev) => ({ ...prev, showUpload: true, action: 'create', id: id! })) }
                >
                  Adjuntar documento
                </Button>
            }
          </div>

          <Divider className='my-12' />

          <Spin
            spinning={ documentFile.isLoading }
            tip="Consultando..."
          >
            <StyledScrollbar style={ { height: data?.documents.length ? 250 : 0 } }>
              <Flex
                vertical
                wrap
                align='start'
              >
                {
                  data.documents.map(document =>
                    <div
                      className='text-link w-100'
                      key={ document.id }
                    >
                      <div className='d-flex justify-content-between align-items-center'>
                        <div
                          className='mr-16'
                          style={ { wordBreak: 'break-all' } }
                          onClick={ () => setDocumentFile((prev) => ({
                            ...prev,
                            showDetail: true,
                            action: 'create',
                            id: document.id
                          })) }
                        >
                          <div className='d-flex align-items-center'>
                            <div
                              style={ { background: 'url(/docs.png) no-repeat', height: 32, width: 32, backgroundPositionX: document.spritePositionX, display: 'inline-block' } }
                            />
                            <div className='ml-8'>
                              <p>
                                {document.name}
                              </p>
                              <p style={ { color: colorTextSecondary } }>
                                {document.updatedAt as string}
                              </p>
                            </div>
                          </div>
                        </div>
                        {
                          isWritableByUser &&
                            <Tooltip title="Reemplazar">
                              <Button
                                icon={ <EditOutlined /> }
                                shape="circle"
                                onClick={ () => (setDocumentFile((prev) => ({
                                  ...prev,
                                  showUpload: true,
                                  action: 'edit',
                                  ...document
                                }))) }
                              >
                              </Button>
                            </Tooltip>
                        }
                      </div>
                    </div>
                  )
                }
              </Flex>
            </StyledScrollbar>
          </Spin>
        </div>
        <div style={ sectionStyle } >
          <div className='d-flex justify-content-between flex-wrap'>
            <Title
              className='mb-0'
              level={ 5 }
            >
              Eventos
            </Title>
            {
              isWritableByUser &&
                <Button
                  icon={ <PlusOutlined /> }
                  type='primary'
                  onClick={ () => setScheduledEvent(() => ({ expedientId: data.id, code: data.code, show: true })) }
                >
                  Programar evento
                </Button>
            }
          </div>

          <Divider className='my-12' />

          <Spin
            spinning={ documentFile.isLoading }
            tip="Consultando..."
          >
            <StyledScrollbar style={ { height: expedientEvents?.events.length ? 250 : 0 } }>
              <Flex
                vertical
                wrap
                align='start'
              >
                {
                  expedientEvents?.events.map(event =>
                    <StyledCardNotification
                      className='mb-12'
                      key={ event.id }
                    >
                      <Flex >
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
                          <Flex justify='space-between'>
                            <StyledCardNotificationText lineclamp='0'>
                              {event.message}
                            </StyledCardNotificationText>
                            <PopconfirmDelete onConfirm={ () => mutateDeleteEvent(event.id) }>
                              <Button
                                danger
                                color='danger'
                                icon={ <CloseOutlined /> }
                                shape='circle'
                                size='small'
                              />
                            </PopconfirmDelete>
                          </Flex>
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
              </Flex>
            </StyledScrollbar>
          </Spin>
        </div>
      </Col>
      {
        documentFile.showDetail &&
          <DocumentDetail
            documentFile={ documentFile }
            setDocumentFile={ setDocumentFile }
          />
      }
      {
        documentFile.showUpload &&
          <DocumentUpload
            documentFile={ documentFile }
            setDocumentFile={ setDocumentFile }
          />

      }
      <ScheduleEvent
        event={ scheduledEvent }
        setEvent={ setScheduledEvent }
      />
    </Row>
  )
}

export default ExpedientView
