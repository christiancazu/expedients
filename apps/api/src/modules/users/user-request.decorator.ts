import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from './entities/user.entity'

export const UserRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    const user = new User()
    user.role = request.user.role
    user.id = request.user.id

    return user
  }
)
