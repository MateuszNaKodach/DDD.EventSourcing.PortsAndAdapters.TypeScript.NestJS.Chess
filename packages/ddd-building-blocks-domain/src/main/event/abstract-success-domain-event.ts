import { AggregateId } from '../aggregate';
import { AbstractDomainEvent } from "./abstract-domain-event";
import { EventMetadata } from "./domain-event";

export abstract class AbstractSuccessDomainEvent<
  I extends AggregateId = AggregateId,
  T = any,
  M extends EventMetadata = EventMetadata
> extends AbstractDomainEvent<I, T, M> {
}
