import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Expedient } from '../../expedients/entities/expedient.entity'
import { User } from '../../users/entities/user.entity'

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  message: string

  @Column({ type: 'boolean', default: false })
  isSent: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.events)
  createdByUser: User

  @Column({ type: 'timestamptz' })
  scheduledAt: Date

  @ManyToOne(() => Expedient, (expedient) => expedient.events)
  expedient: Expedient
}
