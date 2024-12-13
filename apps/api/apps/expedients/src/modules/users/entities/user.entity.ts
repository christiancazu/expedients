import { FIELD, USER_ROLES } from '@expedients/shared'
import { compare, hash } from 'bcryptjs'
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Document } from '../../documents/entities/document.entity'
import { Event } from '../../events/entities/event.entity'
import { Expedient } from '../../expedients/entities/expedient.entity'
import { Notification } from '../../notifications/entities/notification.entity'
import { Review } from '../../reviews/entities/review.entity'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		unique: true,
		type: 'varchar',
		length: FIELD.USER_EMAIL_MAX_LENGTH,
	})
	email: string

	@Column({ type: 'varchar', length: 200, nullable: true })
	password?: string

	@Column({ type: 'varchar', length: FIELD.USER_FIRST_NAME_MAX_LENGTH })
	firstName: string

	@Column({ type: 'varchar', length: FIELD.USER_LAST_NAME_MAX_LENGTH })
	surname: string

	@Column({
		type: 'enum',
		name: 'role',
		enumName: 'role',
		enum: USER_ROLES,
		default: USER_ROLES.PRACTICANTE,
	})
	role: USER_ROLES

	@OneToMany(
		() => Review,
		(review) => review.createdByUser,
	)
	reviews: Review[]

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.createdByUser,
	)
	createdExpedients: Expedient[]

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.assignedLawyer,
	)
	assignedLawyerExpedients: Expedient[]

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.assignedAssistant,
	)
	assignedAssistantExpedients: Expedient[]

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.updatedByUser,
	)
	updatedExpedients: Expedient[]

	@OneToMany(
		() => Document,
		(document) => document.createdByUser,
	)
	createdDocuments: Document[]

	@OneToMany(
		() => Document,
		(document) => document.updatedByUser,
	)
	updatedDocuments: Document[]

	@OneToMany(
		() => Event,
		(event) => event.createdByUser,
	)
	events: Event[]

	@OneToMany(
		() => Notification,
		(notification) => notification.registerFor,
	)
	notifications: Notification[]

	@Column({ type: 'timestamptz', nullable: true })
	verifiedAt: Date

	@CreateDateColumn()
	createdAt: Date

	async hashPassword(password: string): Promise<string> {
		return await hash(password, 10)
	}

	@BeforeInsert()
	async emailLowerCase(): Promise<void> {
		this.email = this.email.toLowerCase()
	}

	async validatePassword(password: string): Promise<boolean> {
		return compare(password, this.password!)
	}

	comparePassword(attempt: string): Promise<boolean> {
		return compare(attempt, this.password!)
	}

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
