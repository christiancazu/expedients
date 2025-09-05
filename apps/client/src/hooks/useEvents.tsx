import type { IEvent, IExpedient } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useExpedientsService } from '../services/expedients.service'
import { dateUtil } from '../utils'

type ExpedientEvent = IEvent & {
  expedient: {
    id: string
    code: string
  }
}

export const useEvents = () => {
  const { getExpedientsEvents } = useExpedientsService()

  const query = useQuery<IExpedient[], AxiosError, ExpedientEvent[]>({
    queryKey: ['expedients-events'],
    queryFn: getExpedientsEvents,
    select: (expedient: IExpedient[]) =>
      expedient
        .map((ex) => ({
          events: ex.events.map((e) => ({
            ...e,
            scheduledAt: dateUtil.formatDate(e.scheduledAt),
            expedient: { id: ex.id, code: ex.code, type: ex.type },
          })),
        }))
        .flatMap((d) => d.events) as ExpedientEvent[],
  })

  return query
}
