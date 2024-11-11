import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { SETTINGS } from '@expedients/shared'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth/auth.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SETTINGS.MESSENGER_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('MESSENGER_PORT')
          }
        })
      }
    ]),
    TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule { }
