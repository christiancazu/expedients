import type { BulkJobOptions } from 'bullmq'

export interface JobEventData {
	expedientId: string
	eventId: string
}

export interface JobEvent {
	name: string
	data: JobEventData
	opts: BulkJobOptions
}

export const EVENT_QUEUE = 'EVENT_QUEUE'

export const INTERVAL_SCHEDULED = 1000 * 60 * 60 * 6 // 6 hours
