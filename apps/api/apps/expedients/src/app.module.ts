import { join } from 'node:path'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { registerTypeOrm } from './config/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { DocumentsModule } from './modules/documents/documents.module'
import { EventsModule } from './modules/events/events.module'
import { ExpedientsModule } from './modules/expedients/expedients.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { PartsModule } from './modules/parts/parts.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { UsersModule } from './modules/users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [registerTypeOrm],
			envFilePath: ['../../../.env'],
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../../../..', 'client/dist'),
			exclude: ['/api*', '/media*'],
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) =>
				configService.get('typeorm') as TypeOrmModuleOptions,
		}),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get('REDIS_HOST'),
					port: configService.get('REDIS_PORT'),
				},
			}),
		}),
		ScheduleModule.forRoot(),
		UsersModule,
		ExpedientsModule,
		PartsModule,
		ReviewsModule,
		DocumentsModule,
		AuthModule,
		EventsModule,
		NotificationsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
