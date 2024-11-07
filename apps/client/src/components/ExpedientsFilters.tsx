import React, { useState } from 'react'
import { Checkbox, Input, theme, Button, Flex, Form, Row, Col, CheckboxOptionType } from 'antd'
import { ClearOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons'
import UsersSelect from './UsersSelect'
import ExpedientStatusSelect from './ExpedientStatusSelect'

const textFilterOptions: CheckboxOptionType[] = [
  { label: 'Código', value: 'code' },
  { label: 'Materia', value: 'subject' },
  { label: 'Juzgado', value: 'court' }
]

interface Props {
  onSearch: (values: any) => void;
  loading: boolean;
}

const FilterExpedients: React.FC<Props> = ({ onSearch, loading }) => {
  const { token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD } } = theme.useToken()

  const [form] = Form.useForm()
  const [canDeleteFilter, setCanDeleteFilters] = useState(false)

  function handleOnChange() {
    setCanDeleteFilters(Object.values(form.getFieldsValue()).some((value: any) => Array.isArray(value) ? value.length : !!value))
  }

  return (
    <div
      style={ {
        backgroundColor: colorBgContainer, borderRadius: borderRadiusLG, padding: paddingMD, marginBottom: marginMD
      } }
    >
      <Form
        autoComplete="off"
        form={ form }
        initialValues={ {
          byText: ['code', 'subject', 'court']
        } }
        onChange={ handleOnChange }
        onFinish={ onSearch }
      >
        <Flex justify='space-between'>
          <h3 style={ { marginBottom: marginMD } }>
            Filtros
            {' '}
            <FilterOutlined />
          </h3>

          {canDeleteFilter &&
            <Button
              danger
              icon={ <ClearOutlined /> }
              iconPosition='end'
              type='link'
              onClick={ () => (form.resetFields(), setCanDeleteFilters(false)) }
            >
              Restablecer filtros
            </Button>
          }
        </Flex>

        <Row gutter={ marginMD }>
          <Col
            md={ 6 }
            sm={ 24 }
          >
            <Form.Item
              label="Filtrar por"
              name="byText"
            >
              <Checkbox.Group
                options={ textFilterOptions }
                onChange={ handleOnChange }
              />
            </Form.Item>
          </Col>

          <Col
            md={ 7 }
            sm={ 24 }
          >
            <Form.Item name="text">
              <Input
                allowClear
                placeholder="Ingrese una busqueda..."
                style={ { width: '100%' } }
                suffix={ <SearchOutlined /> }
                onClear={ handleOnChange }
              />
            </Form.Item>
          </Col>

          <Col
            md={ 4 }
            sm={ 24 }
          >
            <UsersSelect
              name={ 'updatedByUser' }
              placeholder={ 'Actualizado por' }
              onChange={ (updatedByUser) => { form.setFieldsValue({ updatedByUser }); handleOnChange() } }
            />

            {/* <Form.Item name="updatedByUser">
              <UsersSelect ={ updatedByUser => { form.setFieldsValue({ updatedByUser }); handleOnChange() } } />
            </Form.Item> */}
          </Col>

          <Col
            md={ 4 }
            sm={ 24 }
          >
            <ExpedientStatusSelect
              name={ 'status' }
              onChange={ handleOnChange }
            />
          </Col>

          <Col
            md={ 3 }
            sm={ 24 }
          >
            <Form.Item>
              <Button
                block
                htmlType="submit"
                icon={ <SearchOutlined /> }
                iconPosition="end"
                loading={ loading }

                type="primary"
              >
                Buscar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default FilterExpedients
