import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { ReviewsService } from './reviews.service'

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
