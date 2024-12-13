import { SETTINGS, USER_ROLES } from '@expedients/shared'
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import type { ClientProxy } from '@nestjs/microservices'
import type { MailActivateAccountPayload } from 'apps/messenger/src/types'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { UserRequest } from './user-request.decorator'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(
		private readonly _usersService: UsersService,
		private readonly _authService: AuthService,
		@Inject(SETTINGS.MESSENGER_SERVICE)
		private readonly _clientProxy: ClientProxy,
	) {}

	@Get()
	findAll() {
		return this._usersService.findAll()
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() createUserDto: CreateUserDto,
		@UserRequest() user: User,
	) {
		if (user.role !== USER_ROLES.ADMIN)
			throw new BadRequestException('user not authorized')

		const userCreated = await this._usersService.create(createUserDto)
		const token = await this._authService.signToken(userCreated)

		try {
			await firstValueFrom(
				this._clientProxy.send<any, MailActivateAccountPayload>(
					SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT,
					{ user: userCreated, token },
				),
			)

			return 'user created successfully'
		} catch {
			throw new BadRequestException('error sending email')
		}
	}

	@Patch(':id')
	update(@Param('id') id: string) {
		return this._usersService.update(id)
	}
}
