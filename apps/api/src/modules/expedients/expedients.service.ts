import { Injectable } from '@nestjs/common';
import { CreateExpedientDto } from './dto/create-expedient.dto';
import { UpdateExpedientDto } from './dto/update-expedient.dto';

@Injectable()
export class ExpedientsService {
  create(createExpedientDto: CreateExpedientDto) {
    return 'This action adds a new expedient';
  }

  findAll() {
    return `This action returns all expedients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expedient`;
  }

  update(id: number, updateExpedientDto: UpdateExpedientDto) {
    return `This action updates a #${id} expedient`;
  }

  remove(id: number) {
    return `This action removes a #${id} expedient`;
  }
}
