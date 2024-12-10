import { Controller } from '@nestjs/common'
import { MessengerEmailService } from './messenger-email.service'
import { SETTINGS } from '@expedients/shared'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MailActivateAccountPayload, ScheduledEventPayload } from './types'
import { MessengerWebService } from './messenger-web.service'
import { PushNotification } from 'apps/expedients/src/modules/notifications/types'

@Controller()
export class MessengerController {
  constructor(
    private readonly _messengerEmailService: MessengerEmailService,
    private readonly _messengerWebService: MessengerWebService
  ) { }

  @MessagePattern(SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT)
  async sendEmailToActivateAccount(@Payload() payload: MailActivateAccountPayload) {
    await this._messengerEmailService.sendEmailToActivateAccount(payload)
    return `OK`
  }

  @MessagePattern(SETTINGS.EVENT_SCHEDULED)
  async sendScheduledEvent(@Payload() payload: ScheduledEventPayload)
  {
    await this._messengerEmailService.sendScheduledEvent(payload)
    return `OK`
  }

  @MessagePattern(SETTINGS.NOTIFICATION_SCHEDULED)
  async sendScheduledNotification(@Payload() payload: PushNotification[]) {
    await this._messengerWebService.sendScheduledNotification(payload)
    return `OK`
  }
}
