import React, { useEffect } from 'react'
import { Button, Card, Col, Form, FormProps, Input, Row } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { signIn } from '../services/api.service'
import { useForm } from 'antd/es/form/Form'
import useUserState from '../composables/useUserState'
import { useNavigate } from 'react-router-dom'
import useNotify from '../composables/useNotification'

interface FieldType {
  email?: string;
  password?: string;
}

const SignInView: React.FC = () => {

  const [form] = useForm()
  const { setUserSession } = useUserState()
  const navigate = useNavigate()
  const notify = useNotify()

  const { refetch, isFetching, data, status } = useQuery({
    queryKey: ['sign-in'],
    queryFn: () => signIn({ email: form.getFieldValue('email'), password: form.getFieldValue('password') }),
    enabled: false
  })

  const onFinish: FormProps<FieldType>['onFinish'] = async () => {
    await refetch()
  }

  useEffect(() => {
    console.warn(status)
    if (status === 'success') {
      setUserSession(data)
      navigate('/')
      notify({ message: 'La sessión ha sido iniciada con éxito' })
    }
    if (status === 'error') {
      notify({ message: 'El usuario o la contraseña son incorrectos', type: 'error' })
    }
  })

  return (
    <section className='login-view'>
      <Row
        align={ 'middle' }
        justify={ 'center' }
        style={ { height: '100vh' } }
      >
        <Col
          className='d-flex justify-content-center'
          md={ 6 }
          xs={ 22 }
        >
          <Card
            bordered={ true }
            className='mb-0'
            style={ { width: '100%' } }
            title={ <p style={ { textAlign: 'center' } }>Iniciar Sesión</p> }
          >
            <Form
              autoComplete="off"
              disabled={ isFetching }
              form={ form }
              layout="vertical"
              name="login"
              onFinish={ onFinish }
            >
              <Form.Item<FieldType>
                label="Correo electrónico"
                name="email"
                rules={ [{ required: true, message: 'ingrese su correo electrónico' }] }
              >
                <Input type='email' />
              </Form.Item>

              <Form.Item<FieldType>
                label="Contraseña"
                name="password"
                rules={ [{ required: true, message: 'Ingrese su contraseña' }] }
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className='mb-0'>
                <Button
                  block
                  className='mt-20'
                  htmlType="submit"
                  loading={ isFetching }
                  type="primary"
                >
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default SignInView
