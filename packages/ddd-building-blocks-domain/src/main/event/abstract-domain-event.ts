import {DomainEvent, EventMetadata} from "./domain-event";
import {DomainEventId} from "./domain-event-id.valueobject";
import {AggregateId} from "../aggregate";

export abstract class AbstractDomainEvent<I extends AggregateId = AggregateId, T = any, M extends EventMetadata = EventMetadata> implements DomainEvent<I, T, M> {
  readonly eventId: DomainEventId;
  readonly occurredAt: Date;
  readonly aggregateId: I;
  readonly data: T;
  readonly metadata: M

  protected constructor(eventId: DomainEventId, occurredAt: Date, aggregateId: I, data: T, metadata: M) {
    this.eventId = eventId;
    this.occurredAt = occurredAt;
    this.aggregateId = aggregateId;
    this.data = data;
    this.metadata = metadata
  }

  get eventType(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  abstract get aggregateType(): string;

  enhance<E extends AbstractDomainEvent<I, T, M> = AbstractDomainEvent<I, T, M>>(metadata: M): AbstractDomainEvent<I, T, M> {
    return {...this, metadata: {...this.metadata, metadata}}
  }
}
