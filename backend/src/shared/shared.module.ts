import { Module } from '@nestjs/common';

/**
 * Shared module - provides common functionality across all modules
 * Contains shared services, utilities, and configurations
 */
@Module({
  providers: [],
  exports: [],
})
export class SharedModule {
  // This module primarily serves as a container for shared code
  // Utilities and exceptions are exported via barrel files (index.ts)
  // No providers needed as these are static utilities and classes
}
