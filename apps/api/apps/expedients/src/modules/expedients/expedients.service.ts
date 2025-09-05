import { EXPEDIENT_TYPE } from '@expedients/shared'
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, type Repository } from 'typeorm'
import { UpdatePartDto } from '../parts/dto/update-part.dto'
import { Part } from '../parts/entities/part.entity'
import { PartType } from '../parts/modules/part-types/entities/part-types.entity'
import { Review } from '../reviews/entities/review.entity'
import { AlsService } from '../shared/als/als.service'
import {
  Pagination,
  PaginationDto,
} from '../shared/pagination/dto/pagination.dto'
import { User } from '../users/entities/user.entity'
import { REQUEST_EXPEDIENT_TYPE } from './decorators/set-expedient-type.decorator'
import type { CreateExpedientDto } from './dto/create-expedient.dto'
import type { FindExpedientDto } from './dto/find-expedient.dto'
import {
  UpdateExpedientConsultancyDto,
  UpdateExpedientInvestigationProcessesDto,
  UpdateExpedientJudicialProcessesDto,
} from './dto/update-expedient.dto'
import { Expedient } from './entities/expedient.entity'
import { ExpedientStatus } from './modules/expedient-status/entities/expedient-status.entity'
import { ExpedientStatusService } from './modules/expedient-status/expedient-status.service'
import { MatterType } from './modules/matter-types/entities/matter-types.entity'
import { ProcessType } from './modules/process-types/entities/process-types.entity'

// solo creador de expedient podria modificar asignados o editar
@Injectable()
export class ExpedientsService {
  constructor(
    @InjectRepository(Expedient)
    private readonly _expedientRepository: Repository<Expedient>,

    @InjectRepository(Part)
    private readonly _partsRepository: Repository<Part>,

    private readonly _alsService: AlsService,

    private readonly _expedientStatusService: ExpedientStatusService,
  ) {}

