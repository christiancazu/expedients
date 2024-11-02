import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator'
import { FIELD, USER_ROLES } from '@expedients/shared'

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(FIELD.USER_EMAIL_MAX_LENGTH)
  email: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.USER_PASSWORD_MAX_LENGTH)
  password: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.USER_FIRST_NAME_MAX_LENGTH)
  firstName: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.USER_LAST_NAME_MAX_LENGTH)
  lastName: string

  @IsEnum(USER_ROLES)
  role: USER_ROLES
}
