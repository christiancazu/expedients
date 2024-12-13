import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { EventsService } from './events.service'

@Injectable()
export class EventsSchedule {
	private readonly _logger = new Logger()

	constructor(private readonly _eventsService: EventsService) {}

	@Cron('0 */6 * * *')
	handleCron() {
		this._logger.log('CRON JOB: Setup scheduled Events at: ', new Date())

		this._eventsService.onModuleInit()
	}
}
