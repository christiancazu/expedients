import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Expedient } from 'src/modules/expedients/entities/expedient.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { FIELD } from 'types';

@Entity('documents')
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: FIELD.DOCUMENT_NAME_MAX_LENGTH })
  name: string;

  @Column({ type: 'varchar', length: FIELD.DOCUMENT_URL_MAX_LENGTH })
  url: string;

  @Column({ type: 'varchar', length: FIELD.DOCUMENT_TYPE_MAX_LENGTH })
  type: string;

  @ManyToOne(() => Expedient, (expedient) => expedient.documents)
  expedient: Expedient;

  @OneToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @OneToOne(() => User)
  @JoinColumn()
  updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
