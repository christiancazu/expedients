import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExpedientsModule } from '../expedients/expedients.module'
import { Review } from './entities/review.entity'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'

@Module({
	imports: [TypeOrmModule.forFeature([Review]), ExpedientsModule],
	controllers: [ReviewsController],
	providers: [ReviewsService],
})
export class ReviewsModule {}
