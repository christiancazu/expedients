import { Module } from '@nestjs/common'
import { ExpedientsService } from './expedients.service'
import { ExpedientsController } from './expedients.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expedient } from './entities/expedient.entity'
import { Part } from '../parts/entities/part.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Expedient, Part])
  ],
  controllers: [ExpedientsController],
  providers: [ExpedientsService],
  exports: [ExpedientsService]
})
export class ExpedientsModule {}
