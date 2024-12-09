import { User } from '../../users/entities/user.entity'

export interface AccessTokenPayload {
  user: User
  token: string
}

export interface provideSessionPayload {
  user: User
  token: string
  vapidKey: string
}
