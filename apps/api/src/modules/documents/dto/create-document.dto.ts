import { IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @IsUUID()
  expedientId: string;
}
