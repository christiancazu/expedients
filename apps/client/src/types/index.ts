import { User } from '@expedients/shared'

export interface CreateEvent {
  message: string
  expedientId: string
  scheduledAt: Date
}

export interface UserSession {
  user: User
  token: string
  vapidKey: string
}
