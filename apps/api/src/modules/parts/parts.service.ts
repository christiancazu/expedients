import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from './entities/part.entity';
import { Repository } from 'typeorm';
import { Expedient } from '../expedients/entities/expedient.entity';

@Injectable()
export class PartsService {
  @InjectRepository(Part)
  private readonly _partRepository: Repository<Part>;

  async create(createPartDto: CreatePartDto) {
    const part = this._partRepository.create(createPartDto);

    const expedient = new Expedient();
    // expedient.id = createPartDto.expedientId;
    part.expedient = expedient;

    try {
      const partSaved = await this._partRepository.save(part);

      return partSaved;
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.driverError?.detail ?? error
      );
    }
  }

  findAll() {
    return `This action returns all parts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} part`;
  }

  update(id: number) {
    return `This action updates a #${id} part`;
  }

  remove(id: number) {
    return `This action removes a #${id} part`;
  }
}
