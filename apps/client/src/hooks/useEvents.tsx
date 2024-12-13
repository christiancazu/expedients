import type { Expedient, IEvent } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getExpedientsEvents } from '../services/api.service'
import { dateUtil } from '../utils'

type ExpedientEvent = IEvent & {
	expedient: {
		id: string
		code: string
	}
}

export const useEvents = () => {
	const query = useQuery<Expedient[], AxiosError, ExpedientEvent[]>({
		queryKey: ['expedients-events'],
		queryFn: () => getExpedientsEvents(),
		select: (expedient: Expedient[]) =>
			expedient
				.map((ex) => ({
					events: ex.events.map((e) => ({
						...e,
						scheduledAt: dateUtil.formatDate(e.scheduledAt),
						expedient: { id: ex.id, code: ex.code },
					})),
				}))
				.flatMap((d) => d.events) as ExpedientEvent[],
	})

	return query
}
