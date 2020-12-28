import { DomainEventBus } from './domain-event-bus';
import { DomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { AbstractDomainEventBus } from './abstract-domain-event-bus';

export class RecordingDomainEventBus extends AbstractDomainEventBus {

  private readonly recordedEvents: DomainEvent[] = [];

  constructor(private readonly domainEventBus: DomainEventBus) {
    super();
  }

  publish(event: DomainEvent): any {
    this.recordedEvents.push(event);
    return this.domainEventBus.publish(event);
  }

  get recorded() {
    return [...this.recordedEvents];
  }
}
