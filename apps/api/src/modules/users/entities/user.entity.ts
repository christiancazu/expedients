import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FIELD, USER_ROLES } from 'types';

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
    name: 'role_',
    enum: USER_ROLES,
    default: USER_ROLES.PRACTICANTE
  })
  role: USER_ROLES;

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
