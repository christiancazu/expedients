import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FIELD, USER_ROLES } from '@expedients/types';
import { Expedient } from 'src/modules/expedients/entities/expedient.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Document } from 'src/modules/documents/entities/document.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: FIELD.USER_EMAIL_MAX_LENGTH
  })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: FIELD.USER_FIRST_NAME_MAX_LENGTH })
  firstName: string;

  @Column({ type: 'varchar', length: FIELD.USER_LAST_NAME_MAX_LENGTH })
  lastName: string;

  @Column({
    type: 'enum',
    name: 'role',
    enumName: 'role',
    enum: USER_ROLES,
    default: USER_ROLES.PRACTICANTE
  })
  role: USER_ROLES;

  @OneToMany(() => Review, (review) => review.createdByUser)
  reviews: Review[];

  @OneToMany(() => Expedient, (expedient) => expedient.createdByUser)
  createdExpedients: Expedient[];

  @OneToMany(() => Expedient, (expedient) => expedient.assignedLawyer)
  assignedLawyerExpedients: Expedient[];

  @OneToMany(() => Expedient, (expedient) => expedient.assignedAssistant)
  assignedAssistantExpedients: Expedient[];

  @OneToMany(() => Expedient, (expedient) => expedient.updatedByUser)
  updatedExpedients: Expedient[];

  @OneToMany(() => Document, (document) => document.createdByUser)
  createdDocuments: Document[];

  @OneToMany(() => Document, (document) => document.updatedByUser)
  updatedDocuments: Document[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  async emailLowerCase(): Promise<void> {
    this.email = this.email.toLowerCase();
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    delete this.password;
    return this;
  }
}
