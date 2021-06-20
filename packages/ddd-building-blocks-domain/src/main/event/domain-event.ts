import { AggregateId } from '../aggregate';
import { DomainEventId } from "./domain-event-id.valueobject";
import { CausationId } from "./causation-id.valueobject";
import { CorrelationId } from "./correlation-id.valueobject";

/**
 * Domain event can be used only inside one context - for communication between aggregates and storing state in event sourcing manner.
 * Cannot be referenced from another module, because changes in those events shouldn't
 * impact on communication between modules, which may cause cascading changes.
 */
export interface DomainEvent<I extends AggregateId = AggregateId, T = any, M extends EventMetadata = EventMetadata> {
  readonly eventId: DomainEventId;
  readonly occurredAt: Date;
  readonly eventType: string;
  readonly aggregateId: I;
  readonly aggregateType: string;
  readonly data: T;
  readonly metadata: M;
}

export type EventMetadata = { causationId: CausationId, correlationId: CorrelationId }
