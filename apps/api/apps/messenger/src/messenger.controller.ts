import { Controller } from '@nestjs/common'
import { MessengerEmailService } from './messenger-email.service'
import { SETTINGS } from '@expedients/shared'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MailActivateAccountPayload, ScheduledEventPayload } from './types'
import { MessengerWebService } from './messenger-web.service'
import { SubscriptionNotificationDto } from 'apps/expedients/src/modules/notifications/dto/subscription-notification.dto'

@Controller()
export class MessengerController {
  constructor(
    private readonly _messengerEmailService: MessengerEmailService,
    private readonly _messengerWebService: MessengerWebService
  ) { }

  @MessagePattern(SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT)
  sendEmailToActivateAccount(@Payload() payload: MailActivateAccountPayload) {
    return this._messengerEmailService.sendEmailToActivateAccount(payload)
  }

  @MessagePattern(SETTINGS.EVENT_SCHEDULED)
  sendScheduledEvent(@Payload() payload: ScheduledEventPayload)
  {
    this._messengerEmailService.sendScheduledEvent(payload)
  }

  @MessagePattern(SETTINGS.NOTIFICATION_SCHEDULED)
  sendScheduledNotification(@Payload() payload: SubscriptionNotificationDto[]) {
    this._messengerWebService.sendScheduledNotification(payload)
  }
}
