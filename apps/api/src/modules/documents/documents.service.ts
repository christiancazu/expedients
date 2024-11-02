import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UploadService } from '../upload/upload.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './entities/document.entity'
import { Expedient } from '../expedients/entities/expedient.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class DocumentsService {
  @InjectRepository(Document)
  private readonly _documentsRepository: Repository<Document>

  constructor(private _uploadService: UploadService) {}

  async create(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
    userId: string
  ) {
    const { key } = await this._uploadService.put(file)

    try {
      const expedient = new Expedient()
      expedient.id = createDocumentDto.expedientId

      const user = new User()
      user.id = userId

      const document = new Document()

      document.name = file.originalname
      document.key = key as string
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
            lastName: true
          },
          createdByUser: {
            firstName: true,
            lastName: true
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

  async update(id: string, file: Express.Multer.File, userId: string) {
    const document = await this._documentsRepository.findOne({
      where: { id }
    })

    if (!document) {
      throw new UnprocessableEntityException('Document not found')
    }

    try {
      await this._uploadService.put(file, document.key)
      document.name = file.originalname

      const user = new User()
      user.id = userId

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
}
