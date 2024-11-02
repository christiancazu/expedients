import { Module } from '@nestjs/common'
import { PartsService } from './parts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from './entities/part.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Part])],
  controllers: [],
  providers: [PartsService]
})
export class PartsModule {}
