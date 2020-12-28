import { DomainEventBus } from './domain-event-bus';
import { DomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { AbstractDomainEventBus } from './abstract-domain-event-bus';

export class LoggingDomainEventBus extends AbstractDomainEventBus {

  constructor(private readonly domainEventBus: DomainEventBus) {
    super();
  }

  publish(event: DomainEvent): any {
    console.log('PUBLISHING DOMAIN EVENT \n', event);
    return this.domainEventBus.publish(event);
  }
}
