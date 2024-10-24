import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({
  path: '../../.env'
});

const config = {
  name: 'default',
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: +`${process.env.POSTGRES_PORT}`,
  username: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  entities: [`${__dirname}../../../dist/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}../../migrations/*{.ts,.js}`],
  synchronize: false,
  ssl: process.env.NODE_ENV === 'production',
  migrationsTableName: 'migrations'
};

export const registerTypeOrm = registerAs('typeorm', () => config);
export default new DataSource(config as DataSourceOptions);
