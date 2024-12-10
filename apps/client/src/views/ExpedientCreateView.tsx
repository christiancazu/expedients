import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Button, Card, Divider, Form, Input, Modal, theme } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { CloseOutlined, FolderAddOutlined } from '@ant-design/icons'

import ExpedientStatusSelect from '../components/ExpedientStatusSelect'
import PartsTypeSelect from '../components/PartsTypeSelect'
import { createExpedient } from '../services/api.service'
import useNotify from '../hooks/useNotification'
import { Expedient } from '@expedients/shared'
import UsersSelect from '../components/UsersSelect'
import NavigationBackBtn from '../components/NavigationBackBtn'

const ExpedientsCreateView: React.FC = () => {
  const { token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD } } = theme.useToken()

  const sectionStyle = {
    backgroundColor: colorBgContainer, borderRadius: borderRadiusLG, padding: paddingMD, marginBottom: marginMD
  }

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [createdExpedient, setCreatedExpedient] = useState<Expedient>()
  const notify = useNotify()
  const [form] = useForm()
  const { mutate, isPending } = useMutation({
    mutationKey: ['expedient-create'],
    mutationFn: () => createExpedient(form.getFieldsValue()),
    onSuccess: (res) => {
      notify({ message: 'Expediente creado con éxito' })
      setCreatedExpedient(prev => ({ ...prev, ...res }))
      setOpen(true)
    },
    onError: ({ status, response }: AxiosError<{message: string}>) => {
      if (status === 422) {
        notify({ message: response?.data?.message as string, type: 'error' })
      }
    }
  })

  return (
    <div style={ sectionStyle }>
      <NavigationBackBtn to='/expedients' />
      <Divider className='my-12' />

      <div
        className='d-flex justify-content-center'
      >
        <Form
          autoComplete="off"
          form={ form }
          labelCol={ { xs: { span: 24 }, lg: { span: 6 } } }
          style={ { width: '100%', maxWidth: 800 } }
          wrapperCol={ { xs: { span: 24 }, lg: { span: 18 } } }
          // onChange={ handleOnChange }
          onFinish={ mutate }
        >
          <Form.Item
            label="Expediente"
            name="code"
            rules={ [{ required: true, message: 'El campo es requerido' }] }
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Materia"
            name="subject"
            rules={ [{ required: true, message: 'El campo es requerido' }] }
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Proceso"
            name="process"
            rules={ [{ required: true, message: 'El campo es requerido' }] }
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Juzgado"
            name="court"
            rules={ [{ required: true, message: 'El campo es requerido' }] }
          >
            <Input />
          </Form.Item>

          <ExpedientStatusSelect
            label={ 'Estado' }
            name={ 'status' }
            rules={ [{ required: true, message: 'El campo es requerido' }] }
          />

          <Form.Item
            label="Descripción de estado"
            name="statusDescription"
          >
            <Input />
          </Form.Item>

          <UsersSelect
            label={ 'Abogado asignado' }
            name={ 'assignedLawyerId' }
          />

          <UsersSelect
            label={ 'Asistente asignado' }
            name={ 'assignedAssistantId' }
          />

          <Form.List
            name="parts"
          >
            {(fields, { add, remove }) => (
              <div style={ { display: 'flex', rowGap: 16, flexDirection: 'column' } }>
                {fields.map((field) => (
                  <Card
                    key={ field.key }
                    size="small"
                    title={ `Parte ${field.name + 1}` }
                    extra={ <CloseOutlined
                      onClick={ () => {
                        remove(field.name)
                      } }
                    /> }
                  >
                    <PartsTypeSelect
                      label={ 'Tipo' }
                      name={ [field.name, 'type'] }
                      rules={ [{ required: true, message: 'El campo es requerido' }] }
                    />

                    <Form.Item
                      label="Nombre"
                      name={ [field.name, 'name'] }
                      rules={ [{ required: true, message: 'El campo es requerido' }] }
                    >
                      <Input />
                    </Form.Item>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={ () => add() }
                >
                  + Agregar parte
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item className='d-flex justify-content-center mt-20'>
            <Button
              htmlType="submit"
              icon={ <FolderAddOutlined /> }
              loading={ isPending }
              type="primary"
            >
              Crear expediente
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        open={ open }
        title="Confirmar"
        footer={ () => (
          <>
            <Button onClick={ () => (form.resetFields(), setOpen(false)) }>Quedarme aquí</Button>
            <Button onClick={ () => navigate('/expedients') }>Ver todos los expedientes</Button>
            <Button
              type='primary'
              onClick={ () => navigate(`/expedients/${createdExpedient?.id}`) }
            >
              Ver expediente
            </Button>
          </>
        ) }
        onCancel={ () => (form.resetFields(), setOpen(false)) }
      >
        Elija una opción
      </Modal>
    </div>
  )
}

export default ExpedientsCreateView
