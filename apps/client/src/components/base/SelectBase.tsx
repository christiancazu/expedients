import React from 'react'
import { Select } from 'antd'

const SelectBase: React.FC = () => {
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
