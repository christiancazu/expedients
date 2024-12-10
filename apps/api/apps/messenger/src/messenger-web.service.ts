import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { sendNotification, setVapidDetails } from 'web-push'
import { PushNotification } from 'apps/expedients/src/modules/notifications/types'

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

  async sendScheduledNotification(notifications: PushNotification[]) {
    try {
      await Promise.all(notifications
        .map(notification => {
          const { pushSubscription, ...rest } = notification

          return sendNotification(
            pushSubscription,
            JSON.stringify({ ...rest })
          )
        })
      )
    } catch (error) {
      this.logger.error(error)
    }
  }
}