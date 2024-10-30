import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import htmlReactParser from 'html-react-parser'
import { Button, Card, Col, Divider, Flex, Row, Spin, theme, Tooltip } from 'antd'
import Title from 'antd/es/typography/Title'
import TextEditor from '../components/text-editor/TextEditor'
import DocumentDetail from '../components/DocumentDetail'

import { getExpedient } from '../services/api.service'
import { Expedient } from '@expedients/types'
import { dateUtil } from '../utils'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import DocumentUpload from '../components/DocumentUpload'

const dom = document
let mentions: HTMLElement[] | Element[] = []

export interface DocumentFile {
  id: string;
  showDetail: boolean;
  showUpload: boolean;
  isLoading: boolean;
  name?: string;
  action: 'create' | 'edit';
}

const ExpedientView: React.FC = () => {
  const { id } = useParams()
  const [documentFile, setDocumentFile] = useState<DocumentFile>({
    id: '',
    showDetail: false,
    showUpload: false,
    isLoading: false,
    action: 'create'
  })

  const { token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD, colorTextSecondary } } = theme.useToken()
  const sectionStyle = {
    backgroundColor: colorBgContainer, borderRadius: borderRadiusLG, padding: paddingMD, marginBottom: marginMD
  }

  const { data, error } = useQuery({
    queryKey: ['expedient', id],
    queryFn: (): Promise<Expedient> => getExpedient(id!),
    refetchOnMount: true
  })

  // TODO: reply on expedientsView
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
    if (!(event.target instanceof HTMLSpanElement)) {
      return
    }
    setDocumentFile(prev => ({ ...prev, showDetail: true, action: 'create', id: event.target.dataset['id'] }))
  }

  if (!data) {
    return <div>
      {JSON.stringify(error?.message)}
    </div>
  }

  return (
    <div>
      <Row
        gutter={ 20 }
        style={ { margin: paddingMD } }
      >
        <Col
          md={ { span: 16, order: 1 } }
          xs={ { span: 24, order: 2 } }
        >
          <Spin
            spinning={ documentFile.isLoading }
            tip="Consultando..."
          >
            <div style={ sectionStyle }>
              <Row>
                <Col
                  md={ 12 }
                  sm={ 24 }
                >
                  <Title
                    className='mb-0'
                    level={ 5 }
                  >
                    {'Expediente: '}
                    {data.code}
                  </Title>
                </Col>

                <Col
                  className='d-flex align-items-end flex-column'
                  md={ 12 }
                  sm={ 24 }
                  style={ { color: colorTextSecondary } }
                >

                  <TextEditor expedientId={ data.id } />
                </Col>
              </Row>

              <Divider className='my-12' />

              <Row className='mt-20'>
                <Col
                  md={ 16 }
                  sm={ 24 }
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
                    {' ' + dateUtil.formatDate(data.updatedAt)}
                  </p>

                  <p className='mb-12'>
                    <strong>Hecho por:</strong>
                    {' ' + data.updatedByUser?.firstName + ' ' + data.updatedByUser?.lastName}
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
                </Col>

                <Col
                  className='d-flex align-items-end flex-column'
                  md={ 8 }
                  sm={ 24 }
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
                  sm={ 24 }
                >
                  <strong>Informes:</strong>
                </Col>
              </Row>

              {
                data.reviews.map(review =>
                  <Card
                    className='mb-20'
                    key={ review.id }
                    title={ data.updatedByUser?.firstName + ' ' + data.updatedByUser?.lastName }
                    extra={ <div
                      className='d-flex align-items-end flex-column'
                      style={ { color: colorTextSecondary } }
                    >
                      <em>
                        {' ' + dateUtil.formatDate(review.createdAt)}
                      </em>
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
          <div
            style={ sectionStyle }
          >
            <div className='d-flex justify-content-between flex-wrap'>
              <Title
                className='mb-0'
                level={ 5 }
              >
                Documentos
              </Title>
              <Button
                icon={ <PlusOutlined /> }
                type='primary'
                onClick={ () => setDocumentFile((prev) => ({ ...prev, showUpload: true, action: 'create', id: id! })) }
              >
                Adjuntar documento
              </Button>
            </div>

            <Divider className='my-12' />

            <Spin
              spinning={ documentFile.isLoading }
              tip="Consultando..."
            >
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
                        <p
                          className='mr-16'
                          style={ { wordBreak: 'break-all' } }
                          onClick={ () => (setDocumentFile((prev) => ({ ...prev, showDetail: true, action: 'create', id: document.id }))) }
                        >
                          {document.name}
                        </p>
                        <Tooltip title="Reemplazar">
                          <Button
                            icon={ <EditOutlined /> }
                            shape="circle"
                            onClick={ () => (setDocumentFile((prev) => ({ ...prev, showUpload: true, action: 'edit', name: document.name, id: document.id }))) }
                          >
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  )
                }
              </Flex>
            </Spin>
          </div>
        </Col>
      </Row>

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
    </div>
  )
}

export default ExpedientView
