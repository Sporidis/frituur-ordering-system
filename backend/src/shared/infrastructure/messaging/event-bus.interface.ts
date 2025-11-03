import { DomainEvent } from '../../domain/events/domain-event';

/**
 * Event bus interface for publishing domain events
 * Allows modules to communicate through events without direct dependencies
 */
export interface IEventBus {
  /**
   * Publish a domain event
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publish multiple domain events
   */
  publishAll(events: DomainEvent[]): Promise<void>;

  /**
   * Subscribe to domain events of a specific type
   */
  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>,
  ): void;

  /**
   * Unsubscribe from domain events
   */
  unsubscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>,
  ): void;
}
