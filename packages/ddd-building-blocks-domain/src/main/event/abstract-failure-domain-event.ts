import { AggregateId } from '../aggregate';
import { AbstractDomainEvent } from "./abstract-domain-event";
import { FailureReason } from '../result';
import { EventMetadata } from "./domain-event";

export abstract class AbstractFailureDomainEvent<
  I extends AggregateId = AggregateId,
  T extends FailureReason = FailureReason,
  M extends EventMetadata = EventMetadata
> extends AbstractDomainEvent<I, T, M> {}
