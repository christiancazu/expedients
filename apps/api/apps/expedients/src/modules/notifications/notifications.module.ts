import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { BullModule } from '@nestjs/bullmq'
import { NotificationsConsumer } from './notifications.consumer'
import { NotificationsController } from './notifications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification } from './entities/notification.entity'
import { NOTIFICATION_QUEUE } from './types'

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE
    })
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsConsumer]
})
export class NotificationsModule {}
