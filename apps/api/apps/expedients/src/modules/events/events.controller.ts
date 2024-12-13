import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { CreateEventDto } from './dto/create-event.dto'
import { EventsService } from './events.service'

@Controller('events')
export class EventsController {
	constructor(private readonly _eventsService: EventsService) {}

	@Get('pending')
	findAllPending() {
		return this._eventsService.findAllPending()
	}

	@Post()
	create(@UserRequest() user: User, @Body() dto: CreateEventDto) {
		return this._eventsService.create(user, dto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this._eventsService.delete(id)
	}
}
