/**
 * Database interface for database operations
 * Provides abstraction over the underlying database implementation
 */
export interface IDatabase {
  /**
   * Execute a raw SQL query
   */
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Execute a raw SQL command
   */
  execute(sql: string, params?: any[]): Promise<void>;

  /**
   * Begin a transaction
   */
  beginTransaction(): Promise<ITransaction>;

  /**
   * Check if the database connection is healthy
   */
  isHealthy(): Promise<boolean>;
}

/**
 * Transaction interface for managing database transactions
 */
export interface ITransaction {
  /**
   * Commit the transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the transaction
   */
  rollback(): Promise<void>;

  /**
   * Execute a query within the transaction
   */
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Execute a command within the transaction
   */
  execute(sql: string, params?: any[]): Promise<void>;
}
