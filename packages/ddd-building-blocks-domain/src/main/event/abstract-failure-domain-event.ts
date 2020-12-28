import { AggregateId } from "../aggregate/aggregate-id.valueobject";
import { AbstractDomainEvent } from "./abstract-domain-event";
import { FailureReason } from "../result/failure-reason";
import { EventMetadata } from "./domain-event";

export abstract class AbstractFailureDomainEvent<
  I extends AggregateId = AggregateId,
  T extends FailureReason = FailureReason,
  M extends EventMetadata = EventMetadata
> extends AbstractDomainEvent<I, T, M> {}
