import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from './entities/part.entity'
import { PartsService } from './parts.service'

@Module({
	imports: [TypeOrmModule.forFeature([Part])],
	controllers: [],
	providers: [PartsService],
})
export class PartsModule {}
