import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TableExpedients from '../components/ExpedientsTable'
import { Expedient, EXPEDIENT_STATUS } from '@expedients/shared'
import FilterExpedients from '../components/ExpedientsFilters'
import Title from 'antd/es/typography/Title'
import { getExpedients } from '../services/api.service'
import useNotify from '../composables/useNotification'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { DocumentFile } from './ExpedientView'
import DocumentDetail from '../components/DocumentDetail'

interface SearchParams {
  byText?: string[];
  text?: string | null;
  status?: EXPEDIENT_STATUS | null;
  updatedByUser?: string | null;
}

const dom = document
let mentions: HTMLElement[] | Element[] = []

const ExpedientsView: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    byText: [],
    text: null,
    status: null,
    updatedByUser: null
  })
  const navigate = useNavigate()
  const notify = useNotify()
  const [documentFile, setDocumentFile] = useState<DocumentFile>({
    id: '',
    showDetail: false,
    showUpload: false,
    isLoading: false,
    action: 'create'
  })

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['expedients', params],
    queryFn: (): Promise<Expedient[]> => getExpedients(params),
    refetchOnMount: true,
    select: (expedients) => expedients.map(expedient => ({ ...expedient, key: expedient.id }))
  })

  const handleSearch = (search: SearchParams) => {
    setParams(prev => ({ prev, ...search }))
  }

  useEffect(() => {
    if (isFetched && data?.length === 0) {
      notify({ message: 'La busqueda no produjo resultados', type: 'info' })
    }
  })

  const docEventListeners = (event: any) => {
    if (!(event.target instanceof HTMLSpanElement)) {
      return
    }
    setDocumentFile(prev => ({ ...prev, showDetail: true, id: event.target.dataset['id'] }))
  }

  const setupMentionListeners = () => {
    mentions.forEach((element) => {
      element.removeEventListener('click', docEventListeners)
    })

    setTimeout(() => {
      mentions = Array.from(dom.getElementsByClassName('mention'))
      mentions.forEach((element) => {
        element.addEventListener('click', docEventListeners)
      })
    }, 1)
  }

  useEffect(() => {
    if (data?.length) {
      setupMentionListeners()
    }

    return () => {
      mentions.forEach((element) => {
        element.removeEventListener('click', docEventListeners)
      })
    }
  }, [data])

  return (
    <>
      <div className='d-flex justify-content-between'>
        <Title
          className='mb-20'
          level={ 4 }
        >
          Expedientes
        </Title>

        <Button
          icon={ <PlusOutlined /> }
          type='primary'
          onClick={ () => navigate('/expedients/create') }
        >
          Crear expediente
        </Button>
      </div>
      <FilterExpedients
        loading={ isFetching }
        onSearch={ handleSearch }
      />

      <TableExpedients
        expedients={ data! }
        loading={ isFetching }
        onChangePagination={ setupMentionListeners }
      />

      {
        documentFile.showDetail &&
          <DocumentDetail
            documentFile={ documentFile }
            setDocumentFile={ setDocumentFile }
          />
      }
    </>
  )
}

export default ExpedientsView
