import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Part } from '../parts/entities/part.entity'
import { Review } from '../reviews/entities/review.entity'
import { User } from '../users/entities/user.entity'
import type { CreateExpedientDto } from './dto/create-expedient.dto'
import type { FindExpedientDto } from './dto/find-expedient.dto'
import type { UpdateExpedientDto } from './dto/update-expedient.dto'
import { Expedient } from './entities/expedient.entity'

@Injectable()
export class ExpedientsService {
	@InjectRepository(Expedient)
	private readonly _expedientRepository: Repository<Expedient>

	@InjectRepository(Part)
	private readonly _partsRepository: Repository<Part>

	async create(user: User, dto: CreateExpedientDto, expedient?: Expedient) {
		const { parts, ...restExpedient } = dto

		const expedientCreated = this._expedientRepository.create({
			...restExpedient,
			id: expedient?.id,
		})

		if (!expedient) {
			expedientCreated.createdByUser = user
		}

		expedientCreated.updatedByUser = user

		if (dto.assignedLawyerId) {
			const assignedLawyer = new User(dto.assignedLawyerId)
			expedientCreated.assignedLawyer = assignedLawyer
		}

		if (dto.assignedAssistantId) {
			const assignedAssistant = new User(dto.assignedAssistantId)
			expedientCreated.assignedAssistant = assignedAssistant
		}

		let deletedParts: Part[] = []

		if (expedient) {
			deletedParts = expedient?.parts.reduce<Part[]>((acc, part) => {
				const existsPart = parts.find((p) => p.id === part.id)

				if (!existsPart) {
					acc.push(part)
				}
				return acc
			}, [])
		}

		try {
			const expedientSaved =
				await this._expedientRepository.save(expedientCreated)

			if (parts?.length) {
				const result = this._partsRepository.create(
					parts.map((part) => ({ ...part, expedient: expedientSaved })),
				)

				await this._partsRepository.save(result)
			}

			if (deletedParts.length) {
				await this._partsRepository.remove(deletedParts)
			}
		} catch (error) {
			throw new UnprocessableEntityException(
				error?.driverError?.detail ?? error,
			)
		}
	}

	async findAll(query: FindExpedientDto): Promise<Expedient[]> {
		const { byText, text, updatedByUser, status } = query

		const qb = this._expedientRepository
			.createQueryBuilder('expedients')
			.select('expedients')
			.leftJoin('expedients.updatedByUser', 'updatedByUser')
			.addSelect(['updatedByUser.firstName', 'updatedByUser.surname'])
			.leftJoin('expedients.assignedLawyer', 'assignedLawyer')
			.addSelect(['assignedLawyer.firstName', 'assignedLawyer.surname'])
			.leftJoin('expedients.assignedAssistant', 'assignedAssistant')
			.addSelect(['assignedAssistant.firstName', 'assignedAssistant.surname'])
			.leftJoinAndSelect('expedients.parts', 'parts')

		/** If exists filter: text will filter by each byText item */
		if (text) {
			const byTextLength = byText?.length

			/** include AND WHERE if exists at least one byText item */
			if (byTextLength) {
				const _byText = byText[0]
				qb.andWhere(`expedients.${_byText}::text ILIKE :q${_byText}`, {
					[`q${_byText}`]: `%${text}%`,
				})
			}

			/** include OR WHERE if exists multiple byText item */
			if (byTextLength > 1) {
				for (let index = 0; index < byTextLength - 1; index++) {
					const _byText = byText[index + 1]
					qb.orWhere(`expedients.${_byText}::text ILIKE :q${_byText}`, {
						[`q${_byText}`]: `%${text}%`,
					})
				}
			}
		}

		/** If exists filter: updatedByUser will filter by his id */
		if (updatedByUser) {
			qb.andWhere('expedients.updatedByUser = :updatedByUser', {
				updatedByUser,
			})
		}

		/** If exists filter: status will filter by it */
		if (status) {
			qb.andWhere('expedients.status = :status', {
				status,
			})
		}

		/** LEFT JOIN expedients with reviews and will select the last review by CreatedAt or empty reviews */
		qb.leftJoinAndMapOne(
			'expedients.reviews',
			Review,
			'reviews',
			'reviews."expedientId" = expedients.id',
		).andWhere(`
      (
        "reviews"."id" =
          (SELECT id
          FROM "reviews" "reviews"
          WHERE "expedients"."id" = "reviews"."expedientId"
          ORDER BY "createdAt"
          DESC
          LIMIT 1)
        OR REVIEWS."expedientId" IS NULL
      )
    `)

		qb.orderBy('expedients.updatedAt', 'DESC')

		return await qb.getMany()
	}

