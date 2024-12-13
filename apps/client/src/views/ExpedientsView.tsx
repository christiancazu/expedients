import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { useEffect, useState } from 'react'

import type { EXPEDIENT_STATUS, Expedient } from '@expedients/shared'
import { useNavigate } from 'react-router-dom'
import FilterExpedients from '../components/ExpedientsFilters'
import TableExpedients from '../components/ExpedientsTable'
import ButtonBase from '../components/base/ButtonBase'
import DocumentDetail from '../components/document/DocumentDetail'
import useNotify from '../hooks/useNotification'
import { getExpedients } from '../services/api.service'
import type { DocumentFile } from './ExpedientView'

interface SearchParams {
	byText?: string[]
	text?: string | null
	status?: EXPEDIENT_STATUS | null
	updatedByUser?: string | null
}

const dom = document
let mentions: HTMLElement[] | Element[] = []

const ExpedientsView: React.FC = () => {
	const navigate = useNavigate()
	const [params, setParams] = useState<SearchParams>({
		byText: [],
		text: null,
		status: null,
		updatedByUser: null,
	})
	const notify = useNotify()
	const [documentFile, setDocumentFile] = useState<DocumentFile>({
		id: '',
		showDetail: false,
		showUpload: false,
		isLoading: false,
		action: 'create',
	})

	const { data, isFetching, isFetched } = useQuery({
		queryKey: ['expedients', params],
		queryFn: (): Promise<Expedient[]> => getExpedients(params),
		refetchOnMount: true,
		select: (expedients) =>
			expedients.map((expedient) => ({ ...expedient, key: expedient.id })),
	})

	const handleSearch = (search: SearchParams) => {
		setParams((prev) => ({ prev, ...search }))
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
		setDocumentFile((prev) => ({
			...prev,
			showDetail: true,
			id: event.target.dataset.id,
		}))
	}

	const setupMentionListeners = () => {
		for (const element of mentions) {
			element.removeEventListener('click', docEventListeners)
		}

		setTimeout(() => {
			mentions = Array.from(dom.getElementsByClassName('mention'))
			for (const element of mentions) {
				element.addEventListener('click', docEventListeners)
			}
		}, 1)
	}

	useEffect(() => {
		if (data?.length) {
			setupMentionListeners()
		}

		return () => {
			for (const element of mentions) {
				element.removeEventListener('click', docEventListeners)
			}
		}
	}, [data])

	return (
		<>
			<ButtonBase
				primary
				className="mb-16"
				onClick={() => navigate('/expedients/create')}
			>
				Crear expediente
			</ButtonBase>

			<FilterExpedients loading={isFetching} onSearch={handleSearch} />

			<TableExpedients
				expedients={data!}
				loading={isFetching}
				onChangePagination={setupMentionListeners}
			/>

			{documentFile.showDetail && (
				<DocumentDetail
					documentFile={documentFile}
					setDocumentFile={setDocumentFile}
				/>
			)}
		</>
	)
}

export default ExpedientsView
