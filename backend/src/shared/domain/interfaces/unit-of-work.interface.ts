/**
 * Unit of Work interface for managing transactions
 * Ensures data consistency across multiple operations
 */
export interface IUnitOfWork {
  /**
   * Start a new transaction
   */
  begin(): Promise<void>;

  /**
   * Commit the current transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the current transaction
   */
  rollback(): Promise<void>;

  /**
   * Execute a function within a transaction
   */
  execute<T>(fn: () => Promise<T>): Promise<T>;
}