	findOneWithUsers(id: string) {
		return this._expedientRepository.findOne({
			where: { id },
			relations: {
				assignedLawyer: true,
				assignedAssistant: true,
			},
			select: {
				id: true,
				assignedLawyer: {
					id: true,
					email: true,
					firstName: true,
					surname: true,
				},
				assignedAssistant: {
					id: true,
					email: true,
					firstName: true,
					surname: true,
				},
			},
		})
	}

	findOne(id: string) {
		return this._expedientRepository.findOne({
			where: { id },
			relations: {
				parts: true,
				assignedLawyer: true,
				assignedAssistant: true,
				createdByUser: true,
				updatedByUser: true,
				documents: true,
				reviews: {
					createdByUser: true,
				},
			},
			select: {
				parts: {
					id: true,
					name: true,
					type: true,
				},
				assignedLawyer: {
					id: true,
					firstName: true,
					surname: true,
				},
				assignedAssistant: {
					id: true,
					firstName: true,
					surname: true,
				},
				createdByUser: {
					id: true,
					firstName: true,
					surname: true,
				},
				updatedByUser: {
					firstName: true,
					surname: true,
				},
				reviews: {
					id: true,
					description: true,
					createdAt: true,
					createdByUser: {
						id: true,
						firstName: true,
						surname: true,
					},
				},
				documents: {
					id: true,
					name: true,
					key: true,
					extension: true,
					updatedAt: true,
					createdAt: true,
				},
			},
			order: {
				reviews: {
					createdAt: 'DESC',
				},
				documents: {
					createdAt: 'DESC',
				},
			},
		})
	}

	findEvents(user: User) {
		return this._expedientRepository.find({
			where: [
				{
					assignedAssistant: user,
				},
				{
					assignedLawyer: user,
				},
			],
			relations: {
				events: true,
			},
			select: {
				id: true,
				code: true,
				events: {
					id: true,
					message: true,
					scheduledAt: true,
					isSent: true,
				},
			},
			order: {
				events: {
					scheduledAt: 'DESC',
				},
			},
		})
	}

	findByIdEvents(id: string) {
		return this._expedientRepository.findOne({
			where: { id },
			relations: {
				events: true,
			},
			select: {
				id: true,
				events: {
					id: true,
					message: true,
					scheduledAt: true,
					isSent: true,
				},
			},
			order: {
				events: {
					scheduledAt: 'DESC',
				},
			},
		})
	}

	getUserAssigned(assignedUser: User, id: string) {
		return this._expedientRepository.findOne({
			where: [
				{ id, assignedAssistant: assignedUser },
				{ id, assignedLawyer: assignedUser },
			],
		})
	}

	async update(user: User, dto: UpdateExpedientDto, id: string) {
		const expedient = await this._expedientRepository.findOne({
			where: { id },
			relations: {
				assignedAssistant: true,
				assignedLawyer: true,
				parts: true,
			},
			select: {
				assignedAssistant: {
					id: true,
				},
				assignedLawyer: {
					id: true,
				},
				parts: {
					id: true,
					name: true,
					type: true,
				},
			},
		})

		if (!expedient) {
			throw new UnprocessableEntityException('Expedient not found')
		}

		if (expedient.code === dto.code) {
			expedient.code = undefined
			dto.code = undefined
		}

		if (expedient.assignedAssistant?.id === dto.assignedAssistantId) {
			dto.assignedAssistantId = undefined
		}

		if (expedient.assignedLawyer?.id === dto.assignedLawyerId) {
			dto.assignedLawyerId = undefined
		}

		return this.create(user, dto as CreateExpedientDto, expedient)
	}

	async updateDate(id: string, expedient: Partial<Expedient>) {
		return this._expedientRepository.update(id, expedient)
	}

	remove(id: number) {
		return `This action removes a #${id} expedient`
	}
}
