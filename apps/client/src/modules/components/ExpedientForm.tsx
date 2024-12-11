import { Button, Card, Form, Input } from 'antd'
import ExpedientStatusSelect from '../../components/ExpedientStatusSelect'
import UsersSelect from '../../components/UsersSelect'
import PartsTypeSelect from '../../components/PartsTypeSelect'
import { CloseOutlined, FolderAddOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'

interface Props {
  form: FormInstance
  isPending: boolean
  onFinish: () => void
  mode?: 'create' | 'edit'
}

export default function ExpedientForm({ form, isPending, onFinish, mode = 'create' }: Props): React.ReactNode {
  return (
    <Form
      autoComplete="off"
      form={ form }
      labelCol={ { xs: { span: 24 }, lg: { span: 6 } } }
      style={ { width: '100%', maxWidth: 800 } }
      wrapperCol={ { xs: { span: 24 }, lg: { span: 18 } } }
      onFinish={ onFinish }
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
          {mode === `create` ? `Crear ` : `Editar `}
          expediente
        </Button>
      </Form.Item>
    </Form>
  )
}
