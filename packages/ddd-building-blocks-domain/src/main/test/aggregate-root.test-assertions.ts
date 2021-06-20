import {DomainEvent} from '../event';
import {AbstractMutableAggregateRoot} from '../aggregate-mutable';
import {AbstractDomainEvent} from '../event';

export interface Type<T> extends Function {
  new(...args: any[]): T;
}

export type ExpectedDomainEvent<T extends DomainEvent> = {
  type: Type<T>;
  data?: T["data"];
};

export function expectDomainEvent<T extends DomainEvent>(
    eventsSource: AbstractMutableAggregateRoot<any> | { events: DomainEvent[] },
    expected: ExpectedDomainEvent<T>
): void {
  const domainEvents = eventsSource instanceof AbstractMutableAggregateRoot
    ? eventsSource.getUncommittedEvents().filter(it => isDomainEvent(it))
    : eventsSource.events;
  const foundEvent = domainEvents.find(it => it instanceof expected.type);
  if (isDomainEvent(foundEvent)) {
    expect(foundEvent).toBeInstanceOf(expected.type);
    if (expected.data) {
      expect(foundEvent.data).toEqual(expected.data);
    }
  } else {
    throw new Error(`Expected domain event was not published! Domain events: ${domainEvents}`);
  }
}

export function isDomainEvent(event: unknown | undefined): event is DomainEvent {
  return event !== undefined && event instanceof AbstractDomainEvent;
}
