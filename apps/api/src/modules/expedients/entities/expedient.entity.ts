import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Part } from 'src/modules/parts/entities/part.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Document } from 'src/modules/documents/entities/document.entity';
import { FIELD, EXPEDIENT_STATUS } from 'types';

@Entity('expedients')
export class Expedient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: FIELD.EXPEDIENT_CODE_MAX_LENGTH
  })
  code: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: FIELD.EXPEDIENT_SUBJECT_MAX_LENGTH
  })
  subject: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: FIELD.EXPEDIENT_COURT_MAX_LENGTH
  })
  court: string;

  @Column({
    type: 'enum',
    name: 'status_',
    enum: EXPEDIENT_STATUS,
    default: EXPEDIENT_STATUS.EJECUCION
  })
  status: EXPEDIENT_STATUS;

  @OneToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @OneToOne(() => User)
  @JoinColumn()
  updatedBy: User;

  @OneToMany(() => Part, (part) => part.expedient)
  parts: Part[];

  @OneToMany(() => Review, (review) => review.expedient)
  reviews: Review[];

  @OneToMany(() => Document, (document) => document.expedient)
  documents: Document[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
