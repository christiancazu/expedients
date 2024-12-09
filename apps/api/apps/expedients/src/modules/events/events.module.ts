import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { EventsConsumer } from './events.consumer'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EVENT_QUEUE } from './types'
import { ExpedientsService } from '../expedients/expedients.service'
import { Expedient } from '../expedients/entities/expedient.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { SETTINGS } from '@expedients/shared'
import { ConfigService } from '@nestjs/config'
import { Part } from '../parts/entities/part.entity'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { EventsSchedule } from './events.schedule'
import { Event } from './entities/event.entity'
import { Notification } from '../notifications/entities/notification.entity'
import { NotificationsService } from '../notifications/notifications.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Expedient, Part, Notification, Event]),
    BullModule.registerQueue({
      name: EVENT_QUEUE
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
  controllers: [EventsController],
  providers: [
    EventsService,
    EventsConsumer,
    EventsSchedule,
    ExpedientsService,
    NotificationsService
  ]
})
export class EventsModule {}
