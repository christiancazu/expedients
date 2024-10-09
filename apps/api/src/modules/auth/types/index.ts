import { User } from 'src/modules/users/entities/user.entity';

export type AccessTokenPayload = {
  user: User;
  token: string;
};
