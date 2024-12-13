import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Request,
} from '@nestjs/common'
import { FileUploadInterceptor } from '../storage/decorators/file-interceptor.decorator'
import { UploadedFileParam } from '../storage/decorators/uploaded-file-param.decorator'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'

@Controller('documents')
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}

	@Post()
	@FileUploadInterceptor()
	create(
		@UploadedFileParam() file: Express.Multer.File,
		@Body() createDocumentDto: CreateDocumentDto,
		@Request() req: any,
	) {
		return this.documentsService.create(file, createDocumentDto, req.user.id)
	}

	@Get(':id')
	findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.documentsService.findOne(id)
	}

	@Patch(':id')
	@FileUploadInterceptor()
	update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@UploadedFileParam() file: Express.Multer.File,
		@Request() req: any,
		@Body() updateDocumentDto: UpdateDocumentDto,
	) {
		return this.documentsService.update(
			id,
			file,
			req.user.id,
			updateDocumentDto.name,
		)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.documentsService.remove(+id)
	}
}
