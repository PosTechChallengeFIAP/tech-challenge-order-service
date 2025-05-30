import { envApp } from '@config/variables/app';
import { envPostgres } from '@config/variables/postgres';
import { DataSource } from 'typeorm';

export const typeOrmConnection = new DataSource({
  type: 'postgres',
  host: envPostgres.host,
  port: envPostgres.port,
  username: envPostgres.user,
  password: envPostgres.pass,
  database: envPostgres.database,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/models/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  migrationsTableName: 'custom_migration_table',
  schema: envPostgres.schema,
  ssl: envApp.environment == 'production' ? {
    rejectUnauthorized: false
  } : false
});