  async create(user: User, dto: CreateExpedientDto, expedient?: Expedient) {
    const { parts, ...restExpedient } = dto

    const createdExpedient = this._expedientRepository.create({
      ...restExpedient,
      id: expedient?.id,
    })

    if (!expedient) {
      createdExpedient.createdByUser = user
    }

    createdExpedient.updatedByUser = user

    if (dto.assignedLawyerId) {
      createdExpedient.assignedLawyer = new User(dto.assignedLawyerId)
    }

    if (dto.assignedAssistantId) {
      createdExpedient.assignedAssistant = new User(dto.assignedAssistantId)
    }

    if (dto.processTypeId) {
      createdExpedient.processType = new ProcessType(dto.processTypeId)
    }

    if (dto.matterTypeId) {
      createdExpedient.matterType = new MatterType(dto.matterTypeId)
    }

    if (dto.statusId) {
      createdExpedient.status = new ExpedientStatus(dto.statusId)

      const expedientStatusOtros =
        await this._expedientStatusService.cacheGetExpedientStatusOtros()

      if (dto.statusId !== expedientStatusOtros?.id) {
        createdExpedient.statusDescription = null
      }
    }

    try {
      createdExpedient.type = this.getExpedientType()

      const savedExpedient =
        await this._expedientRepository.save(createdExpedient)

      if (parts?.length) {
        const createdParts = this._partsRepository.create(
          parts.map((part) => {
            const newPart = new Part()
            Object.assign(newPart, part)
            if (part.typeId) {
              newPart.type = new PartType(part.typeId)
              newPart.typeDescription = null
            }
            return { ...newPart, expedient: savedExpedient }
          }),
        )

        await this._partsRepository.save(createdParts)
      }
      return savedExpedient
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.driverError?.detail ?? error,
      )
    }
  }

  async findAll(dto: FindExpedientDto): Promise<PaginationDto<Expedient>> {
    const {
      text,
      updatedByUser,
      matterType,
      status,
      skip,
      order,
      page,
      perPage,
    } = dto

    const qb = this._expedientRepository
      .createQueryBuilder('expedients')
      .select('expedients')
      .leftJoinAndSelect('expedients.processType', 'processType')
      .leftJoinAndSelect('expedients.matterType', 'matterType')
      .leftJoinAndSelect('expedients.status', 'status')
      .leftJoin('expedients.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('expedients.parts', 'parts')
      .leftJoinAndSelect('parts.type', 'partType')
      .addSelect([
        'updatedByUser.firstName',
        'updatedByUser.surname',
        'updatedByUser.avatar',
      ])
      .leftJoin('expedients.assignedLawyer', 'assignedLawyer')
      .addSelect([
        'assignedLawyer.firstName',
        'assignedLawyer.surname',
        'assignedLawyer.avatar',
      ])
      .leftJoin('expedients.assignedAssistant', 'assignedAssistant')
      .addSelect([
        'assignedAssistant.firstName',
        'assignedAssistant.surname',
        'assignedLawyer.avatar',
      ])
      .where('expedients.type = :type', { type: this.getExpedientType() })

    /** If exists filter: text will filter by each filterable field */
    if (text) {
      qb.andWhere(
        new Brackets((_qb) => {
          _qb.where('expedients.code::text ILIKE :qcode', {
            qcode: `%${text}%`,
          })

          if (this.getExpedientType() !== EXPEDIENT_TYPE.CONSULTANCY) {
            _qb.orWhere(
              '"processType".description::text ILIKE :qProcessTypeDescription',
              {
                qProcessTypeDescription: `%${text}%`,
              },
            )
          }

          for (const field of this.defaultFieldsFilterablesByText()) {
            _qb.orWhere(`expedients.${field}::text ILIKE :q${field}`, {
              [`q${field}`]: `%${text}%`,
            })
          }
        }),
      )
    }

    /** If exists filter: updatedByUser will filter by his id */
    if (updatedByUser) {
      qb.andWhere('expedients.updatedByUser = :updatedByUser', {
        updatedByUser,
      })
    }

    /** If exists filter: status will filter by it */
    if (status) {
      qb.andWhere('status.description = :statusDescription', {
        statusDescription: status,
      })
    }

    if (matterType) {
      qb.andWhere('matterType.description = :matterTypeDescription', {
        matterTypeDescription: matterType,
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

    qb.orderBy('expedients.updatedAt', order).skip(skip).take(perPage)

    const [expedients, totalCount] = await qb.getManyAndCount()

    const pageMetaDto = new Pagination({
      totalCount,
      pageOptionsDto: { skip, order, page, perPage },
    })

    return new PaginationDto(expedients, pageMetaDto)
  }

  private defaultFieldsFilterablesByText(): string[] {
    const entityType = this.getExpedientType()

    switch (entityType) {
      case EXPEDIENT_TYPE.CONSULTANCY:
        return ['entity', 'procedure']

      default:
        return ['court']
    }
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
        type: true,
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

  async findOne(id: string) {
    const expedient = await this._expedientRepository.findOne({
      where: { id, type: this.getExpedientType() },
      relations: {
        parts: {
          type: true,
        },
        assignedLawyer: true,
        assignedAssistant: true,
        createdByUser: true,
        updatedByUser: true,
        documents: true,
        processType: true,
        status: true,
        matterType: true,
        reviews: {
          createdByUser: true,
        },
      },
      select: {
        parts: {
          id: true,
          name: true,
          type: {
            id: true,
            description: true,
            expedientType: true,
          },
          typeDescription: true,
          createdAt: true,
        },
        assignedLawyer: {
          id: true,
          firstName: true,
          surname: true,
          avatar: true,
        },
        assignedAssistant: {
          id: true,
          firstName: true,
          surname: true,
          avatar: true,
        },
        createdByUser: {
          id: true,
          firstName: true,
          surname: true,
          avatar: true,
        },
        updatedByUser: {
          firstName: true,
          surname: true,
          avatar: true,
        },
        reviews: {
          id: true,
          description: true,
          createdAt: true,
          createdByUser: {
            id: true,
            firstName: true,
            surname: true,
            avatar: true,
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
        parts: {
          createdAt: 'ASC',
          id: 'ASC',
        },
      },
    })

    if (!expedient) {
      throw new BadRequestException()
    }

    return expedient
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
        type: true,
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

  async update(
    user: User,
    dto:
      | UpdateExpedientConsultancyDto
      | UpdateExpedientJudicialProcessesDto
      | UpdateExpedientInvestigationProcessesDto,
    id: string,
  ) {
    const expedient = await this._expedientRepository.findOne({
      where: { id },
      relations: {
        assignedAssistant: true,
        assignedLawyer: true,
        parts: {
          type: true,
        },
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
          type: {
            id: true,
            description: true,
            expedientType: true,
          },
        },
      },
    })

    if (!expedient) {
      throw new UnprocessableEntityException('Expedient not found')
    }

    if (expedient.code === dto.code) {
      expedient.code = undefined!
      dto.code = undefined
    }

    if (expedient.assignedAssistant?.id === dto.assignedAssistantId) {
      dto.assignedAssistantId = undefined
    }

    if (expedient.assignedLawyer?.id === dto.assignedLawyerId) {
      dto.assignedLawyerId = undefined
    }

    const createdExpedient = await this.create(user, dto as any, expedient)

    if (!createdExpedient) {
      throw new UnprocessableEntityException('Error updating expedient')
    }

    let deletedParts: Part[] = []

    deletedParts = expedient.parts.reduce<Part[]>((acc, part) => {
      const existsPart = dto.parts?.find((p: UpdatePartDto) => p.id === part.id)

      if (!existsPart) {
        acc.push(part)
      }
      return acc
    }, [])

    if (deletedParts.length) {
      await this._partsRepository.remove(deletedParts)
    }

    return createdExpedient
  }

  async updateDate(id: string, expedient: Partial<Expedient>) {
    return this._expedientRepository.update(id, expedient)
  }

  remove(id: number) {
    return `This action removes a #${id} expedient`
  }

  private getExpedientType(): EXPEDIENT_TYPE {
    return this._alsService.get<EXPEDIENT_TYPE>(
      REQUEST_EXPEDIENT_TYPE,
    ) as EXPEDIENT_TYPE
  }
}
