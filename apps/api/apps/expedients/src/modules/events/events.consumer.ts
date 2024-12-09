import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { JobEventData, EVENT_QUEUE } from './types'
import { BadRequestException, Inject } from '@nestjs/common'
import { SETTINGS } from '@expedients/shared'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { ExpedientsService } from '../expedients/expedients.service'
import { ScheduledEventPayload } from 'apps/messenger/src/types'
import { EventsService } from './events.service'

@Processor(EVENT_QUEUE)
export class EventsConsumer extends WorkerHost {
  @Inject(ExpedientsService)
  private readonly _expedientsService: ExpedientsService

  @Inject(EventsService)
  private readonly _eventsService: EventsService

  @Inject(SETTINGS.MESSENGER_SERVICE)
  private readonly _clientProxy: ClientProxy

  async process({ data: { expedientId, eventId } }: Job<Pick<JobEventData, 'expedientId'|'eventId'>, any, string>): Promise<any> {

    const expedient = await this._expedientsService.findOneWithUsers(expedientId)
    const event = await this._eventsService.findOne(eventId)

    if (!expedient) {
      throw new BadRequestException('expedient not found')
    }

    try {
      await firstValueFrom(
        this._clientProxy
          .send<any, ScheduledEventPayload>(
            SETTINGS.EVENT_SCHEDULED_EVENT,
            {
              assignedLawyer: expedient.assignedLawyer,
              assignedAssistant: expedient.assignedAssistant,
              expedientId: expedient.id,
              eventMessage: event!.message
            }
          )
      )

      this._eventsService.update(eventId, {
        isSent: true
      })

      return `user notified successfully`
    } catch {
      throw new BadRequestException('error sending event')
    }

  }
}
