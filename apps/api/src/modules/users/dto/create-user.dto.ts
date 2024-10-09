import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator';
import { ROLES } from '../interfaces';

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

  @IsEnum(ROLES)
  role: ROLES;
}
