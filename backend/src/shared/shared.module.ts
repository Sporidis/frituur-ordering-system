import { Module } from '@nestjs/common';

/**
 * Shared module - provides common functionality across all modules
 * Contains shared services, utilities, and configurations
 */
@Module({
  providers: [],
  exports: [],
})
export class SharedModule {}
