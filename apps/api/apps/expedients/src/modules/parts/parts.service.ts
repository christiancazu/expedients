import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import type { CreatePartDto } from './dto/create-part.dto'
import { Part } from './entities/part.entity'

@Injectable()
export class PartsService {
	@InjectRepository(Part)
	private readonly _partRepository: Repository<Part>

	async create(dto: CreatePartDto) {
		const part = this._partRepository.create(dto)

		// const expedient = new Expedient(dto.expedientId)
		// part.expedient = expedient

		try {
			const partSaved = await this._partRepository.save(part)

			return partSaved
		} catch (error) {
			throw new UnprocessableEntityException(
				error?.driverError?.detail ?? error,
			)
		}
	}

	findAll() {
		return 'This action returns all parts'
	}

	findOne(id: number) {
		return `This action returns a #${id} part`
	}

	update(id: number) {
		return `This action updates a #${id} part`
	}

	remove(id: number) {
		return `This action removes a #${id} part`
	}
}
