import { SETTINGS } from '@expedients/shared'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expedient } from '../expedients/entities/expedient.entity'
import { ExpedientsService } from '../expedients/expedients.service'
import { Notification } from '../notifications/entities/notification.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { Part } from '../parts/entities/part.entity'
import { Event } from './entities/event.entity'
import { EventsConsumer } from './events.consumer'
import { EventsController } from './events.controller'
import { EventsSchedule } from './events.schedule'
import { EventsService } from './events.service'
import { EVENT_QUEUE } from './types'

@Module({
	imports: [
		TypeOrmModule.forFeature([Expedient, Part, Notification, Event]),
		BullModule.registerQueue({
			name: EVENT_QUEUE,
		}),
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
	],
	controllers: [EventsController],
	providers: [
		EventsService,
		EventsConsumer,
		EventsSchedule,
		ExpedientsService,
		NotificationsService,
	],
})
export class EventsModule {}
