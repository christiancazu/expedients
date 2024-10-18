import React, { useEffect } from 'react'
import { Button, Card, Col, Form, FormProps, Input, Row } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { signIn } from '../services/api.service'
import { useForm } from 'antd/es/form/Form'
import useUserState from '../composables/useUserState'
import { useNavigate } from 'react-router-dom'

interface FieldType {
  email?: string;
  password?: string;
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  // TODO: toast
}


const SignInView: React.FC = () => {
  const [form] = useForm()
  const { setUserSession } = useUserState()
  const navigate = useNavigate()

  const { refetch, isFetching, data, status } = useQuery({
    queryKey: ['sign-in'],
    queryFn: () => signIn({ email: form.getFieldValue('email'), password: form.getFieldValue('password') }),
    enabled: false
  })

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    // TODO: toast
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async () => {
    await refetch()
  }

  useEffect(() => {
    if (status === 'success') {
      setUserSession(data)
      navigate('/')
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
              onFinishFailed={ onFinishFailed }
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
