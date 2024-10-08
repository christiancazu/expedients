import { PartialType } from '@nestjs/mapped-types';
import { CreateExpedientDto } from './create-expedient.dto';

export class UpdateExpedientDto extends PartialType(CreateExpedientDto) {}
