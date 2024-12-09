import { FIELD } from '@expedients/shared'
import { Type } from 'class-transformer'
import { IsString, MaxLength, ValidateNested } from 'class-validator'
import { PushSubscription } from 'web-push'

class KeysDto {
  @IsString()
  @MaxLength(FIELD.NOTIFICATION_P256DH_MAX_LENGTH)
  p256dh: string

  @IsString()
  @MaxLength(FIELD.NOTIFICATION_AUTH_MAX_LENGTH)
  auth: string
}

export class SubscriptionNotificationDto implements PushSubscription {
  @IsString()
  @MaxLength(FIELD.NOTIFICATION_ENDPOINT_MAX_LENGTH)
  endpoint: string

  @ValidateNested()
  @Type(() => KeysDto)
  keys: KeysDto
}
