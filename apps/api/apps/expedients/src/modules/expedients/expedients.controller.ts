import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common'
import { ExpedientsService } from './expedients.service'
import { CreateExpedientDto } from './dto/create-expedient.dto'
import { FindExpedientDto } from './dto/find-expedient.dto'
import { UserRequest } from '../users/user-request.decorator'
import { User } from '../users/entities/user.entity'

@Controller('expedients')
export class ExpedientsController {
  constructor(private readonly expedientsService: ExpedientsService) {}

  @Post()
  create(@Body() createExpedientDto: CreateExpedientDto, @UserRequest() user: User) {
    return this.expedientsService.create(user.id, createExpedientDto)
  }

  @Get()
  findAll(@Query() query: FindExpedientDto) {
    return this.expedientsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expedientsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.expedientsService.update(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expedientsService.remove(+id)
  }
}
