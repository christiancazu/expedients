import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { FIELD, PART_TYPES } from 'types';

export class CreatePartDto {
  @IsNotEmpty()
  @MaxLength(FIELD.PART_NAME_MAX_LENGTH)
  name: string;

  @IsNotEmpty()
  expedientId: string;

  @IsEnum(PART_TYPES)
  type: PART_TYPES;
}
