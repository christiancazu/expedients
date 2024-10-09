import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLES } from './interfaces';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly _userRepository: Repository<User>;
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this._userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (user) {
      throw new UnprocessableEntityException('auth.errors.exists.email');
    }

    const createUser = await this._userRepository.create(createUserDto);

    if (createUserDto.role === ROLES.ADMIN) {
      createUser.role = ROLES.PRACTICANTE;
    }

    return this._userRepository.save(createUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this._userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnprocessableEntityException('not found');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
