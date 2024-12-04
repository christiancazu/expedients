import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './entities/document.entity'
import { Expedient } from '../expedients/entities/expedient.entity'
import { User } from '../users/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { unlink } from 'fs'

@Injectable()
export class DocumentsService {
  @InjectRepository(Document)
  private readonly _documentsRepository: Repository<Document>
  private readonly _mediaPath

  constructor(private _configService: ConfigService) {
    this._mediaPath = this._configService.get<string>('STORAGE_MEDIA_PATH')
  }

  async create(file: Express.Multer.File, createDocumentDto: CreateDocumentDto, userId: string) {
    const [uuidKey, extension] = file.filename.split('.')

    try {
      const expedient = new Expedient()
      expedient.id = createDocumentDto.expedientId

      const user = new User()
      user.id = userId

      const document = new Document()

      document.name = createDocumentDto.name
      document.key = uuidKey
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

      return document
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }
  }

  async update(id: string, file: Express.Multer.File, userId: string, name?: string) {
    const [uuidKey, extension] = file.filename.split('.')

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

      unlink(`${this._mediaPath}/${document.key}.${document.extension}`, (err) => {
        if (err) {
          throw err
        }

        console.log('Delete File successfully.')
      })

      const user = new User()
      user.id = userId

      document.extension = extension
      document.updatedByUser = user
      document.key = uuidKey

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
