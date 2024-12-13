import type { USER_ROLES } from '@expedients/shared'

export interface UserToken {
	id: string
	email: string
	role: USER_ROLES
	iat: number
	exp: number
}
