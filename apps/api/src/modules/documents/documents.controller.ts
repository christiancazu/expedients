import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Request,
  ParseUUIDPipe
} from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateDocumentDto } from './dto/create-document.dto'

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10485760 /* 10MB */ })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: any
  ) {
    return this.documentsService.create(file, createDocumentDto, req.user.id)
  }

  @Get()
  findAll() {
    return this.documentsService.findOne('asd')
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.findOne(id)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10485760 /* 10MB */ })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    file: Express.Multer.File,
    @Request() req: any
  ) {
    return this.documentsService.update(id, file, req.user.id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id)
  }
}
