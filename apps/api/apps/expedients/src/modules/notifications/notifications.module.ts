import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { BullModule } from '@nestjs/bullmq'
import { NotificationsConsumer } from './notifications.consumer'
import { NotificationsController } from './notifications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification } from './entities/notification.entity'
import { NOTIFICATION_QUEUE } from './types'
import { NotificationsSchedule } from './notifications.schedule'
import { ExpedientsService } from '../expedients/expedients.service'
import { Expedient } from '../expedients/entities/expedient.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { SETTINGS } from '@expedients/shared'
import { ConfigService } from '@nestjs/config'
import { Part } from '../parts/entities/part.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Expedient, Part]),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE
    }),
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
    ])
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsConsumer,
    NotificationsSchedule,
    ExpedientsService
  ]
})
export class NotificationsModule {}
