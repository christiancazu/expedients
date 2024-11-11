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
      const send = await this._mailerService.sendMail({
        to: user.email,
        from: 'contact@corporativokallpa.com',
        subject: 'ACTIVACIÓN DE CUENTA',
        template: './email-confirmation',
        context: {
          firstName: user.firstName,
          surname: user.surname,
          url: [
            this._configService.get('APP_DOMAIN'),
            '/activate-account?token=',
            token
          ].join('')
        }
      })
      return send
    } catch (error) {
      throw new NotFoundException(error)
    }
  }
}
