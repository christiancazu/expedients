import { FIELD } from '@expedients/shared'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class verifyAccountDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(FIELD.USER_PASSWORD_MAX_LENGTH)
	readonly password: string

	@IsNotEmpty()
	@IsString()
	readonly token: string
}
