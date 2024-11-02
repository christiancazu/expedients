import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator'
import { CreatePartDto } from 'src/modules/parts/dto/create-part.dto'
import { EXPEDIENT_STATUS, FIELD } from '@expedients/shared'

export class CreateExpedientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.EXPEDIENT_CODE_MAX_LENGTH)
  code: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.EXPEDIENT_SUBJECT_MAX_LENGTH)
  subject: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD.EXPEDIENT_COURT_MAX_LENGTH)
  court: string

  @IsOptional()
  @IsEnum(EXPEDIENT_STATUS)
  status?: EXPEDIENT_STATUS

  @IsOptional()
  @IsString()
  statusDescription?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartDto)
  parts: CreatePartDto[]
}
