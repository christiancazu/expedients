import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

import { User } from 'types'
import { getUsers } from '../services/api.service'

interface Props {
  setUpdatedByUser: (value: string) => void;
}

const SelectUsers: React.FC<Props> = ({ setUpdatedByUser }) => {
  const { data, isFetching } =  useQuery({ queryKey: ['users'], queryFn: (): Promise<User[]> => getUsers() })
  
  return (
    <Select
      allowClear
      showSearch
      disabled={ isFetching }
      loading={ isFetching }
      options={ data?.map(user => ({ value: user.id, label: `${user.firstName} ${user.lastName}` })) || [] }
      placeholder="Actualizado por"
      style={ { width: '100%' } }
      filterOption={ (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
      onChange={ setUpdatedByUser }
    />
  )
}

export default SelectUsers
