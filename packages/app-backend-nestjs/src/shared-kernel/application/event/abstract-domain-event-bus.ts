import { DomainEventBus } from './domain-event-bus';
import { DomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';

export const DOMAIN_EVENT_BUS = Symbol('DOMAIN_EVENT_BUS');

export abstract class AbstractDomainEventBus implements DomainEventBus {
  abstract publish(event: DomainEvent): any;

  publishAll(events: DomainEvent[]): any {
    return (events || []).map((event) => this.publish(event));
  }
}
