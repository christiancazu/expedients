import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import type { CreatePartDto } from './dto/create-part.dto'
import type { PartsService } from './parts.service'

@Controller('parts')
export class PartsController {
	constructor(private readonly partsService: PartsService) {}

	@Post()
	create(@Body() createPartDto: CreatePartDto) {
		return this.partsService.create(createPartDto)
	}

	@Get()
	findAll() {
		return this.partsService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.partsService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string) {
		return this.partsService.update(+id)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.partsService.remove(+id)
	}
}
