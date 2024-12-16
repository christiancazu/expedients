import { unlink } from 'node:fs'
import {
	BadRequestException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import type { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
	@InjectRepository(User)
	private readonly _userRepository: Repository<User>

	private readonly _path: Record<string, string>

	constructor(private _configService: ConfigService) {
		const path = this._configService.get<Record<string, string>>('path')!
		this._path = path
	}

	async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
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

	async findAll() {
		const users = await this._userRepository.find({
			select: ['id', 'firstName', 'surname', 'avatar'],
		})

		return users.map((user) => this.sanitizeUser(user))
	}

	async findMe(user: User) {
		const _user = await this._userRepository.findOne({ where: { id: user.id } })

		return this.sanitizeUser(_user!)
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

	private sanitizeUser(user: User): Partial<User> {
		user.password = undefined

		return user
	}

	async uploadAvatar(user: User, file: Express.Multer.File) {
		user.avatar = file.filename

		const existsUser = await this._userRepository.findOne({
			where: { id: user.id },
		})

		if (existsUser?.avatar) {
			unlink(
				`${this._path.root}/${this._path.media}/avatars/${existsUser.avatar}`,
				(err) => {
					if (err) {
						throw err
					}
				},
			)
		}

		return this.sanitizeUser(await this._userRepository.save(user))
	}
}
