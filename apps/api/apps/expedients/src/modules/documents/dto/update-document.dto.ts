import { PartialType } from '@nestjs/mapped-types'
import { CreateDocumentDto } from './create-document.dto'
import { IsOptional } from 'class-validator'

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsOptional()
  name?: string
}
