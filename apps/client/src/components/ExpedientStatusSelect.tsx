import React from 'react'
import { Form, Select } from 'antd'
import { EXPEDIENT_STATUS } from '@expedients/types'

const expedientStatusOptions = Object.keys(EXPEDIENT_STATUS).map(status => ({ label: status.replace('_', ' '), value: status }))

interface Props {
  label?: string;
  name: [number, string] | string;
  rules?: [{ required: boolean; message: string }];
  onChange?: () => void;
}

const ExpedientStatusSelect: React.FC<Props> = (props) => {
  return (
    <Form.Item { ...props }>
      <Select
        allowClear
        options={ expedientStatusOptions }
        placeholder="Estado"
        style={ { width: '100%' } }
        filterOption={ (input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
        onChange={ props.onChange }
      />
    </Form.Item>
  )
}

export default ExpedientStatusSelect
