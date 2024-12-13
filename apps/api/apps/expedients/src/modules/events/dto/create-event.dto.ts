import { IsDateString, IsString, IsUUID } from 'class-validator'

export class CreateEventDto {
	@IsString()
	message: string

	@IsUUID()
	expedientId: string

	@IsDateString()
	scheduledAt: string
}
