import { IsDateString, IsString, IsUUID } from 'class-validator'

export class CreateNotificationDto {
  @IsString()
  message: string

  @IsUUID()
  expedientId: string

  @IsDateString()
  scheduledAt: string
}
