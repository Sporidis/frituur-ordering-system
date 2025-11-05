import { Injectable } from '@nestjs/common';
import { isDatabaseEnabled } from '@config/database.config';

/**
 * Factory to determine which repository implementation to use
 */
@Injectable()
export class RepositoryFactory {
  /**
   * Get the repository implementation class based on configuration
   */
  static getRepository<T>(
    inMemoryClass: new (...args: any[]) => T,
    databaseClass: new (...args: any[]) => T,
  ): new (...args: any[]) => T {
    if (isDatabaseEnabled()) {
      return databaseClass;
    }
    return inMemoryClass;
  }

  /**
   * Check if database repositories should be used
   */
  static shouldUseDatabase(): boolean {
    return isDatabaseEnabled();
  }
}
