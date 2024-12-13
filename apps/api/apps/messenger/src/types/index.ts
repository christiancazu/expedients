import { User } from 'apps/expedients/src/modules/users/entities/user.entity'
import { WebPushError } from 'web-push'

export interface MailActivateAccountPayload {
	user: User
	token: string
}

export interface ScheduledEventPayload {
	assignedLawyer: User
	assignedAssistant: User
	eventMessage: string
	expedientId: string
}

export interface ErrorPushNotification {
	status: number
	reason?: WebPushError
}
