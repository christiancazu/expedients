import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpedientsService } from './expedients.service';
import { CreateExpedientDto } from './dto/create-expedient.dto';
import { UpdateExpedientDto } from './dto/update-expedient.dto';

@Controller('expedients')
export class ExpedientsController {
  constructor(private readonly expedientsService: ExpedientsService) {}

  @Post()
  create(@Body() createExpedientDto: CreateExpedientDto) {
    return this.expedientsService.create(createExpedientDto);
  }

  @Get()
  findAll() {
    return this.expedientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expedientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpedientDto: UpdateExpedientDto) {
    return this.expedientsService.update(+id, updateExpedientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expedientsService.remove(+id);
  }
}
