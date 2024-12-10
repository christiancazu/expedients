import { SubscriptionNotificationDto } from '../dto/subscription-notification.dto'

export interface PushNotification {
  pushSubscription: SubscriptionNotificationDto
  title: string
  body: string
  redirectUrl: string
}
