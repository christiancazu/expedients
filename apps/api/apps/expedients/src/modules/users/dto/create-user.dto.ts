import { FIELD, USER_ROLES } from '@expedients/shared'
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MaxLength,
} from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(FIELD.USER_EMAIL_MAX_LENGTH)
	email: string

	@IsNotEmpty()
	@IsString()
	@MaxLength(FIELD.USER_FIRST_NAME_MAX_LENGTH)
	firstName: string

	@IsNotEmpty()
	@IsString()
	@MaxLength(FIELD.USER_LAST_NAME_MAX_LENGTH)
	surname: string

	@IsEnum(USER_ROLES)
	role: USER_ROLES
}
