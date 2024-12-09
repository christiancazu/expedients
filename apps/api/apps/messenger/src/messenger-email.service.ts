import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailActivateAccountPayload, ScheduledEventPayload } from './types'
import { setVapidDetails } from 'web-push'

@Injectable()
export class MessengerEmailService {
  app_domain: string
  sender_email: string

  private readonly logger = new Logger()

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService
  ) {
    this.app_domain = this._configService.get('APP_DOMAIN')!
    this.sender_email = this._configService.get('SENDER_EMAIL')!

    setVapidDetails(
      `mailto:${this.sender_email}`,
      this._configService.get('VAPID_PUBLIC_KEY')!,
      this._configService.get('VAPID_PRIVATE_KEY')!
    )
  }

  async sendEmailToActivateAccount({ user, token }: MailActivateAccountPayload) {
    try {
      return this._mailerService.sendMail({
        to: user.email,
        from: `CORPORATIVO KALLPA <${this.sender_email}>`,
        subject: 'Activación de cuenta',
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
      this.logger.error(error)
    }
  }

  async sendScheduledEvent({
    assignedAssistant, assignedLawyer, eventMessage, expedientId
  }: ScheduledEventPayload) {
    const users = [assignedAssistant, assignedLawyer].filter(u => !!u)

    try {
      Promise.all(users.map(user => this._mailerService.sendMail({
        to: user.email,
        from: `CORPORATIVO KALLPA <${this.sender_email}>`,
        subject: 'Evento programado',
        template: './scheduled-event',
        context: {
          firstName: user.firstName,
          surname: user.surname,
          message: eventMessage,
          url: [
            this.app_domain,
            `/expedients/`,
            expedientId
          ].join('')
        }
      })))
    } catch (error) {
      this.logger.error(error)
    }
  }
}
