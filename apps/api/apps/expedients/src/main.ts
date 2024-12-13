import { join } from 'node:path'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { MessengerModule } from 'apps/messenger/src/messenger.module'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	if (process.env.NODE_ENV === 'development') {
		app.enableCors()
	}
	app.setGlobalPrefix('api')

	const mediaPath = app.get(ConfigService).get('STORAGE_MEDIA_PATH')
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	app.useStaticAssets(join(__dirname, `../../../${mediaPath}/media`), {
		prefix: '/media',
		index: false,
	})

	const port = app.get(ConfigService).get('APP_PORT')

	await app.listen(port, () => console.log(`server on PORT: ${port}`))
}

async function bootstrapMessenger() {
	const app = await NestFactory.create(MessengerModule)

	const port = app.get(ConfigService).get('MESSENGER_PORT')

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.TCP,
		options: {
			port,
		},
	})

	await app.startAllMicroservices()
	await app.init()
}
;(async () => {
	bootstrap()
	bootstrapMessenger()
})()
