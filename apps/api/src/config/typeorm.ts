import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig();

const config: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: +`${process.env.POSTGRES_PORT}`,
  username: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  entities: [`${__dirname}../../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}../../migrations/*{.ts,.js}`],
  synchronize: false
};

export const registerTypeOrm = registerAs('typeorm', () => config);
export default new DataSource(config);
