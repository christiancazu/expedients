import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { FIELD } from '@expedients/shared'

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: FIELD.NOTIFICATION_ENDPOINT_MAX_LENGTH })
  endpoint: string

  @Column({ type: 'varchar', length: FIELD.NOTIFICATION_AUTH_MAX_LENGTH })
  auth: string

  @Column({ type: 'varchar', length: FIELD.NOTIFICATION_P256DH_MAX_LENGTH })
  p256dh: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.notifications)
  registerFor: User
}
