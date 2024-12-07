import { InjectQueue } from '@nestjs/bullmq'
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common'
import { Job, Queue } from 'bullmq'
import { User } from '../users/entities/user.entity'
import { Notification } from './entities/notification.entity'
import { Between, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { INTERVAL_SCHEDULED, JobNotification, JobNotificationData, NOTIFICATION_QUEUE } from './types'
import { Expedient } from '../expedients/entities/expedient.entity'
import { CreateNotificationDto } from './dto/create-notification.dto'

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(Notification)
    private readonly _notificationRepository: Repository<Notification>,

    @InjectQueue(NOTIFICATION_QUEUE) private _expedientsQueue: Queue<JobNotificationData>
  ) { }

  async onModuleInit() {
    await this.removeJobs()

    this.setupScheduledNotifications()
  }

  async removeJobs() {
    await this._expedientsQueue.drain()
    const currentJobs = await this._expedientsQueue.getJobs()
    await Promise.all(currentJobs.map((job: Job) => job.remove({ removeChildren: true })))
  }

  async setupScheduledNotifications() {
    const nowTime = new Date().getTime()

    const notifications = await this._notificationRepository.find({
      where: {
        scheduledAt: Between(new Date(nowTime), new Date(nowTime + INTERVAL_SCHEDULED))
      }
    })

    const jobs: JobNotification[] = notifications.map((notification) => ({
      name: NOTIFICATION_QUEUE,
      data: {
        id: notification.id
      },
      opts: {
        removeOnComplete: true,
        removeOnFail: true,
        delay: Number(new Date(notification.scheduledAt).getTime() - new Date().getTime())
      }
    }))

    this._expedientsQueue.addBulk(jobs)
  }

  async delete(id: string) {
    const jobs = await this._expedientsQueue.getJobs()
    const existingJob = jobs.find((job) => job.data.id === id)

    if (existingJob) {
      await this._expedientsQueue.remove(existingJob.id!)
    }

    return this._notificationRepository.delete(id)
  }

  async create(user: User, dto: CreateNotificationDto) {
    const delay = this.ensureAvailableDateNotification(dto.scheduledAt)

    const notification = this._notificationRepository.create({
      message: dto.message,
      createdByUser: user,
      expedient: new Expedient(dto.expedientId),
      scheduledAt: dto.scheduledAt
    })

    const { id } = await this._notificationRepository.save(notification)

    const isAvailableForCurrentQueue = delay < INTERVAL_SCHEDULED

    if (isAvailableForCurrentQueue) {
      return this._expedientsQueue.add(
        NOTIFICATION_QUEUE,
        { id },
        { delay }
      )
    }
  }

  findAll() {
    return this._notificationRepository.find()
  }

  private ensureAvailableDateNotification(date: string) {
    const dateTimeInt = Number(new Date(date).getTime() - new Date().getTime())

    if (dateTimeInt < 0) {
      throw new BadRequestException('La fecha debe ser mayor a la actual')
    }

    return dateTimeInt
  }
}
