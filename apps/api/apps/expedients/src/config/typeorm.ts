import { registerAs } from '@nestjs/config'
import { config as dotenvConfig } from 'dotenv'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { Document } from '../modules/documents/entities/document.entity'
import { Event } from '../modules/events/entities/event.entity'
import { Expedient } from '../modules/expedients/entities/expedient.entity'
import { Notification } from '../modules/notifications/entities/notification.entity'
import { Part } from '../modules/parts/entities/part.entity'
import { Review } from '../modules/reviews/entities/review.entity'
import { User } from '../modules/users/entities/user.entity'

dotenvConfig({
	path: '../../.env',
})

const config = {
	name: 'default',
	type: 'postgres',
	host: `${process.env.POSTGRES_HOST}`,
	port: +`${process.env.POSTGRES_PORT}`,
	username: `${process.env.POSTGRES_USERNAME}`,
	password: `${process.env.POSTGRES_PASSWORD}`,
	database: `${process.env.POSTGRES_DATABASE}`,
	entities: [User, Document, Part, Review, Expedient, Event, Notification],
	migrations: [`${__dirname}../../migrations/*{.ts,.js}`],
	synchronize: false,
	dialectOptions: {
		ssl: process.env.NODE_ENV === 'production',
	},
	migrationsTableName: 'migrations',
}

export const registerTypeOrm = registerAs('typeorm', () => config)

export default new DataSource(config as DataSourceOptions)
