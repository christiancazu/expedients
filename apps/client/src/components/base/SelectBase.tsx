import { Select } from 'antd'
import React from 'react'

const SelectBase: React.FC = props => {
  return (
    <Select
      showSearch
      placeholder="Seleccione un usuario"
      filterOption={ (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
      options={ [
        { value: '1', label: 'Jack' },
        { value: '2', label: 'Lucy' },
        { value: '3', label: 'Tom' }
      ] }
    />
  )
}

export default SelectBase
