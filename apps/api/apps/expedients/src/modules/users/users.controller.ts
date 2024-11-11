import {
  Controller,
  Get,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
