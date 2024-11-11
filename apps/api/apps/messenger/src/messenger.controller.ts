import { Controller } from '@nestjs/common'
import { MessengerService } from './messenger.service'
import { SETTINGS } from '@expedients/shared'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @MessagePattern(SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT)
  sendEmailToActivateAccount() {
    return this.messengerService.sendEmailToActivateAccount()
  }
}
