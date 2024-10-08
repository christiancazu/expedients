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
import { EXPEDIENT_STATUS } from '../interfaces';
import { User } from 'src/modules/users/entities/user.entity';
import { Part } from 'src/modules/parts/entities/part.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Document } from 'src/modules/documents/entities/document.entity';

@Entity('expedients')
export class Expedient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  code: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  subject: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  court: string;

  @Column('enum', {
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
