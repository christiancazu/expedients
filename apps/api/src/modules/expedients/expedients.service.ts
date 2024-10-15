import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateExpedientDto } from './dto/create-expedient.dto';
import { UpdateExpedientDto } from './dto/update-expedient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expedient } from './entities/expedient.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';

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

  async findAll(): Promise<Expedient[]> {
    const query = await this._expedientRepository
      .createQueryBuilder('expedients')
      .select('expedients')
      .leftJoinAndSelect('expedients.parts', 'parts')
      .leftJoin('expedients.updatedByUser', 'updatedByUser')
      .leftJoinAndMapMany(
        "expedients.reviews",
        Review,
        "reviews",
        'reviews."expedientId" = expedients.id'
      ).where(
        (query) => "reviews.id =" + query
          .subQuery()
          .select("id")
          .from(Review, "p")
          .where('expedients.id=reviews."expedientId"')
          .orderBy('"createdAt"', "DESC")
          .limit(1)
          .getQuery()
      ).orWhere('reviews.id IS NULL')
      .addSelect([
        'updatedByUser.id',
        'updatedByUser.firstName',
        'updatedByUser.lastName'
      ])
      .getMany();

    return query;
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
