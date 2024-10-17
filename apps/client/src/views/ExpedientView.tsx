import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { getExpedient } from '../composables/useQuery'
import { Expedient } from 'types'
import {  Card, Col, Divider, Row, theme } from 'antd'
import { dateUtil } from '../utils'
import Title from 'antd/es/typography/Title'

const ExpedientView: React.FC = () => {
  const { id } = useParams()

  const { token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD, colorTextSecondary } } = theme.useToken()

  const { data, error } = useQuery({ queryKey: ['expedient', id], queryFn: (): Promise<Expedient> => getExpedient(id!) })

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

            <Divider dashed />

            <Row>
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

            <p className='mb-12'>
              <strong>Revisiones:</strong>
            </p>

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
                    <div>
                      Actualizado el:
                      <em>
                        {' ' + dateUtil.formatDate(review.createdAt)}
                      </em>
                    </div>
                  </div> }
                >
                  <p>
                    {review.description}
                  </p>
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
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ExpedientView
