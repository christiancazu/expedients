import { BulkJobOptions } from 'bullmq'

export interface JobNotificationData {
  expedientId: string;
  notificationId: string;
}

export interface JobNotification {
  name: string;
  data: JobNotificationData;
  opts: BulkJobOptions;
}

export const NOTIFICATION_QUEUE = 'NOTIFICATION_QUEUE'

export const INTERVAL_SCHEDULED = 1000 * 60 * 60 * 6 // 6 hours
