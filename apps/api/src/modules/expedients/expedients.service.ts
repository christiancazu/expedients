import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateExpedientDto } from './dto/create-expedient.dto';
import { UpdateExpedientDto } from './dto/update-expedient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expedient } from './entities/expedient.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';
import { FindExpedientDto } from './dto/find-expedient.dto';

@Injectable()
export class ExpedientsService {
  @InjectRepository(Expedient)
  private readonly _expedientRepository: Repository<Expedient>;

  async create(userId: string, createExpedientDto: CreateExpedientDto) {
    const expedient = this._expedientRepository.create(createExpedientDto);

    const user = new User();
    user.id = userId;
    expedient.createdByUser = expedient.updatedByUser = user;

    try {
      const expedientSaved = await this._expedientRepository.save(expedient);

      return expedientSaved;
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.driverError?.detail ?? error
      );
    }
  }

  async findAll(query: FindExpedientDto): Promise<Expedient[]> {
    const { byText, text, updatedByUser, status } = query;

    const qb = this._expedientRepository
      .createQueryBuilder('expedients')
      .select('expedients')
      .leftJoin('expedients.updatedByUser', 'updatedByUser')
      .addSelect([
        'updatedByUser.id',
        'updatedByUser.firstName',
        'updatedByUser.lastName'
      ])
      .leftJoinAndSelect('expedients.parts', 'parts');

    /** If exists filter: text will filter by each byText item */
    if (text) {
      const byTextLength = byText?.length;

      /** include AND WHERE if exists at least one byText item */
      if (byTextLength) {
        const _byText = byText[0];
        qb.andWhere('expedients.' + _byText + '::text ILIKE :q' + _byText, {
          ['q' + _byText]: `%${text}%`
        });
      }

      /** include OR WHERE if exists multiple byText item */
      if (byTextLength > 1) {
        for (let index = 0; index < byTextLength - 1; index++) {
          const _byText = byText[index + 1];
          qb.orWhere('expedients.' + _byText + '::text ILIKE :q' + _byText, {
            ['q' + _byText]: `%${text}%`
          });
        }
      }
    }

    /** If exists filter: updatedByUser will filter by his id */
    if (updatedByUser) {
      qb.andWhere('expedients.updatedByUser = :updatedByUser', {
        updatedByUser
      });
    }

    /** If exists filter: status will filter by it */
    if (status) {
      qb.andWhere('expedients.status = :status', {
        status
      });
    }

    /** LEFT JOIN expedients with reviews and will select the last review by CreatedAt or empty reviews */
    qb.leftJoinAndMapOne(
      'expedients.reviews',
      Review,
      'reviews',
      'reviews."expedientId" = expedients.id'
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
    `);

    const expedients = await qb.getMany();

    return expedients;
  }

  findOne(id: string) {
    return this._expedientRepository.findOne({
      where: { id },
      relations: {
        parts: true,
        createdByUser: true,
        updatedByUser: true,
        reviews: true
      },
      select: {
        parts: {
          id: true,
          name: true,
          type: true
        },
        createdByUser: {
          firstName: true,
          lastName: true
        },
        updatedByUser: {
          firstName: true,
          lastName: true
        },
        reviews: {
          id: true,
          description: true,
          createdAt: true
        }
      }
    });
  }

  update(id: number, updateExpedientDto: UpdateExpedientDto) {
    return `This action updates a #${id} expedient`;
  }

  remove(id: number) {
    return `This action removes a #${id} expedient`;
  }
}
