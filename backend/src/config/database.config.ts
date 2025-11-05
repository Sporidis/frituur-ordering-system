import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Database configuration factory
 * Returns TypeORM configuration based on environment variables
 */
export function getDatabaseConfig(): TypeOrmModuleOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const useDatabase = process.env.USE_DATABASE === 'true' || isProduction;

  // Default to InMemory if database is not enabled
  if (!useDatabase) {
    return {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: false,
      entities: [],
    };
  }

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'frituur_ordering',
    synchronize: !isProduction, // Auto-sync schema in development only
    logging: !isProduction, // Log queries in development
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
}

/**
 * Check if database is enabled
 */
export function isDatabaseEnabled(): boolean {
  return (
    process.env.USE_DATABASE === 'true' || process.env.NODE_ENV === 'production'
  );
}
