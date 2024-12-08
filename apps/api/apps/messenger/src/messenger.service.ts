import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailActivateAccountPayload, ScheduledNotificationPayload } from './types'

@Injectable()
export class MessengerService {
  app_domain: string

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService
  ) {
    this.app_domain = this._configService.get('APP_DOMAIN')!
  }

  async sendEmailToActivateAccount({ user, token }: MailActivateAccountPayload) {
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
            this.app_domain,
            '/auth/verify-account/?token=',
            token
          ].join('')
        }
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async sendScheduledNotification({
    assignedAssistant, assignedLawyer, notificationMessage, expedientId
  }: ScheduledNotificationPayload) {
    const users = [assignedAssistant, assignedLawyer].filter(u => !!u)

    try {
      Promise.all(users.map(user => this._mailerService.sendMail({
        to: user.email,
        from: 'CORPORATIVO KALLPA <contact@corporativokallpa.com>',
        subject: 'NOTIFICACIÓN PROGRAMADA',
        template: './scheduled-notification',
        context: {
          firstName: user.firstName,
          surname: user.surname,
          message: notificationMessage,
          url: [
            this.app_domain,
            `/expedients/`,
            expedientId
          ].join('')
        }
      })))
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
