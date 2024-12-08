import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { NotificationsService } from './notifications.service'

@Injectable()
export class NotificationsSchedule {
  private readonly _logger = new Logger()

  constructor(
    private readonly _notificationsService: NotificationsService
  ) {}

  @Cron('0 */6 * * *')
  handleCron() {
    this._logger.log('CRON JOB: Setup scheduled notifications at: ', new Date())

    this._notificationsService.onModuleInit()
  }
}
