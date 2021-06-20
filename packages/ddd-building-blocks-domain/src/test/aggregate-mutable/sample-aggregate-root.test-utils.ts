import { AbstractDomainEvent } from '../../main';
import { DomainEventId } from '../../main';
import { AggregateId } from '../../main';
import { AbstractMutableAggregateRoot } from '../../main';
import { TimeProvider } from '../../main';
import { EventMetadata } from '../../main';
import { CausationId } from '../../main';

export class SampleAggregateId implements AggregateId {
  private readonly TYPE = "SampleAggregateId";

  private constructor(readonly raw: string) {
  }

  static of(raw: string): SampleAggregateId {
    return new SampleAggregateId(raw);
  }

  toString(): string {
    return this.raw;
  }
}

export namespace SampleDomainEvent {
  abstract class AbstractSampleAbstractDomainEvent<P = any> extends AbstractDomainEvent<SampleAggregateId, P> {
    constructor(eventId: DomainEventId, occurredAt: Date, aggregateId: SampleAggregateId, data: P, metadata: EventMetadata) {
      super(eventId, occurredAt, aggregateId, data, metadata);
    }

    get aggregateType(): string {
      return "SampleAggregateRoot";
    }
  }

  type SomethingHappenedData = {
    stringVariable: string;
    numberVariable: number;
  };

  export class SomethingHappened extends AbstractSampleAbstractDomainEvent<SomethingHappenedData> {
    static event(aggregateId: SampleAggregateId, occurredAt: Date, data: SomethingHappenedData, metadata: EventMetadata): SomethingHappened {
      return new SomethingHappened(DomainEventId.generate(), occurredAt, aggregateId, data, metadata);
    }
  }

  export class SomethingWithoutEventHandlerHappened extends AbstractSampleAbstractDomainEvent<unknown> {
    static event(aggregateId: SampleAggregateId, occurredAt: Date, data: unknown, metadata: EventMetadata): SomethingWithoutEventHandlerHappened {
      return new SomethingWithoutEventHandlerHappened(DomainEventId.generate(), occurredAt, aggregateId, data, metadata);
    }
  }
}

export class SampleAggregateRoot extends AbstractMutableAggregateRoot<SampleAggregateId> {
  private stringVariable: string | undefined;

  constructor(timeProvider: TimeProvider) {
    super(timeProvider);
  }

  doSomething(id: SampleAggregateId, command: { stringVariable: string; numberVariable: number }): void {
    const commandId = CausationId.generate();
    this.apply(
      SampleDomainEvent.SomethingHappened.event(id, this.currentDate, { ...command }, {causationId: commandId, correlationId: commandId.toCorrelation()})
    );
  }

  onSomethingHappened(event: SampleDomainEvent.SomethingHappened): void {
    this.id = event.aggregateId;
    this.stringVariable = event.data.stringVariable;
  }

  doSomethingWithoutEventHandler(): void {
    const commandId = CausationId.generate();
    this.apply(SampleDomainEvent.SomethingWithoutEventHandlerHappened.event(this.id!, this.currentDate, {}, {causationId: commandId, correlationId: commandId.toCorrelation()}));
  }
}
