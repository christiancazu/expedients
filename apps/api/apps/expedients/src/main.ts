import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { MessengerModule } from 'apps/messenger/src/messenger.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  if (process.env.NODE_ENV === 'development') {
    app.enableCors()
  }

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const port = app.get(ConfigService).get('APP_PORT')

  await app.listen(port, () => console.log(`server on PORT: ${port}`))
}

async function bootstrapMessenger() {
  const app = await NestFactory.create(MessengerModule)

  const port = app.get(ConfigService).get('MESSENGER_PORT')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port
    }
  })

  await app.startAllMicroservices()
  await app.init()
}

(async () => {
  bootstrap()
  bootstrapMessenger()
})()
