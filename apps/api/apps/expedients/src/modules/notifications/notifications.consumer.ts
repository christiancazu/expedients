import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { JobNotificationData, NOTIFICATION_QUEUE } from './types'
import { NotificationsService } from './notifications.service'
import { BadRequestException, Inject } from '@nestjs/common'
import { SETTINGS } from '@expedients/shared'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { ExpedientsService } from '../expedients/expedients.service'
import { ScheduledNotificationPayload } from 'apps/messenger/src/types'

@Processor(NOTIFICATION_QUEUE)
export class NotificationsConsumer extends WorkerHost {
  @Inject(ExpedientsService)
  private readonly _expedientsService: ExpedientsService

  @Inject(NotificationsService)
  private readonly _notificationsService: NotificationsService

  @Inject(SETTINGS.MESSENGER_SERVICE)
  private readonly _clientProxy: ClientProxy

  async process({ data: { expedientId, notificationId } }: Job<Pick<JobNotificationData, 'expedientId'|'notificationId'>, any, string>): Promise<any> {

    const expedient = await this._expedientsService.findOneWithUsers(expedientId)
    const notification = await this._notificationsService.findOne(notificationId)

    if (!expedient) {
      throw new BadRequestException('expedient not found')
    }

    try {
      await firstValueFrom(
        this._clientProxy
          .send<any, ScheduledNotificationPayload>(
            SETTINGS.EVENT_SCHEDULED_NOTIFICATION,
            {
              assignedLawyer: expedient.assignedLawyer,
              assignedAssistant: expedient.assignedAssistant,
              expedientId: expedient.id,
              notificationMessage: notification!.message
            }
          )
      )

      this._notificationsService.update(notificationId, {
        isSent: true
      })

      return `user notified successfully`
    } catch {
      throw new BadRequestException('error sending notification')
    }

  }
}
