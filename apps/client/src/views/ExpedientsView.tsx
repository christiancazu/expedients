import React from 'react'
import { useQuery } from '@tanstack/react-query'
import TableExpedients from '../components/TableExpedients'
import { getExpedients } from '../composables/useQuery'
import { Expedient } from 'types'

const ExpedientsView: React.FC = () => {
  const { data, isFetching, refetch } =  useQuery({ queryKey: ['expedients'], queryFn: (): Promise<Expedient[]> => getExpedients() })

  return (
    <>
      <TableExpedients
        expedients={ data! }
        loading={ isFetching }
      />
    </>
  )
}

export default ExpedientsView
