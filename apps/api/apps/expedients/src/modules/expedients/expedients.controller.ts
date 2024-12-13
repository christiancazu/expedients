import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { CreateExpedientDto } from './dto/create-expedient.dto'
import { FindExpedientDto } from './dto/find-expedient.dto'
import { UpdateExpedientDto } from './dto/update-expedient.dto'
import { ExpedientsService } from './expedients.service'

@Controller('expedients')
export class ExpedientsController {
	constructor(private readonly expedientsService: ExpedientsService) {}

	@Post()
	@HttpCode(201)
	create(
		@Body() createExpedientDto: CreateExpedientDto,
		@UserRequest() user: User,
	) {
		return this.expedientsService.create(user, createExpedientDto)
	}

	@Get()
	findAll(@Query() query: FindExpedientDto) {
		return this.expedientsService.findAll(query)
	}

	@Get('events')
	findEvents(@UserRequest() user: User) {
		return this.expedientsService.findEvents(user)
	}

	@Get(':id/events')
	findByIdEvents(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.expedientsService.findByIdEvents(id)
	}

	@Get(':id')
	findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.expedientsService.findOne(id)
	}

	@Patch(':id')
	update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateExpedientDto,
		@UserRequest() user: User,
	) {
		return this.expedientsService.update(user, dto, id)
	}
}
