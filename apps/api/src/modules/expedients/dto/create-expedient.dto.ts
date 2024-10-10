import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { EXPEDIENT_STATUS, FIELD } from 'types';

export class CreateExpedientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.EXPEDIENT_CODE_MAX_LENGTH)
  code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.EXPEDIENT_SUBJECT_MAX_LENGTH)
  subject: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.EXPEDIENT_COURT_MAX_LENGTH)
  court: string;

  @IsOptional()
  @IsEnum(EXPEDIENT_STATUS)
  status?: EXPEDIENT_STATUS;

  @IsOptional()
  @IsString()
  statusDescription?: string;
}
