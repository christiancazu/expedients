import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { UserRequest } from '../users/user-request.decorator'
import { User } from '../users/entities/user.entity'
import { CreateNotificationDto } from './dto/create-notification.dto'

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly _usersService: NotificationsService
  ) { }

  @Get()
  findAll() {
    return this._usersService.findAll()
  }

  @Post()
  create(
    @UserRequest() user: User,
    @Body() dto: CreateNotificationDto
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
