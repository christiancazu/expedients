import { Module } from '@nestjs/common'
import { MessengerController } from './messenger.controller'
import { MessengerEmailService } from './messenger-email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { MessengerWebService } from './messenger-web.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env']
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          auth: {
            user: configService.get('MAIL_AUTH_USER'),
            pass: configService.get('MAIL_AUTH_PASS')
          }
        },
        template: {
          dir: __dirname + '/assets/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        },
        options: {
          partials: {
            dir: __dirname + '/assets/templates',
            options: {
              strict: true
            }
          }
        }
      })
    })
  ],
  controllers: [MessengerController],
  providers: [MessengerEmailService, MessengerWebService]
})
export class MessengerModule {}
