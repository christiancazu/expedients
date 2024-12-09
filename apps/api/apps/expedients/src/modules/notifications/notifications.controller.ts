import { Body, Controller, Post } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { SubscriptionNotificationDto } from './dto/subscription-notification.dto'
import { UserRequest } from '../users/user-request.decorator'
import { User } from '../users/entities/user.entity'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('subscribe')
  subscribe(
    @Body() dto: SubscriptionNotificationDto,
    @UserRequest() user: User
  ) {
    return this.notificationsService.subscribe(user, dto)
  }
}
