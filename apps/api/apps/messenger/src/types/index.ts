import { User } from 'apps/expedients/src/modules/users/entities/user.entity'

export interface MailActivateAccountPayload {
  user: User;
  token: string;
}

export interface ScheduledNotificationPayload {
  assignedLawyer: User;
  assignedAssistant: User;
  notificationMessage: string;
  expedientId: string;
}
