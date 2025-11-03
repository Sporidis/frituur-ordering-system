import { BaseEntity } from '../entities/base-entity';

/**
 * Base domain event class that all domain events should extend
 * Domain events represent something important that happened in the domain
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = this.generateEventId();
  }

  private generateEventId(): string {
    return `${this.constructor.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  abstract getEventName(): string;
}
