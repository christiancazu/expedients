import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from 'apps/expedients/src/modules/users/entities/user.entity'

@Injectable()
export class MessengerService {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService
  ) {  }

  async sendEmailToActivateAccount(user: User, token: string) {
    try {
      return this._mailerService.sendMail({
        to: user.email,
        from: 'CORPORATIVO KALLPA <contact@corporativokallpa.com>',
        subject: 'ACTIVACIÓN DE CUENTA',
        template: './email-confirmation',
        context: {
          firstName: user.firstName,
          surname: user.surname,
          url: [
            this._configService.get('APP_DOMAIN'),
            '/auth/verify-account/?token=',
            token
          ].join('')
        }
      })
    } catch (error) {
      throw new NotFoundException(error)
    }
  }
}
