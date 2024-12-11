import { IsEnum, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator'
import { FIELD, PART_TYPES } from '@expedients/shared'

export class CreatePartDto {
  @IsNotEmpty()
  @MaxLength(FIELD.PART_NAME_MAX_LENGTH)
  name: string

  @IsEnum(PART_TYPES)
  type: PART_TYPES

  @IsOptional()
  @IsUUID()
  id: string
}
