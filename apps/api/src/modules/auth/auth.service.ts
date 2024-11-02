import { Injectable } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { SignInDto } from './dto/sign-in-auth.dto'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService
  ) {}

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

  private async provideSession(
    user: User
  ): Promise<{ user: User; token: string }> {
    return {
      user,
      token: await this._jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: user.role
      })
    }
  }
}
