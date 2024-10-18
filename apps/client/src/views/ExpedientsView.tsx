import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TableExpedients from '../components/TableExpedients'
import { Expedient, EXPEDIENT_STATUS } from 'types'
import FilterExpedients from '../components/FilterExpedients'
import Title from 'antd/es/typography/Title'
import { getExpedients } from '../services/api.service'
import useNotify from '../composables/useNotification'

interface SearchParams {
  byText?: string[];
  text?: string | null;
  status?: EXPEDIENT_STATUS | null;
  updatedByUser?: string | null;
}

const ExpedientsView: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    byText: [],
    text: null,
    status: null,
    updatedByUser: null
  })
  const notify = useNotify()

  const { data, isFetching, isFetched } = useQuery({ queryKey: ['expedients', params], queryFn: (): Promise<Expedient[]> => getExpedients(params), refetchOnMount: true })

  function handleSearch(search: SearchParams) {
    setParams(prev => ({ prev, ...search }))
  }

  useEffect(() => {
    if (isFetched && data?.length === 0) {
      notify({ message: 'La busqueda no produjo resultados', type: 'info' })
    }
  })

  return (
    <>
      <Title
        className='mb-20'
        level={ 4 }
      >
        Expedientes
      </Title>
      <FilterExpedients
        loading={ isFetching }
        onSearch={ handleSearch }
      />

      <TableExpedients
        expedients={ data! }
        loading={ isFetching }
      />
    </>
  )
}

export default ExpedientsView
