import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from '../parts/entities/part.entity'
import { Expedient } from './entities/expedient.entity'
import { ExpedientsController } from './expedients.controller'
import { ExpedientsService } from './expedients.service'

@Module({
	imports: [TypeOrmModule.forFeature([Expedient, Part])],
	controllers: [ExpedientsController],
	providers: [ExpedientsService],
	exports: [ExpedientsService],
})
export class ExpedientsModule {}
