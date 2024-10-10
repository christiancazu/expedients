import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Expedient } from '../expedients/entities/expedient.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  @InjectRepository(Review)
  private readonly _reviewsRepository: Repository<Review>;

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const review = this._reviewsRepository.create(createReviewDto);

    const expedient = new Expedient();
    expedient.id = createReviewDto.expedientId;
    review.expedient = expedient;

    const user = new User();
    user.id = userId;
    review.updatedBy = user;

    try {
      const reviewSaved = await this._reviewsRepository.save(review);

      return reviewSaved;
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.driverError?.detail ?? error
      );
    }
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
