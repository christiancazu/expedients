import { PartialType } from '@nestjs/mapped-types'
import { IsOptional } from 'class-validator'
import { CreateDocumentDto } from './create-document.dto'

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
	@IsOptional()
	name?: string
}
