import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { sendNotification, setVapidDetails } from 'web-push'
import { SubscriptionNotificationDto } from 'apps/expedients/src/modules/notifications/dto/subscription-notification.dto'

@Injectable()
export class MessengerWebService {
  sender_email: string

  private readonly logger = new Logger()

  constructor(
    private readonly _configService: ConfigService
  ) {
    this.sender_email = this._configService.get('SENDER_EMAIL')!

    setVapidDetails(
      `mailto:${this.sender_email}`,
      this._configService.get('VAPID_PUBLIC_KEY')!,
      this._configService.get('VAPID_PRIVATE_KEY')!
    )
  }

  async sendScheduledNotification(notifications: SubscriptionNotificationDto[]) {
    try {
      await Promise.all(notifications.map(notification => sendNotification(notification, JSON.stringify({ title: `expedients` }))))
    } catch (error) {
      this.logger.error(error)
    }
  }
}
