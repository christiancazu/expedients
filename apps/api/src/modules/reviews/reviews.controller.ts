import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { CreateReviewDto } from './dto/create-review.dto'
import { UserRequest } from '../users/user-request.decorator'
import { User } from '../users/entities/user.entity'
import { UserToken } from '../users/users.interfaces'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @UserRequest() user: User) {
    return this.reviewsService.create(user, createReviewDto)
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.reviewsService.update(+id)
  }

  @Delete(':id')

  remove(@Param('id') id: string, @UserRequest() user: User) {
    return this.reviewsService.remove(id, user)
  }
}
