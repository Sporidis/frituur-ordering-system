import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from '@config/database.config';
import { isDatabaseEnabled } from '@config/database.config';

/**
 * Global database module that configures TypeORM
 * Can be conditionally enabled based on environment configuration
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor() {
    if (isDatabaseEnabled()) {
      console.log('✅ Database module enabled - using PostgreSQL');
    } else {
      console.log('ℹ️  Database module disabled - using InMemory repositories');
    }
  }
}
