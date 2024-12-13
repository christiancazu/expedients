import type { Document } from '@expedients/shared'
import { IsOptional, IsUUID } from 'class-validator'

export class CreateDocumentDto implements Partial<Document> {
	@IsUUID()
	expedientId: string

	@IsOptional()
	name: string
}
