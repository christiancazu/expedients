import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SubscriptionNotificationDto } from './dto/subscription-notification.dto'
import { User } from '../users/entities/user.entity'
import { Notification } from './entities/notification.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly _notificationsRepository: Repository<Notification>) { }

  findSubscriptionByUser({ assignedLawyer, assignedAssistant }: {assignedLawyer: User; assignedAssistant: User}) {
    return this._notificationsRepository.find({
      where: [
        {
          registerFor: assignedLawyer
        },
        {
          registerFor: assignedAssistant
        }
      ]
    })
  }

  subscribe(user: User, dto: SubscriptionNotificationDto) {
    return this._notificationsRepository.save({
      endpoint: dto.endpoint,
      auth: dto.keys.auth,
      p256dh: dto.keys.p256dh,
      registerFor: user
    })
  }
}
