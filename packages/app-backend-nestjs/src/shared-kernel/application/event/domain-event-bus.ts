import { DomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';

export const DOMAIN_EVENT_BUS = Symbol('DOMAIN_EVENT_BUS');

export interface DomainEventBus {
  publish(event: DomainEvent): any;
  publishAll(events: DomainEvent[]): any;
}
