import {
	BadRequestException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import type { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
	@InjectRepository(User)
	private readonly _userRepository: Repository<User>

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = await this._userRepository.findOne({
			where: { email: createUserDto.email },
		})

		if (user) throw new UnprocessableEntityException('auth.errors.exists.email')

		const createUser = this._userRepository.create(createUserDto)
		const registeredUser = await this._userRepository.save(createUser)

		return this.sanitizeUser(registeredUser)
	}

	async updatePassword(email: string, password: string) {
		const user = await this.findUser({ email })

		if (user.verifiedAt) {
			throw new BadRequestException('El usuario ya fue verificado')
		}

		user.password = await user.hashPassword(password)
		user.verifiedAt = new Date()

		return this._userRepository.save(user)
	}

	findAll() {
		return this._userRepository.find({
			select: ['id', 'firstName', 'surname'],
		})
	}

	async findByEmailAndPassword({ email, password }: Partial<User>) {
		const user = await this._userRepository.findOne({ where: { email } })

		const isMatch = await user?.comparePassword(password!)

		if (!user || !isMatch)
			throw new UnprocessableEntityException(
				'El usuario o la  contraseña son incorrectos',
			)

		return this.sanitizeUser(user)
	}

	private async findUser(payload: Partial<User>) {
		const [key, value] = Object.entries(payload)[0]

		const user = await this._userRepository.findOne({
			where: { [key as string]: value },
		})

		if (!user)
			throw new UnprocessableEntityException('El usuario no ha sido encontrado')

		return user
	}

	update(id: string) {
		return `This action updates a #${id} user`
	}

	private sanitizeUser(user: User) {
		user.password = undefined

		return user
	}
}
