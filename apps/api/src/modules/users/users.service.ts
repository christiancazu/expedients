import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_ROLES } from 'types';

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

    if (createUserDto.role === USER_ROLES.ADMIN) {
      createUser.role = USER_ROLES.PRACTICANTE;
    }

    const registeredUser = await this._userRepository.save(createUser);

    return this.sanitizeUser(registeredUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByEmailAndPassword({ email, password }: Partial<User>) {
    const user = await this._userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnprocessableEntityException('not found');
    }

    const isMatch = await user.comparePassword(password!);

    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return this.sanitizeUser(user);
  }

  async findOne(payload: Partial<User>) {
    const [key, value] = Object.entries(payload)[0];

    return this._userRepository.findOne({
      where: { [key as string]: value }
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete user.password;

    return user;
  }
}
