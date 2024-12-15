import { join } from 'node:path'
import { registerAs } from '@nestjs/config'
import { config as dotenvConfig } from 'dotenv'
import { monorepoRootSync } from 'monorepo-root'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { Document } from '../documents/entities/document.entity'
import { Event } from '../events/entities/event.entity'
import { Expedient } from '../expedients/entities/expedient.entity'
import { Notification } from '../notifications/entities/notification.entity'
import { Part } from '../parts/entities/part.entity'
import { Review } from '../reviews/entities/review.entity'
import { User } from '../users/entities/user.entity'

const config: DataSourceOptions = {
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
	migrationsTableName: 'migrations',
}

export const typeormConfig = registerAs('typeorm', () => config)

export default new DataSource(config)
