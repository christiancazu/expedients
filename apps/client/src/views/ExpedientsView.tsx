import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TableExpedients from '../components/TableExpedients'
import { getExpedients } from '../composables/useQuery'
import { Expedient, EXPEDIENT_STATUS } from 'types'
import FilterExpedients from '../components/FilterExpedients'
import { theme } from 'antd'


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

  const { data, isFetching, refetch } = useQuery({ queryKey: ['expedients'], queryFn: (): Promise<Expedient[]> => getExpedients(params) })

  const { token: { marginMD } } = theme.useToken()

  function handleSearch(search: SearchParams) {
    setParams(search)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <>
      <h2 style={ { marginBottom: marginMD } }>Expedientes</h2>
      <FilterExpedients onSearch={ handleSearch } />

      <TableExpedients
        expedients={ data! }
        loading={ isFetching }
      />
    </>
  )
}

export default ExpedientsView
