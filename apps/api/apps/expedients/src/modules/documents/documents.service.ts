import { Injectable, OnModuleInit, UnprocessableEntityException } from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UploadService } from '../upload/upload.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './entities/document.entity'
import { Expedient } from '../expedients/entities/expedient.entity'
import { User } from '../users/entities/user.entity'
import { Mime } from 'mime'

@Injectable()
export class DocumentsService implements OnModuleInit {
  private _mime: Mime

  @InjectRepository(Document)
  private readonly _documentsRepository: Repository<Document>

  constructor(private _uploadService: UploadService) { }

  async onModuleInit() {
    const mime = await (eval(`import('mime')`) as Promise<typeof import('mime')>)
    this._mime = mime.default
  }

  async create(file: Express.Multer.File, createDocumentDto: CreateDocumentDto, userId: string) {
    const extension = this.getFileExtension(file.mimetype)

    const { key } = await this._uploadService.put(file, createDocumentDto.name, extension)

    try {
      const expedient = new Expedient()
      expedient.id = createDocumentDto.expedientId

      const user = new User()
      user.id = userId

      const document = new Document()

      document.name = createDocumentDto.name
      document.key = key
      document.extension = extension
      document.expedient = expedient
      document.createdByUser = document.updatedByUser = user

      this._documentsRepository.create(document)

      return await this._documentsRepository.save(document)
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.driverError?.detail ?? error
      )
    }
  }

  async findOne(id: string) {
    try {
      const document = await this._documentsRepository.findOne({
        where: { id },
        relations: {
          updatedByUser: true,
          createdByUser: true
        },
        select: {
          updatedByUser: {
            firstName: true,
            surname: true
          },
          createdByUser: {
            firstName: true,
            surname: true
          }
        }
      })

      if (!document) {
        throw new UnprocessableEntityException('Document not found')
      }

      const url = await this._uploadService.findOne(document.key)

      return {
        ...document,
        url
      }
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }
  }

  async update(id: string, file: Express.Multer.File, userId: string, name?: string) {
    const extension = this.getFileExtension(file.mimetype)

    const document = await this._documentsRepository.findOne({
      where: { id }
    })

    if (!document) {
      throw new UnprocessableEntityException('Document not found')
    }

    try {
      if (name) {
        document.name = name
      }

      await this._uploadService.put(file, document.name, extension, document.key)

      const user = new User()
      user.id = userId

      document.extension = extension
      document.updatedByUser = user

      return await this._documentsRepository.save(document)
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.driverError?.detail ?? error
      )
    }
  }

  remove(id: number) {
    return `This action removes a #${id} document`
  }

  private getFileExtension(mimetype: string) {
    return this._mime.getExtension(mimetype) || ''

  }
}
