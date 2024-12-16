import type { User } from '../../users/entities/user.entity'

export interface AccessTokenPayload {
	user: User
	token: string
}

export interface provideSessionPayload {
	user: Partial<User>
	token: string
	vapidKey: string
}
