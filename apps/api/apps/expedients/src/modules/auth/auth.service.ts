import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { SignInDto } from './dto/sign-in-auth.dto'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { VerifyCreateAccountDto } from './dto/verify-create-account.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService
  ) { }

  async signIn({ email, password }: SignInDto) {
    const user = await this._usersService.findByEmailAndPassword({
      email,
      password
    })

    return this.provideSession(user)
  }

  async signUp(createUserDto: CreateUserDto) {
    return this._usersService.create(createUserDto)
  }

  async verifyCreateAccount(verifyCreateAccountDto: VerifyCreateAccountDto) {
    const { token, password } = verifyCreateAccountDto

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

  async signToken(user: User) {
    return this._jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role
    })
  }

  private async provideSession(user: User): Promise<{ user: User; token: string }> {
    return {
      user,
      token: await this.signToken(user)
    }
  }
}
