import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import './dotenv'

import appConfig from './app.config'
import { typeormConfig } from './typeorm.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, typeormConfig],
		}),
	],
})
export class AppConfigModule {}
