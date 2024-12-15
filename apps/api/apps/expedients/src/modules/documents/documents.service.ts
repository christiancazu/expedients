import { unlink } from 'node:fs'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Expedient } from '../expedients/entities/expedient.entity'
import { User } from '../users/entities/user.entity'
import { CreateDocumentDto } from './dto/create-document.dto'
import { Document } from './entities/document.entity'

@Injectable()
export class DocumentsService {
	@InjectRepository(Document)
	private readonly _documentsRepository: Repository<Document>
	private readonly _path

	constructor(private _configService: ConfigService) {
		this._path = this._configService.get<Record<string, string>>('path')
	}

	async create(
		file: Express.Multer.File,
		createDocumentDto: CreateDocumentDto,
		userId: string,
	) {
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
				error?.driverError?.detail ?? error,
			)
		}
	}

	async findOne(id: string) {
		try {
			const document = await this._documentsRepository.findOne({
				where: { id },
				relations: {
					updatedByUser: true,
					createdByUser: true,
				},
				select: {
					updatedByUser: {
						firstName: true,
						surname: true,
					},
					createdByUser: {
						firstName: true,
						surname: true,
					},
				},
			})

			if (!document) {
				throw new UnprocessableEntityException('Document not found')
			}

			return {
				...document,
				url: `${this._path!.media}/documents/${document.key}.${document.extension}`,
			}
		} catch (error) {
			throw new UnprocessableEntityException(error)
		}
	}

	async update(
		id: string,
		file: Express.Multer.File,
		userId: string,
		name?: string,
	) {
		const [uuidKey, extension] = file.filename.split('.')

		const document = await this._documentsRepository.findOne({
			where: { id },
		})

		if (!document) {
			throw new UnprocessableEntityException('Document not found')
		}

		try {
			if (name) {
				document.name = name
			}

			unlink(
				`${this._path!.media}/documents/${document.key}.${document.extension}`,
				(err) => {
					if (err) {
						throw err
					}
				},
			)

			const user = new User()
			user.id = userId

			document.extension = extension
			document.updatedByUser = user
			document.key = uuidKey

			return await this._documentsRepository.save(document)
		} catch (error) {
			throw new UnprocessableEntityException(
				error?.driverError?.detail ?? error,
			)
		}
	}

	remove(id: number) {
		return `This action removes a #${id} document`
	}
}
