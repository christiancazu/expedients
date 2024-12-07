import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Part } from '../../parts/entities/part.entity'
import { Review } from '../../reviews/entities/review.entity'
import { Document } from '../../documents/entities/document.entity'
import { FIELD, EXPEDIENT_STATUS } from '@expedients/shared'
import { Notification } from '../../notifications/entities/notification.entity'

@Entity('expedients')
export class Expedient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
    type: 'varchar',
    length: FIELD.EXPEDIENT_CODE_MAX_LENGTH
  })
  code: string

  @Column({
    type: 'varchar',
    length: FIELD.EXPEDIENT_SUBJECT_MAX_LENGTH
  })
  subject: string

  @Column({
    type: 'varchar',
    length: FIELD.EXPEDIENT_PROCESS_MAX_LENGTH,
    nullable: true
  })
  process: string

  @Column({
    type: 'varchar',
    length: FIELD.EXPEDIENT_COURT_MAX_LENGTH
  })
  court: string

  @Column({
    type: 'enum',
    name: 'status',
    enumName: 'status',
    enum: EXPEDIENT_STATUS,
    default: EXPEDIENT_STATUS.EN_EJECUCION
  })
  status: EXPEDIENT_STATUS

  @Column({
    type: 'varchar',
    length: FIELD.EXPEDIENT_STATUS_DESCRIPTION_MAX_LENGTH,
    nullable: true
  })
  statusDescription: string

  @ManyToOne(() => User, (user) => user.assignedLawyerExpedients)
  assignedLawyer: User

  @ManyToOne(() => User, (user) => user.assignedAssistantExpedients)
  assignedAssistant: User

  @ManyToOne(() => User, (user) => user.createdExpedients)
  createdByUser: User

  @ManyToOne(() => User, (user) => user.updatedExpedients)
  updatedByUser: User

  @OneToMany(() => Part, (part) => part.expedient)
  parts: Part[]

  @OneToMany(() => Review, (review) => review.expedient)
  reviews: Review[]

  @OneToMany(() => Document, (document) => document.expedient)
  documents: Document[]

  @OneToMany(() => Notification, (notification) => notification.expedient)
  notifications: Notification[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @BeforeInsert()
  async defaultStatus() {
    if (!this.status) {
      this.status = EXPEDIENT_STATUS.EN_EJECUCION
    }
  }

  constructor(id?: string) {
    if (id) {
      this.id = id
    }
  }
}
