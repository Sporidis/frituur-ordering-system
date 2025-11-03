import { DomainEvent } from '../../domain/events/domain-event';

/**
 * Base interface for domain event handlers
 * Handlers process domain events and execute side effects
 */
export interface IEventHandler<TEvent extends DomainEvent> {
  handle(event: TEvent): Promise<void>;
}
