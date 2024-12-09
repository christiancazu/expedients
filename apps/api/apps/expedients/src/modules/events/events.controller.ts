import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post
} from '@nestjs/common'
import { EventsService } from './events.service'
import { UserRequest } from '../users/user-request.decorator'
import { User } from '../users/entities/user.entity'
import { CreateEventDto } from './dto/create-event.dto'

@Controller('events')
export class EventsController {
  constructor(
    private readonly _usersService: EventsService
  ) { }

  @Get()
  findAllPending() {
    return this._usersService.findAllPending()
  }

  @Post()
  create(
    @UserRequest() user: User,
    @Body() dto: CreateEventDto
  ) {
    return this._usersService.create(user, dto)
  }

  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this._usersService.delete(id)
  }
}
