import {
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Body,
  BadRequestException,
  Inject,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserRequest } from './user-request.decorator'
import { User } from './entities/user.entity'
import { ClientProxy } from '@nestjs/microservices'
import { SETTINGS, USER_ROLES } from '@expedients/shared'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { MailActivateAccountPayload } from 'apps/messenger/src/types'

@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _authService: AuthService,
    @Inject(SETTINGS.MESSENGER_SERVICE)
    private readonly _clientProxy: ClientProxy
  ) { }

  @Get()
  findAll() {
    return this._usersService.findAll()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
    @UserRequest() user: User
  ) {
    if (user.role !== USER_ROLES.ADMIN) throw new BadRequestException('user not authorized')

    const userCreated = await this._usersService.create(createUserDto)
    const token = await this._authService.signToken(userCreated)

    try {
      await firstValueFrom(
        this._clientProxy
          .send<any , MailActivateAccountPayload>(
            SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT,
            { user: userCreated, token }
          )
      )

      return `user created successfully`

    } catch {
      throw new BadRequestException('error sending email')
    }
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this._usersService.update(id)
  }
}
