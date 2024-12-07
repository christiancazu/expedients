import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { JobNotificationData, NOTIFICATION_QUEUE } from './types'

@Processor(NOTIFICATION_QUEUE)
export class NotificationsConsumer extends WorkerHost {

  async process({ data: { id } }: Job<Pick<JobNotificationData, 'id'>, any, string>): Promise<any> {

  }
}
