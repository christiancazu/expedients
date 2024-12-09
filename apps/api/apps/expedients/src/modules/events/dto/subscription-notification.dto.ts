import { IsUUID, IsInstance } from "class-validator"

export class SubscriptionNotificationDto {
  @IsUUID()
  userId: string

  @IsInstance(PushSubscription)
  subscription: PushSubscription
}
