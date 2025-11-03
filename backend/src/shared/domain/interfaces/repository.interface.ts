import { BaseEntity } from '../entities/base-entity';

/**
 * Generic repository interface that all repositories should implement
 * Provides basic CRUD operations for domain entities
 */
export interface IRepository<T extends BaseEntity> {
  /**
   * Find an entity by its ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find entities with pagination
   */
  findMany(limit: number, offset: number): Promise<T[]>;

  /**
   * Save an entity (create or update)
   */
  save(entity: T): Promise<T>;

  /**
   * Delete an entity by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if an entity exists by ID
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count total entities
   */
  count(): Promise<number>;
}
