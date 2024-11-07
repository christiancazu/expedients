import { IsOptional, IsUUID } from 'class-validator'
import { Document } from '@expedients/shared'

export class CreateDocumentDto implements Partial<Document> {
  @IsUUID()
  expedientId: string

  @IsOptional()
  name: string
}
