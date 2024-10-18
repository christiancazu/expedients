import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { getExpedient } from '../services/api.service'
import { Expedient } from 'types'
import {  Card, Col, Divider, Row, theme } from 'antd'
import Title from 'antd/es/typography/Title'
import TextEditor from '../components/text-editor/TextEditor'

import parse from 'html-react-parser'

import { dateUtil } from '../utils'

const ExpedientView: React.FC = () => {
  const { id } = useParams()

  const { token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD, colorTextSecondary } } = theme.useToken()

  const { data, error } = useQuery({ queryKey: ['expedient', id], queryFn: (): Promise<Expedient> => getExpedient(id!), refetchOnMount: true })

  const sectionStyle = {
    backgroundColor: colorBgContainer, borderRadius: borderRadiusLG, padding: paddingMD, marginBottom: marginMD
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
          md={ 16 }
          sm={ 24 }
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
                  {data?.code}
                </Title>
              </Col>

              <Col
                className='d-flex align-items-end flex-column'
                md={ 12 }
                sm={ 24 }
                style={ { color: colorTextSecondary } }
              >
                <div className='mb-4'>
                  Última actualización:
                  <em>
                    {' ' + dateUtil.formatDate(data.updatedAt)}
                  </em>
                </div>
                <div>
                  Hecho por:
                  <em>
                    {' ' + data.updatedByUser?.firstName + ' ' + data.updatedByUser?.lastName}
                  </em>
                </div>
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
                  {data?.subject}
                </p>

                <p className='mb-12'>
                  <strong>Corte:</strong>
                  {' '}
                  {data?.court}
                </p>

                <p className='mb-12'>
                  <strong className='mb-12'>Partes:</strong>
                </p>
                <div className='mb-12'>
                  {
                    data?.parts.map(part =>
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

              <Col
                className='d-flex justify-content-end'
                md={ 12 }
                sm={ 24 }
              >
                <TextEditor expedientId={ data.id } />
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
                  {parse(review.description)}
                </Card>
              )
            }
          </div>
        </Col>
        <Col
          md={ 8 }
          sm={ 24 }
        >
          <div
            style={ sectionStyle }
          >
            <Title
              className='mb-0'
              level={ 5 }
            >
              Documentos
            </Title>

            <Divider className='my-12' />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ExpedientView
