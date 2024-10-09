import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator';
import { USER_ROLES } from 'types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEnum(USER_ROLES)
  role: USER_ROLES;
}
