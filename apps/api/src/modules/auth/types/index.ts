import { User } from 'src/modules/users/entities/user.entity'

export interface AccessTokenPayload {
  user: User;
  token: string;
}
