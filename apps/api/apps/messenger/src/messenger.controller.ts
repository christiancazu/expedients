import { Controller } from '@nestjs/common'
import { MessengerService } from './messenger.service'
import { SETTINGS } from '@expedients/shared'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { User } from 'apps/expedients/src/modules/users/entities/user.entity'

@Controller()
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @MessagePattern(SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT)
  sendEmailToActivateAccount(@Payload() { user, token }: { user: User; token: string }) {
    return this.messengerService.sendEmailToActivateAccount(user, token)
  }
}
