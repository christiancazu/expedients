import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Expedient } from 'src/modules/expedients/entities/expedient.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { FIELD } from '@expedients/shared'

@Entity('documents')
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: FIELD.DOCUMENT_NAME_MAX_LENGTH })
  name: string

  @Column({ type: 'varchar', length: FIELD.DOCUMENT_KEY_MAX_LENGTH })
  key: string

  @Column({ type: 'varchar', length: FIELD.DOCUMENT_EXTENSION_MAX_LENGTH })
  extension: string

  @ManyToOne(() => Expedient, (expedient) => expedient.documents)
  expedient: Expedient

  @ManyToOne(() => User, (user) => user.createdDocuments)
  @JoinColumn()
  createdByUser: User

  @ManyToOne(() => User, (user) => user.updatedDocuments)
  updatedByUser: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
