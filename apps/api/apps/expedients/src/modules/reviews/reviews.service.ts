import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateReviewDto } from './dto/create-review.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Review } from './entities/review.entity'
import { Repository } from 'typeorm'
import { Expedient } from '../expedients/entities/expedient.entity'
import { User } from '../users/entities/user.entity'
import { ExpedientsService } from '../expedients/expedients.service'

@Injectable()
export class ReviewsService {
  @InjectRepository(Review)
  private readonly _reviewsRepository: Repository<Review>

  constructor(
    private readonly _expedientsService: ExpedientsService
  ) {}


  async create(user: User, createReviewDto: CreateReviewDto) {
    const existsUser = await this._expedientsService.getUserAssigned(user, createReviewDto.expedientId)

    if (!existsUser) {
      throw new UnprocessableEntityException('user is not assigned to expedient')
    }

    const expedient = new Expedient()
    expedient.id = createReviewDto.expedientId

    const review = this._reviewsRepository.create(createReviewDto)
    review.expedient = expedient
    review.createdByUser = user

    if (createReviewDto.createdAt) {
      review.createdAt = new Date(createReviewDto.createdAt)
    }

    try {
      const reviewSaved = await this._reviewsRepository.save(review)

      return reviewSaved
    } catch (error) {
      throw new UnprocessableEntityException(error?.driverError?.detail ?? error)
    }
  }

  findAll() {
    return `This action returns all reviews`
  }

  findOne(id: string) {
    return this._reviewsRepository.findOne({
      where: { id },
      relations: {
        createdByUser: true
      },
      select: {
        createdByUser: {
          id: true
        }
      }
    })
  }

  update(id: number) {
    return `This action updates a #${id} review`
  }

  async remove(id: string, user: User): Promise<Review> {
    const review = await this.findOne(id)

    if (user.id !== review?.createdByUser.id) {
      throw new UnprocessableEntityException('user is not review creator')
    }

    return this._reviewsRepository.remove(review)
  }
}
