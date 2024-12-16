import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { SignInDto } from './dto/sign-in-auth.dto'
import { verifyAccountDto } from './dto/verify-create-account.dto'
import { provideSessionPayload } from './types'

@Injectable()
export class AuthService {
	constructor(
		private readonly _usersService: UsersService,
		private readonly _jwtService: JwtService,
		private readonly _configService: ConfigService,
	) {}

	async signIn({ email, password }: SignInDto) {
		const user = await this._usersService.findByEmailAndPassword({
			email,
			password,
		})

		return this.provideSession(user)
	}

	async signUp(createUserDto: CreateUserDto) {
		return this._usersService.create(createUserDto)
	}

	async verifyAccount(verifyAccountDto: verifyAccountDto) {
		const { token, password } = verifyAccountDto

		try {
			this._jwtService.verify(token)
			const { email } = this._jwtService.decode(token)

			const user = await this._usersService.updatePassword(email, password)

			return this.provideSession(user)
		} catch (error) {
			if (error?.message === 'jwt expired')
				throw new UnauthorizedException('La invitación ha caducado')
			if (error?.message === 'invalid signature')
				throw new UnauthorizedException('El token no es válido')

			throw new UnprocessableEntityException(error.message)
		}
	}

	async signToken(user: Partial<User>) {
		return this._jwtService.signAsync({
			id: user.id,
			email: user.email,
			role: user.role,
		})
	}

	private async provideSession(
		user: Partial<User>,
	): Promise<provideSessionPayload> {
		return {
			user,
			token: await this.signToken(user),
			vapidKey: this._configService.get('VAPID_PUBLIC_KEY')!,
		}
	}
}
