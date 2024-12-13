import { EXPEDIENT_STATUS } from '@expedients/shared'
import { IsEnum, IsIn, IsOptional } from 'class-validator'

export class FindExpedientDto {
	@IsOptional()
	@IsIn(['code', 'subject', 'court'], { each: true })
	byText: string

	@IsOptional()
	text: string

	@IsOptional()
	updatedByUser: string

	@IsOptional()
	@IsEnum(EXPEDIENT_STATUS)
	status?: EXPEDIENT_STATUS
}
