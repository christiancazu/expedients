import { SETTINGS } from '@expedients/shared'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from '../auth/auth.service'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: SETTINGS.MESSENGER_SERVICE,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						port: configService.get<number>('MESSENGER_PORT'),
					},
				}),
			},
		]),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
})
export class UsersModule {}
