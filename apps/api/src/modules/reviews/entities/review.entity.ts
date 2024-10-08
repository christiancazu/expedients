import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Expedient } from 'src/modules/expedients/entities/expedient.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Expedient, (expedient) => expedient.reviews)
  expedient: Expedient;

  @OneToOne(() => User)
  @JoinColumn()
  updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
