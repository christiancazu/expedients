import { Module } from '@nestjs/common';
import { ExpedientsService } from './expedients.service';
import { ExpedientsController } from './expedients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expedient } from './entities/expedient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expedient])],
  controllers: [ExpedientsController],
  providers: [ExpedientsService]
})
export class ExpedientsModule {}
