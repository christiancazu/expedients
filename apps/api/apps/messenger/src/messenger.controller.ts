import { Controller } from '@nestjs/common'
import { MessengerService } from './messenger.service'
import { SETTINGS } from '@expedients/shared'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MailActivateAccountPayload, ScheduledEventPayload } from './types'

@Controller()
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) { }

  @MessagePattern(SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT)
  sendEmailToActivateAccount(@Payload() payload: MailActivateAccountPayload) {
    return this.messengerService.sendEmailToActivateAccount(payload)
  }

  @MessagePattern(SETTINGS.EVENT_SCHEDULED_EVENT)
  sendScheduledEvent(@Payload() payload: ScheduledEventPayload)
  {
    return this.messengerService.sendScheduledEvent(payload)
  }
}
